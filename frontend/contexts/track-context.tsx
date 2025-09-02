'use client';

/**
 * Track Context - Central state management for Radio Calico
 * Manages current track, history, favorites and drawer state
 * Cross-component synchronization for drawer ↔ footer ↔ favorites
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { Track, TrackWithUserData, TrackContextState, TrackContextType } from '@/types/track';
import { toast } from 'sonner';
import { NEXT_PUBLIC_TRACK_HISTORY_PAGINATION_LIMIT } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { isValidTrackMetadata as isValidTrack } from '@/lib/utils/track-validation';

// Track Context State
const initialState: TrackContextState = {
  currentTrack: null,
  trackHistory: [],
  favorites: [],
  activeHistoryItem: null,
  isDrawerOpen: false,
  isLoading: false,
  hasMoreHistory: true,
  currentPage: 0,
};

// Track Context Actions
type TrackAction =
  | { type: 'SET_CURRENT_TRACK'; payload: TrackWithUserData | null }
  | { type: 'SET_ACTIVE_HISTORY_ITEM'; payload: string | null }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_TO_HISTORY'; payload: TrackWithUserData }
  | { type: 'LOAD_HISTORY'; payload: { tracks: TrackWithUserData[]; hasMore: boolean } }
  | { type: 'LOAD_MORE_HISTORY'; payload: { tracks: TrackWithUserData[]; hasMore: boolean } }
  | { type: 'LOAD_FAVORITES'; payload: TrackWithUserData[] }
  | { type: 'TOGGLE_FAVORITE_SUCCESS'; payload: { trackId: string; isFavorite: boolean } }
  | { type: 'DELETE_FROM_HISTORY_SUCCESS'; payload: string }
  | { type: 'SEARCH_HISTORY'; payload: TrackWithUserData[] }
  | { type: 'RESET_PAGINATION' };

// Track Reducer
function trackReducer(state: TrackContextState, action: TrackAction): TrackContextState {
  switch (action.type) {
    case 'SET_CURRENT_TRACK':
      return { ...state, currentTrack: action.payload };

    case 'SET_ACTIVE_HISTORY_ITEM':
      return { ...state, activeHistoryItem: action.payload };

    case 'TOGGLE_DRAWER':
      return { ...state, isDrawerOpen: !state.isDrawerOpen };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'ADD_TO_HISTORY':
      // Validate track metadata first using centralized validation
      const track = action.payload;
      
      // Don't add tracks with invalid metadata
      if (!isValidTrack(track)) {
        return state;
      }
      
      // Avoid duplicates based on title + artist + listenedAt
      const isDuplicate = state.trackHistory.some(
        historyTrack => historyTrack.title === track.title && 
        historyTrack.artist === track.artist &&
        Math.abs(new Date(historyTrack.listenedAt).getTime() - new Date(track.listenedAt).getTime()) < 5000 // 5 second tolerance
      );
      
      if (isDuplicate) return state;
      
      return {
        ...state,
        trackHistory: [track, ...state.trackHistory].slice(0, 100) // Keep max 100 items
      };

    case 'LOAD_HISTORY':
      return { 
        ...state, 
        trackHistory: action.payload.tracks, 
        hasMoreHistory: action.payload.hasMore,
        currentPage: 0  // ✅ İlk yükleme Page 0
      };

    case 'LOAD_MORE_HISTORY':
      return { 
        ...state, 
        trackHistory: [...state.trackHistory, ...action.payload.tracks],
        hasMoreHistory: action.payload.hasMore,
        currentPage: state.currentPage + 1
      };

    case 'LOAD_FAVORITES':
      return { ...state, favorites: action.payload };

    case 'TOGGLE_FAVORITE_SUCCESS':
      const { trackId, isFavorite } = action.payload;
      
      // Find track from trackHistory or current track
      const foundTrack = state.trackHistory.find(t => t.id === trackId) || 
                        (state.currentTrack?.id === trackId ? state.currentTrack : null);
      
      return {
        ...state,
        trackHistory: state.trackHistory.map(track =>
          track.id === trackId ? { ...track, isFavorite } : track
        ),
        favorites: isFavorite && foundTrack
          ? [...state.favorites.filter(t => t.id !== trackId), { ...foundTrack, isFavorite: true }]
          : state.favorites.filter(track => track.id !== trackId),
        currentTrack: state.currentTrack?.id === trackId 
          ? { ...state.currentTrack, isFavorite } 
          : state.currentTrack
      };

    case 'DELETE_FROM_HISTORY_SUCCESS':
      return {
        ...state,
        trackHistory: state.trackHistory.filter(track => track.id !== action.payload),
        favorites: state.favorites.filter(track => track.id !== action.payload),
        activeHistoryItem: state.activeHistoryItem === action.payload ? null : state.activeHistoryItem
      };

    case 'SEARCH_HISTORY':
      return { ...state, trackHistory: action.payload };

    case 'RESET_PAGINATION':
      return { 
        ...state, 
        trackHistory: [], 
        hasMoreHistory: true, 
        currentPage: 0 
      };

    default:
      return state;
  }
}

// Track Context
const TrackContext = createContext<TrackContextType | null>(null);

// Track Provider Props
interface TrackProviderProps {
  children: React.ReactNode;
}

// Track Provider Component
export function TrackProvider({ children }: TrackProviderProps) {
  const [state, dispatch] = useReducer(trackReducer, initialState);

  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Load initial data only if user is authenticated and not on auth routes
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    
    // Skip API calls on auth routes for better UX
    const isAuthRoute = pathname?.startsWith('/auth');
    if (isAuthRoute) return;
    
    if (status === 'authenticated' && session?.user) {
      loadTrackHistory();
      loadFavorites();
    }
  }, [status, session, pathname]);

  // Load track history from API
  const loadTrackHistory = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(`/api/tracks/history?page=0&limit=${NEXT_PUBLIC_TRACK_HISTORY_PAGINATION_LIMIT}`);
      const data = await response.json();
      
      if (response.ok) {
        dispatch({ 
          type: 'LOAD_HISTORY', 
          payload: { 
            tracks: data.tracks, 
            hasMore: data.hasMore || false 
          } 
        });
      } else {
        console.error('Track history API error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        toast.error('Failed to load track history');
      }
    } catch (error) {
      console.error('Error loading track history:', error);
      toast.error('Failed to load track history');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Load favorites from API
  const loadFavorites = useCallback(async () => {
    try {
      const response = await fetch('/api/tracks/favorites');
      const data = await response.json();
      
      if (response.ok) {
        dispatch({ type: 'LOAD_FAVORITES', payload: data.favorites });
      } else {
        console.error('Favorites API error:', {
          status: response.status,
          statusText: response.statusText,
          data
        });
        toast.error('Failed to load favorites');
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    }
  }, []);

  // Validate track metadata (prevent generic/placeholder tracks)
  // Now using centralized validation
  const isValidTrackMetadata = useCallback((track: TrackWithUserData): boolean => {
    return isValidTrack(track);
  }, []);

  // Set current track
  const setCurrentTrack = useCallback((track: TrackWithUserData | null, isActivelyListening = false) => {
    dispatch({ type: 'SET_CURRENT_TRACK', payload: track });
    
    // Add to history only if:
    // 1. Track has valid metadata
    // 2. User is actively listening (radio is playing)
    if (track && isValidTrackMetadata(track) && isActivelyListening) {
      console.log('🎵 Adding track to history - User is actively listening:', track.title);
      dispatch({ type: 'ADD_TO_HISTORY', payload: track });
    } else if (track && isValidTrackMetadata(track) && !isActivelyListening) {
      console.log('🎵 Not adding to history - User is not actively listening:', track.title);
    }
  }, [isValidTrackMetadata]);;

  // Set active history item
  const setActiveHistoryItem = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_HISTORY_ITEM', payload: id });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback(async (trackId: string) => {
    // Search in trackHistory first, then in favorites array
    let track = state.trackHistory.find(t => t.id === trackId);
    if (!track) {
      track = state.favorites.find(t => t.id === trackId);
    }
    if (!track) return;

    const newFavoriteState = !track.isFavorite;
    
    // Check if adding to favorites conflicts with down rating
    if (newFavoriteState) {
      try {
        const userData = await getUserTrackData(trackId);
        if (userData?.userRating === -1) {
          toast.error('Cannot add to favorites a track you rated down. Remove rating first.');
          return;
        }
      } catch (error) {
        console.error('Error checking user rating:', error);
      }
    }
    
    try {
      const response = await fetch(`/api/tracks/${trackId}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: newFavoriteState })
      });

      if (response.ok) {
        dispatch({ 
          type: 'TOGGLE_FAVORITE_SUCCESS', 
          payload: { trackId, isFavorite: newFavoriteState }
        });
        toast.success(newFavoriteState ? 'Added to favorites' : 'Removed from favorites');
      } else {
        toast.error('Failed to update favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorite');
    }
  }, [state.trackHistory]);

  // Rate track (1-5 scale gets converted to upvote/downvote in API)
  const rateTrack = useCallback(async (trackId: string, rating: number | null) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}/rating`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Track ${rating && rating >= 4 ? 'upvoted' : rating && rating <= 2 ? 'downvoted' : 'rating removed'}`);
        // Optionally refresh track data to show updated global rating
        loadTrackHistory();
      } else {
        toast.error('Failed to rate track');
      }
    } catch (error) {
      console.error('Error rating track:', error);
      toast.error('Failed to rate track');
    }
  }, [loadTrackHistory]);

  // Delete from history
  const deleteFromHistory = useCallback(async (trackId: string) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        dispatch({ type: 'DELETE_FROM_HISTORY_SUCCESS', payload: trackId });
        toast.success('Track removed from history');
      } else {
        toast.error('Failed to delete track');
      }
    } catch (error) {
      console.error('Error deleting track:', error);
      toast.error('Failed to delete track');
    }
  }, []);

  // Toggle drawer
  const toggleDrawer = useCallback(() => {
    dispatch({ type: 'TOGGLE_DRAWER' });
  }, []);

  // Add to history (manual add)
  const addToHistory = useCallback((track: TrackWithUserData) => {
    // Only add tracks with valid metadata
    if (isValidTrackMetadata(track)) {
      dispatch({ type: 'ADD_TO_HISTORY', payload: track });
    }
  }, [isValidTrackMetadata]);

  // Load more history (pagination)
  const loadMoreHistory = useCallback(async () => {
    // Don't load more if already loading or no more data available
    if (state.isLoading || !state.hasMoreHistory) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const nextPage = state.currentPage + 1;
      
      const response = await fetch(`/api/tracks/history?page=${nextPage}&limit=${NEXT_PUBLIC_TRACK_HISTORY_PAGINATION_LIMIT}`);
      const data = await response.json();
      
      if (response.ok) {
        dispatch({ 
          type: 'LOAD_MORE_HISTORY', 
          payload: { 
            tracks: data.tracks || [], 
            hasMore: data.hasMore || false 
          } 
        });
      }
    } catch (error) {
      console.error('Error loading more history:', error);
      toast.error('Failed to load more history');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.isLoading, state.hasMoreHistory, state.currentPage]);

  // Search history
  const searchHistory = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadTrackHistory();
      return;
    }

    try {
      const response = await fetch(`/api/tracks/history/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (response.ok) {
        dispatch({ type: 'SEARCH_HISTORY', payload: data.tracks });
      } else {
        toast.error('Failed to search history');
      }
    } catch (error) {
      console.error('Error searching history:', error);
      toast.error('Failed to search history');
    }
  }, [loadTrackHistory]);

  // Get user-specific track data (rating, favorite status)
  const getUserTrackData = useCallback(async (trackId: string) => {
    if (!session?.user) {
      return null;
    }

    try {
      const response = await fetch(`/api/tracks/${trackId}/user-data`);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        isFavorite: data.isFavorite || false,
        userRating: data.userRating || null // -1: downvote, 0: neutral, 1: upvote
      };
    } catch (error) {
      console.error('Error fetching user track data:', error);
      return null;
    }
  }, [session]);

  // Context value
  const value: TrackContextType = {
    ...state,
    setCurrentTrack,
    setActiveHistoryItem,
    toggleFavorite,
    rateTrack,
    deleteFromHistory,
    toggleDrawer,
    addToHistory,
    loadMoreHistory,
    searchHistory,
    getUserTrackData,
  };

  return (
    <TrackContext.Provider value={value}>
      {children}
    </TrackContext.Provider>
  );
}

// useTrack Hook
export function useTrack(): TrackContextType {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error('useTrack must be used within a TrackProvider');
  }
  return context;
}

// Export context for external use
export { TrackContext };
/**
 * Track Type Definitions for Radio Calico MVP
 * Central type definitions for track management, favorites, and history
 */

/**
 * Global Track interface - Track data shared across all users
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  date?: string | null; // year as string to match metadata
  albumArt?: string | null; // unique album art URL
  duration?: number | null;
  streamUrl?: string | null;
  isrc?: string | null;
  bitDepth?: number | null;
  sampleRate?: number | null;
  isNew?: boolean;
  isSummer?: boolean;
  isVidgames?: boolean;
  prevData?: any | null; // JSON data for previous tracks
  
  // Global track statistics
  usersListened?: string[]; // Array of user IDs
  totalListens?: number;
  upvotes?: number;
  downvotes?: number;
  rating?: number; // Global calculated rating
  favoriteCount?: number;
  
  // Track metadata
  firstListenedAt?: Date;
  lastListenedAt?: Date;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * UserTrack interface - Individual user's relationship with tracks
 */
export interface UserTrack {
  id: string;
  userId: string;
  trackId: string;
  listenedAt: Date;
  isFavorite: boolean;
  userRating?: number | null; // -1 downvote, 1 upvote, null no vote
  listenCount: number;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  track?: Track; // Optional populated track data
}

/**
 * Combined track data with user-specific information
 * Used for API responses and UI components
 */
export interface TrackWithUserData {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  albumArt?: string | null;
  
  // Global track data
  globalRating?: number;
  totalListens?: number;
  upvotes?: number;
  downvotes?: number;
  favoriteCount?: number;
  createdAt: Date;
  updatedAt: Date;
  
  // User-specific data (from UserTrack)
  isFavorite: boolean;
  userRating?: number | null;
  listenedAt: Date;
  listenCount: number;
  userId: string; // For backward compatibility
}

export interface TrackContextState {
  currentTrack: TrackWithUserData | null;
  trackHistory: TrackWithUserData[];
  favorites: TrackWithUserData[];
  activeHistoryItem: string | null;
  isDrawerOpen: boolean;
  isLoading: boolean;
  hasMoreHistory: boolean;
  currentPage: number;
}

export interface TrackContextActions {
  setCurrentTrack: (track: TrackWithUserData | null, isActivelyListening?: boolean) => void; // Added isActivelyListening parameter
  setActiveHistoryItem: (id: string | null) => void;
  toggleFavorite: (trackId: string) => Promise<void>;
  rateTrack: (trackId: string, rating: number | null) => Promise<void>; // New rating action
  deleteFromHistory: (trackId: string) => Promise<void>;
  toggleDrawer: () => void;
  addToHistory: (track: TrackWithUserData) => void;
  loadMoreHistory: () => Promise<void>;
  searchHistory: (query: string) => void;
  getUserTrackData: (trackId: string) => Promise<{ isFavorite: boolean; userRating: number | null } | null>; // Get user-specific data for a track
}

export type TrackContextType = TrackContextState & TrackContextActions;

export interface UserPreferences {
  id: string;
  userId: string;
  recentTracksVisible: boolean;
  drawerAutoOpen: boolean;
  theme: string;
  maxHistoryItems: number;
  showCoverArt: boolean;
  autoMarkFavorites: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamMetadata {
  title: string;
  artist: string;
  album?: string;
  coverArt?: string;
  duration?: number;
  isrc?: string;
}

export interface TrackAction {
  type: 'PLAY' | 'PAUSE' | 'FAVORITE' | 'UNFAVORITE' | 'DELETE' | 'RATE';
  trackId: string;
  rating?: number;
}

// API Response types
export interface TracksResponse {
  tracks: TrackWithUserData[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface FavoritesResponse {
  favorites: TrackWithUserData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}



// Component props types
export interface TrackItemProps {
  track: TrackWithUserData;
  isActive?: boolean;
  showActions?: boolean;
  onSelect?: (track: TrackWithUserData) => void;
  onFavoriteToggle?: (trackId: string) => void;
  onRate?: (trackId: string, rating: number | null) => void; // Updated for new rating system
  onDelete?: (trackId: string) => void;
}

export interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  duration?: number;
  currentTime: number;
}

export interface SearchFilters {
  query?: string;
  artist?: string;
  album?: string;
  isFavorite?: boolean;
  userRating?: number; // -1, 0, 1 for user's rating
  globalRating?: number; // Global track rating filter
  dateFrom?: Date;
  dateTo?: Date;
}
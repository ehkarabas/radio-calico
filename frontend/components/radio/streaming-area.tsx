'use client';

/**
 * Streaming Area Component - Radio Calico MVP Core Experience
 * Modern radio player with live stream metadata integration
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTrack } from '@/contexts/track-context';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { NEXT_PUBLIC_RADIO_STREAM_URL, NEXT_PUBLIC_METADATA_REFETCH_TIME } from '@/lib/constants';

interface StreamingAreaProps {
  streamUrl?: string;
}

export function StreamingArea({ streamUrl }: StreamingAreaProps) {
  const { currentTrack, setCurrentTrack, toggleFavorite, rateTrack, getUserTrackData } = useTrack();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [hlsInstance, setHlsInstance] = useState<any>(null);
  const [userRating, setUserRating] = useState<number | null>(null); // -1: down, 0: none, 1: up
  const audioRef = useRef<HTMLAudioElement>(null);

  // Stream URL from constants or prop
  const radioStreamUrl = streamUrl || NEXT_PUBLIC_RADIO_STREAM_URL;

  // Initialize HLS.js
  useEffect(() => {
    if (!audioRef.current || !radioStreamUrl) return;

    const initializeHLS = async () => {
      try {
        const Hls = (await import('hls.js')).default;
        
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 30, // Reduce back buffer to prevent overflow
            maxBufferLength: 60, // Limit max buffer length
            maxMaxBufferLength: 120, // Absolute max buffer
            maxBufferSize: 60 * 1000 * 1000, // 60MB buffer limit
            maxBufferHole: 0.5, // Allow small holes in buffer
            highBufferWatchdogPeriod: 2, // Check for buffer issues every 2 seconds
            nudgeOffset: 0.1, // Small nudge to prevent stalls
            nudgeMaxRetry: 3, // Max retries for nudging
            maxFragLookUpTolerance: 0.25, // Fragment lookup tolerance
            liveSyncDurationCount: 3, // Live sync segments count
            liveMaxLatencyDurationCount: 10, // Max latency segments
            enableSoftwareAES: true, // Enable software AES if needed
            startPosition: -1 // Start at live edge
          });
          
          hls.loadSource(radioStreamUrl);
          hls.attachMedia(audioRef.current!);
          
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log('HLS: Media attached');
          });
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS: Manifest parsed');
            setIsLoading(false);
          });
          
          hls.on(Hls.Events.ERROR, (event, data) => {
            // Only log non-buffer errors to avoid spam
            if (data.details !== 'bufferFullError') {
              console.error('HLS Error:', data);
            }
            
            // Handle specific error types
            if (data.details === 'bufferFullError') {
              // Buffer full error - try to clear buffer and continue
              console.log('HLS: Buffer full, attempting to clear buffer');
              try {
                if (audioRef.current) {
                  // Pause briefly and resume to clear buffer
                  const wasPlaying = !audioRef.current.paused;
                  audioRef.current.pause();
                  setTimeout(() => {
                    if (audioRef.current && wasPlaying) {
                      audioRef.current.play().catch(console.error);
                    }
                  }, 100);
                }
              } catch (error) {
                console.error('Buffer clearing failed:', error);
              }
              return; // Don't treat as fatal
            }
            
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.log('Fatal network error encountered, try to recover');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.log('Fatal media error encountered, try to recover');
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  setIsLoading(false);
                  setIsPlaying(false);
                  toast.error('Failed to load radio stream');
                  break;
              }
            }
          });
          
          setHlsInstance(hls);
        } else if (audioRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS support
          if (audioRef.current) {
            audioRef.current.src = radioStreamUrl;
          }
        } else {
          toast.error('HLS not supported in this browser');
        }
      } catch (error) {
        console.error('HLS initialization error:', error);
        toast.error('Failed to initialize radio player');
      }
    };

    initializeHLS();

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [radioStreamUrl]);

  // Fetch current track metadata from stream
  const fetchCurrentTrack = useCallback(async () => {
    try {
      setIsLoadingMetadata(true);
      const response = await fetch('/api/stream/metadata');
      const data = await response.json();
      
      if (response.ok && data.track) {
        setCurrentTrack(data.track, isPlaying); // Pass isPlaying state
        if (data.isNew) {
          toast.success(`Now playing: ${data.track.title} - ${data.track.artist}`);
        }
      } else {
        console.error('Failed to fetch track metadata:', data);
        // Show error to user - no fallback to mock data
        toast.error('No metadata available from radio stream');
        
        // Set a basic "Live Stream" track without mock song data
        setCurrentTrack({
          id: 'live-stream-no-metadata',
          title: 'Live Stream',
          artist: 'Radio Calico',
          album: 'Live Broadcasting',
          albumArt: '/placeholder-cover.svg',
          isFavorite: false,
          userId: '',
          listenedAt: new Date(),
          listenCount: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, isPlaying);
      }
    } catch (error) {
      console.error('Error fetching current track:', error);
      toast.error('Failed to connect to radio stream metadata');
      
      // Set a basic "Live Stream" track without mock song data
      setCurrentTrack({
        id: 'live-stream-error',
        title: 'Live Stream',
        artist: 'Radio Calico',
        album: 'Live Broadcasting',
        albumArt: '/placeholder-cover.svg',
        isFavorite: false,
        userId: '',
        listenedAt: new Date(),
        listenCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, isPlaying);
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [setCurrentTrack, isPlaying]);

  // Load initial metadata preview on mount (without creating tracks)
  useEffect(() => {
    const fetchMetadataPreview = async () => {
      try {
        setIsLoadingMetadata(true);
        const response = await fetch('/api/stream/metadata-preview');
        const data = await response.json();
        
        if (response.ok && data.track) {
          setCurrentTrack(data.track, false); // Always pass false for preview
        } else {
          console.log('🎵 No preview metadata available, using basic track');
          setCurrentTrack({
            id: 'live-stream-preview',
            title: 'Live Stream',
            artist: 'Radio Calico',
            album: 'Live Broadcasting',
            albumArt: '/placeholder-cover.svg',
            isFavorite: false,
            userId: '',
            listenedAt: new Date(),
            listenCount: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          }, false);
        }
      } catch (error) {
        console.error('Error fetching metadata preview:', error);
        setCurrentTrack({
          id: 'live-stream-preview-error',
          title: 'Live Stream',
          artist: 'Radio Calico', 
          album: 'Live Broadcasting',
          albumArt: '/placeholder-cover.svg',
          isFavorite: false,
          userId: '',
          listenedAt: new Date(),
          listenCount: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }, false);
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    // Only fetch preview on initial mount (component load)
    fetchMetadataPreview();
  }, []); // Empty dependency array - only runs on mount

  // Setup conditional auto-refresh - ONLY when radio is playing
  useEffect(() => {
    // Only set up auto-refresh interval if radio is playing
    if (isPlaying) {
      console.log(`🎵 Starting auto metadata refresh (${Number(NEXT_PUBLIC_METADATA_REFETCH_TIME)/1000}s interval) - Radio is playing`);
      
      // Fetch immediately when starting to play (creates tracks)
      fetchCurrentTrack();
      
      // Then setup interval for continuous updates
      const metadataInterval = setInterval(fetchCurrentTrack, Number(NEXT_PUBLIC_METADATA_REFETCH_TIME));
      
      return () => {
        console.log('🎵 Stopping auto metadata refresh - Radio stopped or component unmounted');
        clearInterval(metadataInterval);
      };
    } else {
      console.log('🎵 Auto metadata refresh paused - Radio is stopped');
    }
  }, [fetchCurrentTrack, isPlaying]); // Only runs when playing state changes

  // Load user track data when track changes (for persistence)
  useEffect(() => {
    const loadUserTrackData = async () => {
      if (!currentTrack || currentTrack.id.startsWith('live-stream')) {
        setUserRating(null);
        return;
      }

      try {
        const userData = await getUserTrackData(currentTrack.id);
        if (userData) {
          // Convert API userRating to local state format
          // API: -1 (downvote), 0 (neutral), 1 (upvote), null (no rating)
          // Local: -1 (down), null (none), 1 (up)
          const localRating = userData.userRating === 0 ? null : userData.userRating;
          setUserRating(localRating);
          
          console.log('🎵 User track data loaded:', {
            trackId: currentTrack.id,
            isFavorite: userData.isFavorite,
            userRating: userData.userRating,
            localRating
          });
        } else {
          setUserRating(null); // No user data found
        }
      } catch (error) {
        console.error('Error loading user track data:', error);
        setUserRating(null);
      }
    };

    loadUserTrackData();
  }, [currentTrack?.id, getUserTrackData]);

  // Display track - use currentTrack from context
  const displayTrack = currentTrack || {
    id: 'live-stream-loading',
    title: 'Loading...',
    artist: 'Radio Calico',
    album: 'Live Broadcasting',
    albumArt: '/placeholder-cover.svg',
    isFavorite: false,
    userId: '',
    listenCount: 1,
    listenedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => {
      console.log('Audio: Loading started');
      setIsLoading(true);
    };
    const handleCanPlay = () => {
      console.log('Audio: Can play - clearing loading');
      setIsLoading(false);
    };
    const handleLoadedData = () => {
      console.log('Audio: Data loaded - clearing loading');
      setIsLoading(false);
    };
    const handleError = () => {
      console.log('Audio: Error occurred');
      setIsLoading(false);
      setIsPlaying(false);
      toast.error('Failed to load radio stream');
    };
    const handlePlay = () => {
      console.log('Audio: Started playing');
      setIsPlaying(true);
      setIsLoading(false); // Ensure loading is cleared when playing
    };
    const handlePause = () => {
      console.log('Audio: Paused');
      setIsPlaying(false);
      setIsLoading(false); // Ensure loading is cleared when paused
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Play/Pause handler
  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio || !radioStreamUrl) {
      toast.error('Radio stream URL not available');
      return;
    }

    try {
      if (isPlaying) {
        audio.pause();
        toast.success('Radio paused');
      } else {
        setIsLoading(true);
        await audio.play();
        // Don't set loading false here - let the canplay event handle it
        toast.success('Radio playing');
        
        // Metadata will be fetched automatically by useEffect when isPlaying becomes true
      }
    } catch (error) {
      console.error('Play/pause error:', error);
      setIsLoading(false);
      setIsPlaying(false);
      toast.error('Failed to play radio stream');
    }
  };

  // Volume handler
  const handleVolumeChange = (newVolume: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    setVolume(newVolume);
    audio.volume = newVolume[0] / 100;
    
    if (newVolume[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Mute toggle
  const handleMuteToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume[0] / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  // Rate handlers with state management
  const handleRating = async (type: 'up' | 'down') => {
    if (!currentTrack || currentTrack.id.startsWith('live-stream')) {
      toast.info('Please wait for track metadata to load');
      return;
    }

    // Check if rating action conflicts with favorite status
    if (type === 'down' && currentTrack.isFavorite) {
      toast.error('Cannot rate down a favorite track. Remove from favorites first.');
      return;
    }

    try {
      const newRating = userRating === (type === 'up' ? 1 : -1) ? 0 : (type === 'up' ? 1 : -1);
      const apiRating = newRating === 1 ? 5 : newRating === -1 ? 1 : 3; // Convert to API format
      
      const response = await fetch(`/api/tracks/${currentTrack.id}/rating`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: apiRating })
      });

      if (response.ok) {
        setUserRating(newRating);
        const action = newRating === 1 ? 'upvoted' : newRating === -1 ? 'downvoted' : (type === 'up' ? 'upvote removed' : 'downvote removed');
        toast.success(`Track ${action}`);
      } else {
        toast.error('Failed to rate track');
      }
    } catch (error) {
      console.error('Error rating track:', error);
      toast.error('Failed to rate track');
    }
  };

  // Favorite handler - Now works with real tracks
  const handleFavoriteToggle = () => {
    if (!currentTrack || currentTrack.id.startsWith('live-stream')) {
      toast.info('Please wait for track metadata to load');
      return;
    }

    // Check if favorite action conflicts with down rating
    if (!currentTrack.isFavorite && userRating === -1) {
      toast.error('Cannot add to favorites a track you rated down. Remove rating first.');
      return;
    }

    toggleFavorite(currentTrack.id);
  };

  // Manual metadata refresh
  const handleRefreshMetadata = async () => {
    try {
      setIsLoadingMetadata(true);
      
      if (isPlaying) {
        // If playing, use full metadata endpoint (creates tracks)
        const response = await fetch('/api/stream/metadata', {
          method: 'POST'
        });
        const data = await response.json();
        
        if (response.ok && data.track) {
          setCurrentTrack(data.track, isPlaying);
          toast.success(`Refreshed: ${data.track.title} - ${data.track.artist}`);
        } else {
          console.error('Failed to refresh metadata:', data);
          toast.error('No metadata available from radio stream');
        }
      } else {
        // If not playing, use preview endpoint (no track creation)
        const response = await fetch('/api/stream/metadata-preview');
        const data = await response.json();
        
        if (response.ok && data.track) {
          setCurrentTrack(data.track, false);
          toast.success(`Preview refreshed: ${data.track.title} - ${data.track.artist}`);
        } else {
          console.error('Failed to refresh preview metadata:', data);
          toast.error('No metadata available from radio stream');
        }
      }
    } catch (error) {
      console.error('Error refreshing metadata:', error);
      toast.error('Failed to refresh track metadata');
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  return (
    <motion.div
      className="flex-1 p-2 xs:p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          preload="none"
          crossOrigin="anonymous"
        />

        {/* Track Info */}
        <motion.div 
          className="text-center mb-8"
          layout
        >
          <div className="relative inline-block mb-4">
            <motion.img
              src={displayTrack.albumArt || '/placeholder-cover.svg'}
              alt={`${displayTrack.title} cover`}
              className="w-32 h-32 xs:w-40 xs:h-40 md:w-48 md:h-48 rounded-lg shadow-lg mx-auto"
              animate={{ scale: isPlaying ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            />
            {isLoadingMetadata && (
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          <motion.h2 
            className="text-xl xs:text-2xl md:text-3xl font-bold mb-2 text-foreground"
            key={displayTrack.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {displayTrack.title}
          </motion.h2>
          
          <motion.p 
            className="text-lg xs:text-xl text-muted-foreground mb-1"
            key={displayTrack.artist}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {displayTrack.artist}
          </motion.p>
          
          {displayTrack.album && (
            <motion.p 
              className="text-sm xs:text-base text-muted-foreground"
              key={displayTrack.album}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {displayTrack.album}
            </motion.p>
          )}
        </motion.div>

        {/* Play Controls */}
        <div className="flex items-center justify-center gap-4 xs:gap-6 mb-8">
          {/* Rate Down */}
          <Button
            variant="ghost"
            size="icon"
            className={`btn h-10 w-10 xs:h-12 xs:w-12 hover:opacity-80 transition-opacity ${
              userRating === -1 ? 'text-red-500 bg-red-50 dark:bg-red-950' : ''
            }`}
            onClick={() => handleRating('down')}
            disabled={!isPlaying || !currentTrack || currentTrack.id.startsWith('live-stream')}
          >
            <ThumbsDown className={`h-5 w-5 xs:h-6 xs:w-6 ${userRating === -1 ? 'fill-current' : ''}`} />
          </Button>

          {/* Play/Pause */}
          <Button
            variant="default"
            size="lg"
            className="btn h-12 w-12 xs:h-16 xs:w-16 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 hover:opacity-80 transition-opacity"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 xs:h-8 xs:w-8" />
            ) : (
              <Play className="h-6 w-6 xs:h-8 xs:w-8 ml-1" />
            )}
          </Button>

          {/* Rate Up */}
          <Button
            variant="ghost"
            size="icon"
            className={`btn h-10 w-10 xs:h-12 xs:w-12 hover:opacity-80 transition-opacity ${
              userRating === 1 ? 'text-green-500 bg-green-50 dark:bg-green-950' : ''
            }`}
            onClick={() => handleRating('up')}
            disabled={!isPlaying || !currentTrack || currentTrack.id.startsWith('live-stream')}
          >
            <ThumbsUp className={`h-5 w-5 xs:h-6 xs:w-6 ${userRating === 1 ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-center gap-4 xs:gap-6 mb-8">
          {/* Favorite */}
          <Button
            variant="ghost"
            size="icon"
            className={`btn h-10 w-10 xs:h-12 xs:w-12 hover:opacity-80 transition-opacity ${
              displayTrack.isFavorite ? 'text-red-500 bg-red-50 dark:bg-red-950' : ''
            }`}
            onClick={handleFavoriteToggle}
            disabled={!isPlaying || !currentTrack || currentTrack.id.startsWith('live-stream')}
          >
            <Heart 
              className={`h-5 w-5 xs:h-6 xs:w-6 ${displayTrack.isFavorite ? 'fill-current' : ''}`} 
            />
          </Button>

          {/* Refresh Metadata */}
          <Button
            variant="ghost"
            size="icon"
            className="btn h-10 w-10 xs:h-12 xs:w-12 hover:opacity-80 transition-opacity"
            onClick={handleRefreshMetadata}
            disabled={!isPlaying || isLoadingMetadata}
          >
            <RotateCcw className={`h-5 w-5 xs:h-6 xs:w-6 ${isLoadingMetadata ? 'animate-spin' : ''}`} />
          </Button>

          {/* Mute Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="btn h-10 w-10 xs:h-12 xs:w-12 hover:opacity-80 transition-opacity"
            onClick={handleMuteToggle}
            disabled={!isPlaying}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 xs:h-6 xs:w-6" />
            ) : (
              <Volume2 className="h-5 w-5 xs:h-6 xs:w-6" />
            )}
          </Button>
        </div>

        {/* Volume Slider */}
        <div className="max-w-xs mx-auto">
          <Slider
            value={isMuted ? [0] : volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-full"
            disabled={!isPlaying}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>{isMuted ? 0 : volume[0]}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Stream Status */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {isPlaying ? (
              <span className="text-green-500">● Live</span>
            ) : (
              <span className="text-gray-500">○ Stopped</span>
            )}
            {' • Radio Calico'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            HLS Stream • {hlsInstance ? 'HLS.js' : 'Native'} Player
          </p>
        </div>
      </div>
    </motion.div>
  );
}
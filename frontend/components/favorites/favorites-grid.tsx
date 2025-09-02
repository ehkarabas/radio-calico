'use client';

/**
 * Favorites Grid Component - Radio Calico Favorites Display
 * Grid layout with track cards, hover actions, and infinite scroll
 * Similar to gallery system but for favorite tracks
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTrack } from '@/contexts/track-context';
import { Track } from '@/types/track';
import { 
  Heart, 
  Play, 
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';

// Favorite Track Card Component
interface FavoriteTrackCardProps {
  track: Track;
  onUnfavorite: (trackId: string) => void;
}

function FavoriteTrackCard({ track, onUnfavorite }: FavoriteTrackCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden group cursor-pointer aspect-square">
        <CardContent className="p-3 h-full relative">
          {/* Album Art Background - Full remaining area after padding */}
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            <Image
              src={track.albumArt || '/placeholder-cover.svg'}
              alt={`${track.title} - ${track.artist}`}
              fill
              className="object-cover transition-transform group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-cover.svg';
              }}
            />
            
            {/* Favorite Badge */}
            <div className="absolute top-2 right-2 z-20">
              <div className="p-1 rounded-full bg-red-500/80 backdrop-blur-sm">
                <Heart className="h-3 w-3 text-white fill-current" />
              </div>
            </div>

            {/* Bottom Opaque Overlay with Text Content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/75 backdrop-blur-sm rounded-b-lg">
              <div className="p-3 space-y-1">
                <h3 className="font-medium text-sm truncate leading-normal text-white">
                  {track.title}
                </h3>
                <p className="text-xs text-gray-200 truncate leading-relaxed">
                  {track.artist}
                </p>
                {track.album && (
                  <p className="text-xs text-gray-300 truncate leading-relaxed">
                    {track.album}
                  </p>
                )}
              </div>
            </div>

            {/* Hover Actions Overlay - Full Card */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center z-30 rounded-lg"
                >
                  <div className="flex gap-2">
                    {/* Play Button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info('Playback feature coming soon');
                      }}
                      className="h-10 w-10 cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    >
                      <Play className="h-5 w-5" />
                    </Button>

                    {/* Remove from Favorites */}
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnfavorite(track.id);
                      }}
                      className="h-10 w-10 cursor-pointer bg-red-500/80 hover:bg-red-500/90 backdrop-blur-sm"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Empty State Component
function EmptyFavoritesState({ searchQuery }: { searchQuery: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-16"
    >
      <div className="p-4 rounded-full bg-muted mb-4">
        <Heart className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {searchQuery ? 'No matching favorites' : 'No favorites yet'}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-md">
        {searchQuery 
          ? 'Try adjusting your search terms or clear the search to see all favorites.'
          : 'Start listening to music and add your favorite tracks using the heart button.'
        }
      </p>
    </motion.div>
  );
}

// Loading State Component
function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="aspect-square animate-pulse">
          <div className="w-full h-4/5 bg-muted rounded-t-lg" />
          <div className="p-3 h-1/5 space-y-2">
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="h-2 bg-muted rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Favorites Grid Component - Only handles grid display
export function FavoritesGrid({ 
  searchQuery = '', 
  favorites: propsFavorites 
}: { 
  searchQuery?: string; 
  favorites?: Track[] 
}) {
  const { favorites: contextFavorites, toggleFavorite, isLoading } = useTrack();
  const [filteredFavorites, setFilteredFavorites] = useState<Track[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use props favorites if provided, otherwise use context favorites
  const favorites = propsFavorites || contextFavorites;

  // Filter favorites based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFavorites(favorites);
    } else {
      const filtered = favorites.filter((track) =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (track.album && track.album.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredFavorites(filtered);
    }
  }, [favorites, searchQuery]);

  // Handle unfavorite
  const handleUnfavorite = useCallback(async (trackId: string) => {
    try {
      await toggleFavorite(trackId);
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  }, [toggleFavorite]);

  return (
    <div ref={scrollRef} className="min-h-[400px]">
      {isLoading ? (
        <LoadingGrid />
      ) : filteredFavorites.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 xxxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredFavorites.map((track) => (
              <FavoriteTrackCard
                key={track.id}
                track={track}
                onUnfavorite={handleUnfavorite}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyFavoritesState searchQuery={searchQuery} />
      )}
    </div>
  );
}
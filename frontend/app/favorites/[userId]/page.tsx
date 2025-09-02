'use client';

import { FavoritesGrid } from '@/components/favorites/favorites-grid';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from "next/navigation";
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, Heart, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrack } from '@/contexts/track-context';

/**
 * Favorites Page - Dynamic Route
 * Route: /favorites/[userId]
 * User'ın kişisel favorites sayfası
 */
export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const { favorites } = useTrack();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;
  const [isValidating, setIsValidating] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter favorites based on search query
  const filteredFavorites = searchQuery.trim()
    ? favorites.filter((track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.album && track.album.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : favorites;

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.id) {
      toast.error('You must be logged in to access your favorites');
      router.replace('/auth');
      return;
    }

    // User sadece kendi favorites'ına erişebilir
    if (session.user.id !== userId) {
      toast.error('You can only access your own favorites');
      router.replace('/');
      return;
    }

    setIsValidating(false);
  }, [session, status, userId, router]);

  // Loading state
  if (status === 'loading' || isValidating) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading favorites...</span>
        </div>
      </div>
    );
  }

  // This will only render if user is authenticated and accessing their own favorites
  if (session?.user?.id === userId) {
    return (
      <div className="min-h-screen bg-background flex flex-col gap-4 items-start">
        {/* Page Header */}
        <div className="sticky top-0 z-40 w-full border-b bg-background/95">
          <div className="px-4 py-6">
            {/* Header with div1, div2, div3 layout */}
            <div className="flex justify-between items-start">
              {/* div1: Back button + Search (flex-col gap-4) */}
              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="cursor-pointer hover:bg-accent self-start min-w-fit whitespace-nowrap px-3 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden xs:inline">Back To </span>Streaming
                </Button>
                <div className="relative max-w-md">
                  <Input
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="cursor-text border-2 border-border focus:border-ring pr-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-accent cursor-pointer"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* div2: Favorites title + heart icon + description */}
              <div className="items-center gap-0.5 hidden md:flex">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="h-5 w-5 text-primary fill-current" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl xxs:text-sm xxxs:text-sm ehlogo:text-sm xs:text-base font-bold">Favorites</h1>
                  <p className="text-sm text-muted-foreground hidden md:flex">
                    Your most loved tracks collection
                  </p>
                </div>
              </div>

              {/* div3: Stats */}
              <div className="flex flex-col items-end gap-1.5 text-sm text-muted-foreground">
                <div className="items-center gap-0.5 flex md:hidden">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Heart className="h-5 w-5 text-primary fill-current" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-2xl xxs:text-sm xxxs:text-sm ehlogo:text-sm xs:text-base font-bold">Favorites</h1>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{favorites.length} favorites</span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-1">
                    <Search className="h-4 w-4" />
                    <span>{filteredFavorites.length} found</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Favorites Content */}
        <main className="w-full flex-1 flex-col gap-4 px-4 py-6">
          {/* Clear Search */}
          {searchQuery && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="cursor-pointer"
              >
                Clear search
              </Button>
            </div>
          )}

          <div className="space-y-6">
            {/* Favorites Grid */}
            <FavoritesGrid
              searchQuery={searchQuery}
              favorites={filteredFavorites}
            />
          </div>
        </main>
      </div>
    );
  }

  return null;
}
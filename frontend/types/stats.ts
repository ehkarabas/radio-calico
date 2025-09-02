// Global Statistics Types
// Stats API response types for Radio Calico platform statistics

export interface TrackStats {
  id: string
  title: string
  artist: string
  album: string | null
  albumArt: string | null
}

export interface MostPlayedTrack extends TrackStats {
  totalListens: number
}

export interface RatedTrack extends TrackStats {
  rating: number | null
  upvotes: number
  downvotes: number
}

export interface FavoritedTrack extends TrackStats {
  favoriteCount: number
}

export interface TopListener {
  id: string
  name: string
  totalTracks: number
}

export interface GlobalStats {
  mostPlayed: MostPlayedTrack[]
  highestRated: RatedTrack[]
  lowestRated: RatedTrack[]
  mostFavorited: FavoritedTrack[]
  topListeners: TopListener[]
  generatedAt: string
}

export interface StatsApiResponse {
  success?: boolean
  error?: string
  data?: GlobalStats
}
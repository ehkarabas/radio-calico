import { z } from "zod"

// User schema for frontend type safety
export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Account schema
export const AccountSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Session schema
export const SessionSchema = z.object({
  id: z.string(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Custom Authentication Schemas for Radio Calico
export const EmailVerificationSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  token: z.string(),
  expires: z.date(),
  verified: z.boolean().default(false),
  attempts: z.number().default(0),
  lastUsed: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const PasswordResetSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  expires: z.date(),
  used: z.boolean().default(false),
  attempts: z.number().default(0),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  lastUsed: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const MagicLinkSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  token: z.string(),
  expires: z.date(),
  used: z.boolean().default(false),
  attempts: z.number().default(0),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  lastUsed: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const AuthRateLimitSchema = z.object({
  id: z.string(),
  identifier: z.string(), // IP address or email
  type: z.enum(['email_verification', 'password_reset', 'magic_link']),
  attempts: z.number().default(1),
  windowStart: z.date(),
  lastAttempt: z.date(),
  blocked: z.boolean().default(false),
  blockedUntil: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
// Track schema - Core track information for radio streaming
export const TrackSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Track title is required"),
  artist: z.string().min(1, "Artist name is required"),
  album: z.string().nullable(),
  coverArt: z.string().nullable(),
  duration: z.number().nullable(), // Duration in seconds
  streamUrl: z.string().nullable(), // Optional direct track URL
  isrc: z.string().nullable(), // International Standard Recording Code
  userId: z.string(),
  listenedAt: z.date(),
  isFavorite: z.boolean().default(false),
  rating: z.number().min(0).max(5).nullable(), // 0-5 rating system
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// User preferences for radio app settings
export const UserPreferencesSchema = z.object({
  id: z.string(),
  userId: z.string(),
  recentTracksVisible: z.boolean().default(true),
  drawerAutoOpen: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  maxHistoryItems: z.number().min(10).max(1000).default(100),
  showCoverArt: z.boolean().default(true),
  autoMarkFavorites: z.boolean().default(false), // Auto-favorite highly rated tracks
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Type exports for frontend usage
export type User = z.infer<typeof UserSchema>
export type Account = z.infer<typeof AccountSchema>
export type Session = z.infer<typeof SessionSchema>
export type EmailVerification = z.infer<typeof EmailVerificationSchema>
export type PasswordReset = z.infer<typeof PasswordResetSchema>
export type MagicLink = z.infer<typeof MagicLinkSchema>
export type AuthRateLimit = z.infer<typeof AuthRateLimitSchema>
export type Track = z.infer<typeof TrackSchema>
export type UserPreferences = z.infer<typeof UserPreferencesSchema>

// Authentication Form Schemas
export const SignInSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase(),
  password: z.string().optional().refine(
    (val) => !val || (val.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?])/.test(val)),
    { message: "Password must be at least 8 characters with uppercase, lowercase, number and special character if provided" }
  ), // Magic link için password opsiyonel, girilirse güçlü şifre gerekli
  rememberMe: z.boolean().default(false).optional(),
})

export const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address").toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const MagicLinkRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase(),
})

export const PasswordResetRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase(),
})

export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const EmailVerificationRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address").toLowerCase(),
})

export const EmailVerificationConfirmSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
})

// Form schemas for user management
export const UpdateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
})

// Track management form schemas
export const CreateTrackSchema = z.object({
  title: z.string().min(1, "Track title is required").max(200, "Title too long"),
  artist: z.string().min(1, "Artist name is required").max(100, "Artist name too long"),
  album: z.string().max(100, "Album name too long").nullable().optional(),
  coverArt: z.string().url("Invalid cover art URL").nullable().optional(),
  duration: z.number().min(0, "Duration cannot be negative").nullable().optional(),
  streamUrl: z.string().url("Invalid stream URL").nullable().optional(),
  isrc: z.string().max(20, "ISRC code too long").nullable().optional(),
})

export const UpdateTrackSchema = z.object({
  title: z.string().min(1, "Track title is required").max(200, "Title too long").optional(),
  artist: z.string().min(1, "Artist name is required").max(100, "Artist name too long").optional(),
  album: z.string().max(100, "Album name too long").nullable().optional(),
  coverArt: z.string().url("Invalid cover art URL").nullable().optional(),
  isFavorite: z.boolean().optional(),
  rating: z.number().min(0).max(5).nullable().optional(),
})

export const TrackRatingSchema = z.object({
  rating: z.number().min(0, "Rating cannot be negative").max(5, "Rating cannot exceed 5"),
})

export const TrackFavoriteSchema = z.object({
  isFavorite: z.boolean(),
})

// User preferences form schema
export const UpdateUserPreferencesSchema = z.object({
  recentTracksVisible: z.boolean().optional(),
  drawerAutoOpen: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  maxHistoryItems: z.number().min(10).max(1000).optional(),
  showCoverArt: z.boolean().optional(),
  autoMarkFavorites: z.boolean().optional(),
})

// Search and filtering schemas
export const TrackSearchSchema = z.object({
  query: z.string().min(1, "Search query is required").max(100, "Query too long"),
  filters: z.object({
    artist: z.string().max(100).optional(),
    album: z.string().max(100).optional(),
    isFavorite: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
  }).optional(),
  sort: z.enum(['newest', 'oldest', 'title', 'artist', 'rating']).default('newest'),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
})

// API Response schemas
export const TrackListResponseSchema = z.object({
  tracks: z.array(TrackSchema),
  total: z.number(),
  hasMore: z.boolean(),
  nextOffset: z.number().nullable(),
})

export const FavoriteTracksResponseSchema = z.object({
  tracks: z.array(TrackSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
})

// Authentication Form Input Types
export type SignInInput = z.infer<typeof SignInSchema>
export type SignUpInput = z.infer<typeof SignUpSchema>
export type MagicLinkRequestInput = z.infer<typeof MagicLinkRequestSchema>
export type PasswordResetRequestInput = z.infer<typeof PasswordResetRequestSchema>
export type PasswordResetConfirmInput = z.infer<typeof PasswordResetConfirmSchema>
export type EmailVerificationRequestInput = z.infer<typeof EmailVerificationRequestSchema>
export type EmailVerificationConfirmInput = z.infer<typeof EmailVerificationConfirmSchema>

// Form input types
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>
export type CreateTrackInput = z.infer<typeof CreateTrackSchema>
export type UpdateTrackInput = z.infer<typeof UpdateTrackSchema>
export type TrackRatingInput = z.infer<typeof TrackRatingSchema>
export type TrackFavoriteInput = z.infer<typeof TrackFavoriteSchema>
export type UpdateUserPreferencesInput = z.infer<typeof UpdateUserPreferencesSchema>
export type TrackSearchInput = z.infer<typeof TrackSearchSchema>
export type TrackListResponse = z.infer<typeof TrackListResponseSchema>
export type FavoriteTracksResponse = z.infer<typeof FavoriteTracksResponseSchema>
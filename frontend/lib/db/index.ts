// Database utilities and schemas export
// Central export point for all database-related functionality

// Prisma client export
export { default as prisma } from '../prisma/prisma'

// User cleanup utilities
export {
  softDeleteUser,
  hardDeleteUser,
  cleanupSoftDeletedUser,
  cleanupHardDeletedUser,
  cleanupExpiredAuthData
} from './user-cleanup'

// Schema types (if exists)
export * from './schema'
/**
 * Database Types - Centralized type definitions
 * Used across components, services, and API routes
 */

export interface Profile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface SocialAccount {
  provider: 'google' | 'github';
  connected: boolean;
  disconnectedAt?: string | Date | null;
  email?: string;
  name?: string;
  reconnectRequired?: boolean;
}

export interface UpdateProfileData {
  display_name?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
  details?: any;
}
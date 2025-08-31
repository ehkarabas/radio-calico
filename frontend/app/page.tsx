/**
 * Root Page - Welcome to Radio Calico
 * Geçici olarak welcome message
 * MVP main features burada implement edilecek
 */

import { auth } from "@/lib/auth";
import { NEXT_PUBLIC_PROJECT_NAME } from '@/lib/constants';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: `Welcome to ${NEXT_PUBLIC_PROJECT_NAME} - Your modern online radio station with HLS streaming, real-time metadata, and interactive features.`,
  openGraph: {
    title: `Welcome to ${NEXT_PUBLIC_PROJECT_NAME}`,
    description: `Experience modern online radio streaming with real-time metadata and interactive features at ${NEXT_PUBLIC_PROJECT_NAME}.`,
    url: '/',
  },
  twitter: {
    title: `Welcome to ${NEXT_PUBLIC_PROJECT_NAME}`,
    description: `Experience modern online radio streaming with real-time metadata and interactive features.`,
  },
};


export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-1 xxs:px-1.5 xxxs:px-2 ehlogo:px-2 xs:px-4">
      {/* Theme Toggle - Top Right Corner - Responsive positioning */}
      <div className="absolute top-1 right-1 xxs:top-1.5 xxs:right-1.5 xxxs:top-2 xxxs:right-2 ehlogo:top-1 ehlogo:right-1 xs:top-4 xs:right-4">
        <ThemeToggle />
      </div>
      
      {/* Main Content - Mobile First Responsive */}
      <div className="text-center space-y-1.5 xxs:space-y-1.5 xxxs:space-y-2 ehlogo:space-y-1 xs:space-y-3 sm:space-y-4 max-w-full xxs:max-w-full xxxs:max-w-sm ehlogo:max-w-xs xs:max-w-md sm:max-w-lg lg:max-w-xl">
        {/* Main Heading - Progressive Text Sizing */}
        <h1 className="text-sm xxs:text-base xxxs:text-lg ehlogo:text-lg xs:text-2xl sm:text-3xl md:text-4xl font-bold text-foreground dark:text-red-500 leading-tight break-words">
          Welcome to {NEXT_PUBLIC_PROJECT_NAME}
        </h1>
        
        {/* Subtitle - Responsive Text */}
        <p className="text-xs xxs:text-[10px] xxxs:text-xs ehlogo:text-xs xs:text-base text-foreground leading-relaxed">
          MVP development in progress...
        </p>
        
        {/* User ID Display - Responsive with text wrapping */}
        <div className="text-xs xxs:text-[10px] xxxs:text-xs ehlogo:text-xs xs:text-base text-foreground break-all">
          <span className="block xs:inline">Your user id is: </span>
          <span className="text-amber-500 dark:text-amber-400 font-mono text-[10px] xxs:text-[9px] xxxs:text-[10px] ehlogo:text-[10px] xs:text-sm">
            {userId}
          </span>
        </div>
        
        {/* Navigation Links - Responsive stacking */}
        <div className="space-y-1.5 xxs:space-y-1 xxxs:space-y-1.5 ehlogo:space-y-1 xs:space-y-3 text-xs xxs:text-[10px] xxxs:text-xs ehlogo:text-xs xs:text-base">
          <p className="text-foreground">
            <span className="block xs:inline">Go to </span>
            <Link 
              href={`/profile/${userId}`} 
              className="text-sky-300 hover:text-blue-600 dark:text-sky-400 dark:hover:text-blue-400 cursor-pointer underline decoration-dotted hover:decoration-solid transition-all duration-200 break-words"
            >
              Profile Page
            </Link>
          </p>
          <p className="text-foreground">
            <span className="block xs:inline">Go to private </span>
            <Link 
              href={`/profile/${userId}/contact`} 
              className="text-sky-300 hover:text-blue-600 dark:text-sky-400 dark:hover:text-blue-400 cursor-pointer underline decoration-dotted hover:decoration-solid transition-all duration-200 break-words"
            >
              Contact Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
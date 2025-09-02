/**
 * Root Page - Welcome to Radio Calico
 * Geçici olarak welcome message
 * MVP main features burada implement edilecek
 */

import { auth } from "@/lib/auth";
import { NEXT_PUBLIC_PROJECT_NAME } from '@/lib/constants';

import { Header } from '@/components/layout/header';
import { StreamingArea } from '@/components/radio/streaming-area';
import { RecentTracksFooter } from '@/components/layout/recent-tracks-footer';
import { TrackHistoryDrawer } from '@/components/layout/track-history-drawer';
import { redirect } from 'next/navigation';
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
  
  if (!session?.user?.id) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <StreamingArea />
      <RecentTracksFooter />
      <TrackHistoryDrawer />
    </div>
  );
}
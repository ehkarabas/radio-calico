import type { Metadata } from 'next'
import { NEXT_PUBLIC_PROJECT_NAME } from '@/lib/constants'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/system/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_PROJECT_URL || 'http://localhost:3000'),
  title: {
    default: NEXT_PUBLIC_PROJECT_NAME,
    template: `%s | ${NEXT_PUBLIC_PROJECT_NAME}`,
  },
  description: 'A modern online radio station with HLS streaming, real-time metadata, rating system, and user interaction features.',
  keywords: [
    'radio',
    'online radio',
    'streaming',
    'HLS streaming',
    'music',
    'real-time metadata',
    'rating system',
    'interactive radio',
    'web radio',
    'digital radio'
  ],
  authors: [
    {
      name: 'Radio Calico Team',
      url: process.env.NEXT_PUBLIC_PROJECT_URL || 'http://localhost:3000',
    },
  ],
  creator: 'Radio Calico Team',
  publisher: 'Radio Calico',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_PROJECT_URL || 'http://localhost:3000',
    siteName: NEXT_PUBLIC_PROJECT_NAME,
    title: NEXT_PUBLIC_PROJECT_NAME,
    description: 'A modern online radio station with HLS streaming, real-time metadata, rating system, and user interaction features.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${NEXT_PUBLIC_PROJECT_NAME} - Online Radio Station`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: NEXT_PUBLIC_PROJECT_NAME,
    description: 'A modern online radio station with HLS streaming, real-time metadata, rating system.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
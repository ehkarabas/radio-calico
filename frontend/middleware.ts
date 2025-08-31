import type { NextRequest } from 'next/server'
import { authMiddleware } from '@/lib/auth/middleware'

export async function middleware(request: NextRequest) {
  // Tüm route protection logic'i NextAuth middleware'de yapılıyor
  // Session kontrolü ve route protection burada
  return await authMiddleware(request)
}

// BACKUP - Original matcher with potential performance issues:
// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// }

// OPTIMIZED - Enhanced matcher for better static file exclusion (NextJS compatible)
export const config = {
  matcher: [
    // Exclude static files, NextAuth API routes, and common assets
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
    // Include API routes but exclude auth
    '/api/((?!auth).+)',
  ],
}
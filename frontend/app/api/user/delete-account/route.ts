// API route for user account deletion (soft delete)
// User deletion with comprehensive cleanup

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { softDeleteUser } from '@/lib/db/user-cleanup'

export async function POST(request: NextRequest) {
  try {
    // Get current session to verify user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' }, 
        { status: 401 }
      )
    }

    const { email, confirmEmail } = await request.json()

    // Security check: user can only delete their own account
    if (email !== session.user.email || confirmEmail !== session.user.email) {
      return NextResponse.json(
        { success: false, message: 'Email confirmation mismatch' }, 
        { status: 400 }
      )
    }

    // Perform soft delete with comprehensive cleanup
    await softDeleteUser(email)

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Account successfully deactivated. All related data has been cleaned up.',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Delete account API error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete account. Please try again later.' 
      }, 
      { status: 500 }
    )
  }
}

// GET method for testing purposes (can be removed in production)
export async function GET() {
  return NextResponse.json({
    message: 'Account deletion endpoint is available',
    methods: ['POST'],
    requiredFields: ['email', 'confirmEmail'],
    description: 'Soft deletes user account and cleans up all related authentication data'
  })
}
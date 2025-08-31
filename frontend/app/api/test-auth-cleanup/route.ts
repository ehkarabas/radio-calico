import { NextResponse } from 'next/server'
import { UserDeleteCleanupService } from '@/lib/utils/user-delete-cleanup-service'

// Test endpoint - bypass auth for testing purposes

export async function GET() {
  try {
    console.log('🚀 Starting AuthRateLimit cleanup test via API...')
    
    const results = await UserDeleteCleanupService.runAllTests()
    
    console.log('📊 Test Results:', results)
    
    return NextResponse.json({
      success: results.overallSuccess,
      message: results.overallSuccess 
        ? 'All AuthRateLimit cleanup tests passed!' 
        : 'Some tests failed',
      results: {
        softDelete: results.softDeleteResult,
        hardDelete: results.hardDeleteResult,
        overallSuccess: results.overallSuccess
      },
      timestamp: new Date().toISOString()
    }, { status: results.overallSuccess ? 200 : 500 })
    
  } catch (error) {
    console.error('❌ AuthRateLimit cleanup test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'AuthRateLimit cleanup test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
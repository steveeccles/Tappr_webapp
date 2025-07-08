import { NextRequest, NextResponse } from 'next/server';
import { migrateExistingUsers, migrateSpecificUser } from '@/scripts/migrate-existing-users';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    // Basic auth check (in production, use proper admin authentication)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer admin-secret-key') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (action === 'migrate-all') {
      console.log('🚀 Starting migration of all users...');
      const result = await migrateExistingUsers();
      
      return NextResponse.json({
        success: true,
        message: 'Migration completed successfully',
        stats: result
      });
      
    } else if (action === 'migrate-user' && userId) {
      console.log(`🚀 Migrating specific user: ${userId}`);
      await migrateSpecificUser(userId);
      
      return NextResponse.json({
        success: true,
        message: `User ${userId} migrated successfully`
      });
      
    } else {
      return NextResponse.json(
        { error: 'Invalid action or missing parameters' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Migration API error:', error);
    return NextResponse.json(
      { 
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check migration status
export async function GET() {
  return NextResponse.json({
    available_actions: [
      'migrate-all: Migrate all users who don\'t have dateIdeas',
      'migrate-user: Migrate specific user (requires userId parameter)'
    ],
    usage: {
      migrate_all: 'POST with {"action": "migrate-all"}',
      migrate_user: 'POST with {"action": "migrate-user", "userId": "user123"}'
    },
    auth: 'Requires Authorization header: Bearer admin-secret-key'
  });
} 
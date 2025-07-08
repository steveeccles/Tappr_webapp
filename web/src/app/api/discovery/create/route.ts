import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { targetUserId, targetUsername } = await request.json();

    if (!targetUserId || !targetUsername) {
      return NextResponse.json(
        { error: 'Target user ID and username are required' },
        { status: 400 }
      );
    }

    // Generate a unique session ID
    const sessionId = `discovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // In a real app, you would save this to your database
    // For now, we'll just return the session ID
    console.log('Creating discovery session:', {
      sessionId,
      targetUserId,
      targetUsername,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('Error creating discovery session:', error);
    return NextResponse.json(
      { error: 'Failed to create discovery session' },
      { status: 500 }
    );
  }
} 
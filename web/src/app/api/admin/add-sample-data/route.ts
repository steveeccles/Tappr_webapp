import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DateIdea } from '@/types';

const sampleDateIdeas: DateIdea[] = [
  {
    title: "Coffee & Chat",
    description: "Cozy cafe conversation",
    emoji: "☕"
  },
  {
    title: "Art Gallery",
    description: "Explore creativity together",
    emoji: "🎨"
  },
  {
    title: "Beach Walk",
    description: "Sunset stroll by the water",
    emoji: "🏖️"
  },
  {
    title: "Cooking Together",
    description: "Create delicious meals",
    emoji: "👨‍🍳"
  }
];

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // For the specific user pat_c33e3ae2, we'll update their document directly
    // In a real app, you'd query by username first
    const userDocRef = doc(db, 'users', username);
    
    // Check if user exists
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update the user with date ideas
    await updateDoc(userDocRef, {
      dateIdeas: sampleDateIdeas,
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      message: 'Sample date ideas added successfully',
      dateIdeas: sampleDateIdeas 
    });
  } catch (error) {
    console.error('Error adding sample data:', error);
    return NextResponse.json(
      { error: 'Failed to add sample data' },
      { status: 500 }
    );
  }
} 
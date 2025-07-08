import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
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
      // Create the user with sample data
      const newUser = {
        id: username,
        uid: username,
        username: username,
        name: "Patty, Pat, Patrick, Pissy P",
        bio: "Hey there! I'm always up for new adventures and meeting interesting people. Let's connect and see what amazing experiences we can share together!",
        email: "pat@pat.com",
        dateIdeas: sampleDateIdeas,
        social: {
          instagram: "pat_adventures",
          twitter: "pat_connects"
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(userDocRef, newUser);
      
      return NextResponse.json({ 
        message: 'User created successfully with sample data',
        user: newUser,
        dateIdeas: sampleDateIdeas 
      });
    } else {
      // Update existing user with date ideas
      await updateDoc(userDocRef, {
        dateIdeas: sampleDateIdeas,
        updatedAt: new Date()
      });
      
             return NextResponse.json({ 
         message: 'User updated successfully with sample data',
         dateIdeas: sampleDateIdeas 
       });
     }
  } catch (error) {
    console.error('Error adding sample data:', error);
    return NextResponse.json(
      { error: 'Failed to add sample data' },
      { status: 500 }
    );
  }
} 
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, DateIdea } from '../types';

const sampleDateIdeas: DateIdea[] = [
  {
    title: "Coffee & Chat",
    description: "Cozy cafe conversation",
    emoji: "☕"
  },
  {
    title: "Museum Visit",
    description: "Explore art together",
    emoji: "🎨"
  },
  {
    title: "Beach Walk",
    description: "Sunset stroll",
    emoji: "🏖️"
  },
  {
    title: "Cooking Class",
    description: "Learn something new",
    emoji: "👨‍🍳"
  }
];

const sampleUser: UserProfile = {
  id: 'sample-user-123',
  uid: 'sample-user-123',
  username: 'testuser',
  name: 'Alex Johnson',
  bio: 'Adventure seeker, coffee enthusiast, and art lover. Always up for trying new experiences and meeting interesting people. Let\'s create some amazing memories together!',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://alexjohnson.dev',
  dateIdeas: sampleDateIdeas,
  social: {
    instagram: 'alexjohnson',
    twitter: 'alex_codes',
    linkedin: 'alexjohnson',
    github: 'alexjohnson'
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

export async function addSampleData() {
  try {
    await setDoc(doc(db, 'users', 'sample-user-123'), sampleUser);
    console.log('Sample data added successfully!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

// If running directly
if (typeof window === 'undefined') {
  addSampleData();
} 
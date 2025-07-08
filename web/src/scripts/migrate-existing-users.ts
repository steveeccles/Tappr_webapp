import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DateIdea } from '../types';

// Default date ideas for existing users who don't have any
const defaultDateIdeas: DateIdea[] = [
  {
    title: "Coffee Chat",
    description: "Simple coffee meeting",
    emoji: "☕"
  },
  {
    title: "Walk in Park",
    description: "Casual outdoor stroll",
    emoji: "🚶‍♂️"
  },
  {
    title: "Movie Night",
    description: "Watch a film together",
    emoji: "🎬"
  },
  {
    title: "Dinner Out",
    description: "Nice restaurant meal",
    emoji: "🍽️"
  }
];

export async function migrateExistingUsers() {
  try {
    console.log('Starting user migration...');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    let processedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const userDoc of snapshot.docs) {
      try {
        const userData = userDoc.data();
        processedCount++;
        
        // Check if user already has dateIdeas
        if (!userData.dateIdeas || userData.dateIdeas.length === 0) {
          // Add default date ideas
          await updateDoc(doc(db, 'users', userDoc.id), {
            dateIdeas: defaultDateIdeas,
            migratedAt: new Date(),
            updatedAt: new Date()
          });
          
          updatedCount++;
          console.log(`✅ Updated user: ${userData.username || userDoc.id}`);
        } else {
          console.log(`⏭️  Skipped user: ${userData.username || userDoc.id} (already has date ideas)`);
        }
        
        // Add small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error updating user ${userDoc.id}:`, error);
      }
    }
    
    console.log('\n=== Migration Complete ===');
    console.log(`📊 Total users processed: ${processedCount}`);
    console.log(`✅ Users updated: ${updatedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
    return {
      processed: processedCount,
      updated: updatedCount,
      errors: errorCount
    };
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Helper function to migrate a specific user
export async function migrateSpecificUser(userId: string) {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      dateIdeas: defaultDateIdeas,
      migratedAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`✅ Successfully migrated user: ${userId}`);
  } catch (error) {
    console.error(`❌ Failed to migrate user ${userId}:`, error);
    throw error;
  }
} 
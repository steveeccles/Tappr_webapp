import { UserProfile, DateIdea } from '@/types';

// Default values for new features
const DEFAULT_DATE_IDEAS: DateIdea[] = [
  { title: "Coffee Chat", description: "Casual coffee meeting", emoji: "☕" },
  { title: "Walk & Talk", description: "Stroll through the neighborhood", emoji: "🚶‍♂️" },
  { title: "Museum Visit", description: "Explore art and culture", emoji: "🎨" },
  { title: "Cooking Together", description: "Make a meal together", emoji: "👨‍🍳" }
];

export class UserProfileService {
  /**
   * Ensures user profile has all required fields with defaults
   */
  static normalizeProfile(user: UserProfile): UserProfile {
    return {
      ...user,
      // Ensure dateIdeas exists with defaults if empty
      dateIdeas: user.dateIdeas && user.dateIdeas.length > 0 
        ? user.dateIdeas 
        : DEFAULT_DATE_IDEAS,
      
      // Ensure social object exists
      social: user.social || {},
      
      // Add any other default fields here
      bio: user.bio || '',
      
      // Migration tracking
      hasDefaultData: !user.dateIdeas || user.dateIdeas.length === 0,
      normalizedAt: new Date()
    };
  }

  /**
   * Get user profile with guaranteed complete data
   */
  static getCompleteProfile(user: UserProfile): UserProfile & {
    dateIdeas: DateIdea[];
    social: NonNullable<UserProfile['social']>;
  } {
    const normalized = this.normalizeProfile(user);
    
    return {
      ...normalized,
      dateIdeas: normalized.dateIdeas!,
      social: normalized.social!
    };
  }

  /**
   * Check if user needs migration to new data structure
   */
  static needsMigration(user: UserProfile): boolean {
    return !user.dateIdeas || 
           user.dateIdeas.length === 0 || 
           !user.social;
  }

  /**
   * Get missing fields for a user profile
   */
  static getMissingFields(user: UserProfile): string[] {
    const missing: string[] = [];
    
    if (!user.dateIdeas || user.dateIdeas.length === 0) {
      missing.push('dateIdeas');
    }
    
    if (!user.social) {
      missing.push('social');
    }
    
    if (!user.bio) {
      missing.push('bio');
    }
    
    return missing;
  }

  /**
   * Progressive enhancement - suggest what user can add
   */
  static getEnhancementSuggestions(user: UserProfile): {
    field: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[] {
    const suggestions = [];
    
    if (!user.dateIdeas || user.dateIdeas.length === 0) {
      suggestions.push({
        field: 'dateIdeas',
        description: 'Add your perfect date ideas to attract compatible matches',
        priority: 'high' as const
      });
    }
    
    if (!user.bio || user.bio.length < 50) {
      suggestions.push({
        field: 'bio',
        description: 'Write a compelling bio to tell your story',
        priority: 'high' as const
      });
    }
    
    if (!user.social || Object.keys(user.social).length === 0) {
      suggestions.push({
        field: 'social',
        description: 'Connect your social media for more visibility',
        priority: 'medium' as const
      });
    }
    
    return suggestions;
  }
} 
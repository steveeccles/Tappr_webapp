export interface DateIdea {
  title: string;
  description: string;
  emoji: string;
}

export interface UserProfile {
  id?: string;
  uid?: string; // Add uid field for compatibility
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  photoURL?: string; // Add this field
  email?: string;
  phone?: string;
  website?: string;
  dateIdeas?: DateIdea[];
  social?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  // Also add direct fields for easier access
  instagram?: string;
  linkedIn?: string;
  // Migration and enhancement tracking
  hasDefaultData?: boolean;
  normalizedAt?: Date;
  migratedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
} 
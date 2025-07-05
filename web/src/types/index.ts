export interface UserProfile {
  id?: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  website?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
} 
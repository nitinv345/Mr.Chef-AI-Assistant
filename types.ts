export type ViewState = 'HOME' | 'FAVOURITE' | 'MAKER' | 'SETTINGS' | 'RECIPE_DETAIL';

export interface Ingredient {
  name: string;
  amount?: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  videoUrl: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  isLiked: boolean;
  hasReminder: boolean;
  tags?: string[];
  likesCount: number;
}

export interface UserSettings {
  name: string;
  profilePicture: string;
  language: string;
  dietType: 'Veg' | 'Non-Veg' | 'Vegan';
  allergies: string[];
  cuisinePreferences: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Expert';
  notifications: boolean;
}

export interface VoiceCommand {
  command: string;
  action: () => void;
}

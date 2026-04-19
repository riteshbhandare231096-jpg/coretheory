export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Category =
  | "Upper Body"
  | "Lower Body"
  | "Core"
  | "Cardio"
  | "Flexibility"
  | "Strength"
  | "Balance"
  | "Mobility";

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  benefits: string[];
  durationSeconds: number;
  caloriesPerMinute: number;
}

export interface CategoryInfo {
  name: Category;
  icon: string;
  description: string;
  color: string;
}

export type SortOption = "az" | "za" | "difficulty-asc" | "difficulty-desc";

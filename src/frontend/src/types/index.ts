export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Category =
  | "Upper Body"
  | "Lower Body"
  | "Core"
  | "Cardio"
  | "Flexibility"
  | "Strength"
  | "Balance"
  | "Mobility"
  | "Warmup";

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

// ── Subscription / Auth types ──────────────────────────────────────────────

export type SubscriptionTier = "free" | "premium";

export type PlanDurationKey = "months3" | "months6" | "months9" | "months12";

export interface SubscriptionPlanUI {
  duration: PlanDurationKey;
  /** e.g. "3 Months" */
  displayLabel: string;
  /** Price in USD cents */
  priceUsdCents: number;
  stripePriceId: string;
}

export interface UserProfile {
  tier: SubscriptionTier;
  plan?: PlanDurationKey;
  /** ISO string */
  expiresAt?: string;
  /** ISO string */
  startedAt?: string;
  isDisabled?: boolean;
  udidVerified?: boolean;
  udidUploadPath?: string;
}

// ── Metric & Progress tracking types ─────────────────────────────────────────

export interface MetricEntry {
  /** Weight in kilograms */
  weightKg: number;
  /** Body fat percentage — optional */
  bodyFatPct?: number;
  /** Unix nanoseconds timestamp from backend */
  loggedAt: bigint;
}

export interface PersonalBest {
  exerciseName: string;
  weightKg: number;
  reps: bigint;
  /** Unix nanoseconds timestamp from backend */
  loggedAt: bigint;
}

// ── Science Articles types ────────────────────────────────────────────────────

export type ArticleCategory =
  | "hypertrophy"
  | "fat-loss"
  | "nutrition"
  | "recovery";

export interface ScienceArticle {
  id: bigint;
  title: string;
  category: ArticleCategory;
  summary: string;
  content: string;
  readingMinutes: bigint;
  publishedDate: string;
}

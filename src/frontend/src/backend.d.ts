import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type AiQueryResult = {
    __kind__: "ok";
    ok: {
        messagesRemaining?: bigint;
        response: string;
    };
} | {
    __kind__: "err";
    err: string;
};
export type Timestamp = bigint;
export interface WomenExercise {
    id: bigint;
    title: string;
    section: WomenExerciseSection;
    description: string;
    instructions: Array<string>;
    category: string;
    benefits: Array<string>;
    videoUrl: string;
}
export type WebhookResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type MetricResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface PersonalBest {
    reps: bigint;
    weightKg: number;
    exerciseName: string;
    loggedAt: Timestamp;
}
export type CheckoutResult = {
    __kind__: "ok";
    ok: {
        url: string;
        sessionId: string;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface UserProfilePublic {
    startedAt?: Timestamp;
    expiresAt?: Timestamp;
    stripeSubscriptionId?: string;
    userId: UserId;
    plan?: PlanDuration;
    tier: Tier;
    udidUploadPath: string;
    udidUploadTime?: Timestamp;
    stripeCustomerId?: string;
    udidVerified: boolean;
    isDisabled: boolean;
}
export interface MetricEntry {
    bodyFatPct?: number;
    weightKg: number;
    loggedAt: Timestamp;
}
export type UserId = Principal;
export type UdidUploadResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface DisabledExercise {
    id: bigint;
    title: string;
    difficulty: string;
    description: string;
    instructions: Array<string>;
    category: string;
    benefits: Array<string>;
    videoUrl: string;
}
export interface FounderDashboardStats {
    freeCount: bigint;
    months3Count: bigint;
    months6Count: bigint;
    months9Count: bigint;
    totalRevenue: bigint;
    months12Count: bigint;
}
export interface ScienceArticle {
    id: bigint;
    title: string;
    content: string;
    readingMinutes: bigint;
    publishedDate: string;
    summary: string;
    category: ArticleCategory;
}
export interface SubscriptionPlan {
    duration: PlanDuration;
    displayLabel: string;
    stripePriceId: string;
    priceUsdCents: bigint;
}
export enum ArticleCategory {
    fatLoss = "fatLoss",
    recovery = "recovery",
    hypertrophy = "hypertrophy",
    nutrition = "nutrition"
}
export enum PlanDuration {
    months12 = "months12",
    months3 = "months3",
    months6 = "months6",
    months9 = "months9"
}
export enum Tier {
    premium = "premium",
    free = "free"
}
export enum WomenExerciseSection {
    advanced = "advanced",
    basic = "basic"
}
export interface backendInterface {
    cancelSubscription(): Promise<void>;
    clearMyMetrics(): Promise<void>;
    createCheckoutSession(duration: PlanDuration): Promise<CheckoutResult>;
    getArticle(id: bigint): Promise<ScienceArticle | null>;
    getArticles(): Promise<Array<ScienceArticle>>;
    getDisabledExercises(): Promise<Array<DisabledExercise>>;
    getFounderDashboardStats(): Promise<FounderDashboardStats>;
    getIsDisabledVerified(): Promise<boolean>;
    getIsFounder(): Promise<boolean>;
    getMyMetrics(): Promise<Array<MetricEntry>>;
    getMyPersonalBests(): Promise<Array<PersonalBest>>;
    getMyProfile(): Promise<UserProfilePublic>;
    getSubscriptionPlans(): Promise<Array<SubscriptionPlan>>;
    getWomenDashboardAccess(): Promise<boolean>;
    getWomenExercises(): Promise<{
        advanced: Array<WomenExercise>;
        basic: Array<WomenExercise>;
    }>;
    logMetric(weightKg: number, bodyFatPct: number | null): Promise<MetricResult>;
    logPersonalBest(exerciseName: string, weightKg: number, reps: bigint): Promise<MetricResult>;
    queryAI(messages: Array<{
        content: string;
        role: string;
    }>): Promise<string>;
    queryAIGated(messages: Array<{
        content: string;
        role: string;
    }>, messagesInSession: bigint): Promise<AiQueryResult>;
    setApiKey(key: string): Promise<void>;
    setFounderPrincipal(p: Principal): Promise<void>;
    setStripeKey(key: string): Promise<void>;
    stripeWebhook(payload: string): Promise<WebhookResult>;
    submitUdidUpload(uploadPath: string): Promise<UdidUploadResult>;
}

import CommonTypes "common";

/// Domain types for user profiles and subscriptions.
module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  /// Subscription tier — free or premium.
  public type Tier = {
    #free;
    #premium;
  };

  /// Duration of a paid subscription plan.
  public type PlanDuration = {
    #months3;
    #months6;
    #months9;
    #months12;
  };

  /// A user's full subscription profile stored on-chain.
  public type UserProfile = {
    userId         : UserId;
    var tier       : Tier;
    var plan       : ?PlanDuration;
    var startedAt  : ?Timestamp;
    var expiresAt  : ?Timestamp;
    var stripeCustomerId : ?Text;
    var stripeSubscriptionId : ?Text;
    var isDisabled      : Bool;
    var udidVerified    : Bool;
    var udidUploadPath  : Text;
    var udidUploadTime  : ?Timestamp;
  };

  /// Immutable public projection of UserProfile (shared-type safe).
  public type UserProfilePublic = {
    userId               : UserId;
    tier                 : Tier;
    plan                 : ?PlanDuration;
    startedAt            : ?Timestamp;
    expiresAt            : ?Timestamp;
    stripeCustomerId     : ?Text;
    stripeSubscriptionId : ?Text;
    isDisabled           : Bool;
    udidVerified         : Bool;
    udidUploadPath       : Text;
    udidUploadTime       : ?Timestamp;
  };

  /// A curated exercise entry for the disabled-users dashboard.
  public type DisabledExercise = {
    id          : Nat;
    title       : Text;
    category    : Text;
    description : Text;
    difficulty  : Text;
    videoUrl    : Text;
    instructions: [Text];
    benefits    : [Text];
  };

  /// Section tag for women's exercise entries.
  public type WomenExerciseSection = {
    #basic;
    #advanced;
  };

  /// A curated exercise entry for the women's fitness dashboard.
  public type WomenExercise = {
    id          : Nat;
    title       : Text;
    category    : Text;
    description : Text;
    section     : WomenExerciseSection;
    videoUrl    : Text;
    instructions: [Text];
    benefits    : [Text];
  };

  /// Result type for UDID upload submission.
  public type UdidUploadResult = {
    #ok;
    #err : Text;
  };

  /// A subscription plan offered to users.
  public type SubscriptionPlan = {
    duration      : PlanDuration;
    priceUsdCents : Nat;   // e.g. 999 = $9.99
    displayLabel  : Text;  // e.g. "3 Months"
    stripePriceId : Text;
  };

  /// Result of initiating a Stripe checkout session.
  public type CheckoutResult = {
    #ok  : { sessionId : Text; url : Text };
    #err : Text;
  };

  /// Result of handling a Stripe webhook event.
  public type WebhookResult = {
    #ok;
    #err : Text;
  };

  /// AI query result that also carries the remaining free-tier message count.
  public type AiQueryResult = {
    #ok  : { response : Text; messagesRemaining : ?Nat };
    #err : Text;
  };

  /// Aggregated stats shown only to the founder on their private dashboard.
  /// Revenue is computed in INR at fixed plan prices:
  ///   months3 = ₹1500, months6 = ₹2500, months9 = ₹4500, months12 = ₹8500
  public type FounderDashboardStats = {
    freeCount    : Nat;
    months3Count : Nat;
    months6Count : Nat;
    months9Count : Nat;
    months12Count: Nat;
    totalRevenue : Nat;
  };
};

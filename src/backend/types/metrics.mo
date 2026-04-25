import CommonTypes "common";

/// Domain types for metric tracking and science articles.
module {
  public type UserId = CommonTypes.UserId;
  public type Timestamp = CommonTypes.Timestamp;

  /// A single weight/body-fat log entry.
  public type MetricEntry = {
    weightKg  : Float;
    bodyFatPct : ?Float;
    loggedAt  : Timestamp;
  };

  /// A personal-best record for a specific lift.
  public type PersonalBest = {
    exerciseName : Text;
    weightKg     : Float;
    reps         : Nat;
    loggedAt     : Timestamp;
  };

  /// Result type for metric mutations.
  public type MetricResult = {
    #ok;
    #err : Text;
  };

  /// Article category variants.
  public type ArticleCategory = {
    #hypertrophy;
    #fatLoss;
    #nutrition;
    #recovery;
  };

  /// A science-based article entry.
  public type ScienceArticle = {
    id             : Nat;
    title          : Text;
    category       : ArticleCategory;
    summary        : Text;
    content        : Text;
    readingMinutes : Nat;
    publishedDate  : Text;
  };
};

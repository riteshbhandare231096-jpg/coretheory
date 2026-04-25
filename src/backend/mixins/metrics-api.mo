import MetricTypes "../types/metrics";
import MetricsLib "../lib/metrics";
import ArticlesLib "../lib/articles";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

/// Public API for metric tracking (weight, body fat, personal bests)
/// and science article access. State is injected by main.mo.
mixin (
  metricsMap : Map.Map<MetricTypes.UserId, List.List<MetricTypes.MetricEntry>>,
  pbMap      : Map.Map<MetricTypes.UserId, List.List<MetricTypes.PersonalBest>>,
) {

  // ── Auth guard ─────────────────────────────────────────────────────────────

  /// Reject anonymous callers — all metric endpoints require a logged-in user.
  func requireAuth(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Authentication required: please log in to track your metrics.");
    };
  };

  // ── Metric logging ─────────────────────────────────────────────────────────

  /// Log a weight entry (and optional body fat %) for the caller.
  public shared ({ caller }) func logMetric(
    weightKg   : Float,
    bodyFatPct : ?Float,
  ) : async MetricTypes.MetricResult {
    requireAuth(caller);
    MetricsLib.logMetric(metricsMap, caller, weightKg, bodyFatPct);
    #ok
  };

  /// Return all metric entries logged by the caller.
  public query ({ caller }) func getMyMetrics() : async [MetricTypes.MetricEntry] {
    requireAuth(caller);
    MetricsLib.getMetrics(metricsMap, caller)
  };

  /// Delete all metric entries for the caller.
  public shared ({ caller }) func clearMyMetrics() : async () {
    requireAuth(caller);
    MetricsLib.clearMetrics(metricsMap, caller);
  };

  // ── Personal bests ─────────────────────────────────────────────────────────

  /// Log or update a personal best for a given exercise.
  public shared ({ caller }) func logPersonalBest(
    exerciseName : Text,
    weightKg     : Float,
    reps         : Nat,
  ) : async MetricTypes.MetricResult {
    requireAuth(caller);
    if (exerciseName == "") {
      return #err("Exercise name cannot be empty.");
    };
    MetricsLib.logPersonalBest(pbMap, caller, exerciseName, weightKg, reps);
    #ok
  };

  /// Return all personal bests for the caller.
  public query ({ caller }) func getMyPersonalBests() : async [MetricTypes.PersonalBest] {
    requireAuth(caller);
    MetricsLib.getPersonalBests(pbMap, caller)
  };

  // ── Science articles ───────────────────────────────────────────────────────

  /// Return all curated science articles. Requires authentication.
  public query ({ caller }) func getArticles() : async [MetricTypes.ScienceArticle] {
    requireAuth(caller);
    ArticlesLib.getArticles()
  };

  /// Return a single science article by ID. Returns null if not found.
  public query ({ caller }) func getArticle(id : Nat) : async ?MetricTypes.ScienceArticle {
    requireAuth(caller);
    ArticlesLib.getArticle(id)
  };
};

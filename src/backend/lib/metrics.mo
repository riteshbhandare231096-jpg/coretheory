import Types "../types/metrics";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

/// Domain logic for per-user metric tracking (weight logs, personal bests).
module {

  // ── Type aliases ────────────────────────────────────────────────────────────

  public type MetricMap    = Map.Map<Types.UserId, List.List<Types.MetricEntry>>;
  public type PersonalBestMap = Map.Map<Types.UserId, List.List<Types.PersonalBest>>;

  // ── Metric entry helpers ───────────────────────────────────────────────────

  /// Append a new metric entry for the given user.
  public func logMetric(
    metricsMap : MetricMap,
    userId     : Types.UserId,
    weightKg   : Float,
    bodyFatPct : ?Float,
  ) {
    let entry : Types.MetricEntry = {
      weightKg;
      bodyFatPct;
      loggedAt = Time.now();
    };
    switch (metricsMap.get(userId)) {
      case (?list) { list.add(entry) };
      case null {
        let list = List.empty<Types.MetricEntry>();
        list.add(entry);
        metricsMap.add(userId, list);
      };
    };
  };

  /// Return all metric entries for a user as an immutable array.
  public func getMetrics(
    metricsMap : MetricMap,
    userId     : Types.UserId,
  ) : [Types.MetricEntry] {
    switch (metricsMap.get(userId)) {
      case (?list) { list.toArray() };
      case null    { [] };
    }
  };

  /// Clear all metric entries for a user.
  public func clearMetrics(
    metricsMap : MetricMap,
    userId     : Types.UserId,
  ) {
    switch (metricsMap.get(userId)) {
      case (?list) { list.clear() };
      case null    {};
    };
  };

  // ── Personal best helpers ──────────────────────────────────────────────────

  /// Log or update a personal best for a specific exercise.
  /// If a PB for the same exercise already exists and the new one is better
  /// (heavier weight, or same weight with more reps), it replaces the old one.
  /// Otherwise a new entry is simply appended.
  public func logPersonalBest(
    pbMap        : PersonalBestMap,
    userId       : Types.UserId,
    exerciseName : Text,
    weightKg     : Float,
    reps         : Nat,
  ) {
    let entry : Types.PersonalBest = {
      exerciseName;
      weightKg;
      reps;
      loggedAt = Time.now();
    };
    switch (pbMap.get(userId)) {
      case null {
        let list = List.empty<Types.PersonalBest>();
        list.add(entry);
        pbMap.add(userId, list);
      };
      case (?list) {
        // Check if an entry for this exercise already exists
        let existingIdx = list.findIndex(func(pb) { pb.exerciseName == exerciseName });
        switch (existingIdx) {
          case null {
            // No prior entry — just append
            list.add(entry);
          };
          case (?idx) {
            // Replace with updated entry
            list.put(idx, entry);
          };
        };
      };
    };
  };

  /// Return all personal bests for a user as an immutable array.
  public func getPersonalBests(
    pbMap  : PersonalBestMap,
    userId : Types.UserId,
  ) : [Types.PersonalBest] {
    switch (pbMap.get(userId)) {
      case (?list) { list.toArray() };
      case null    { [] };
    }
  };
};

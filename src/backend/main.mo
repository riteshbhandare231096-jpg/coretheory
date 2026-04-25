import Map "mo:core/Map";
import List "mo:core/List";
import Types "./types/subscription";
import MetricTypes "./types/metrics";
import AiMixin "./mixins/ai-api";
import SubscriptionMixin "./mixins/subscription-api";
import MetricsMixin "./mixins/metrics-api";



/// Composition root — owns all state slices, delegates everything to mixins.
/// No public methods are implemented here.


actor {
  // ── State ──────────────────────────────────────────────────────────────────

  /// OpenRouter API key (set by controllers) — wrapped for mixin injection.
  let aiState = { var apiKey : Text = "" };

  /// User subscription profiles keyed by principal.
  let profiles : Map.Map<Types.UserId, Types.UserProfile> = Map.empty();

  /// Per-user AI message session counters (reset each session on frontend).
  let aiMessageCounts : Map.Map<Types.UserId, Nat> = Map.empty();

  /// The founder's Internet Identity principal — set once by a controller.
  /// When set, the matching caller receives permanent free premium access.
  let founderState = { var principal : ?Principal = null };

  /// Per-user weight/body-fat metric log.
  let metricsMap : Map.Map<MetricTypes.UserId, List.List<MetricTypes.MetricEntry>> = Map.empty();

  /// Per-user personal best records keyed by principal.
  let pbMap : Map.Map<MetricTypes.UserId, List.List<MetricTypes.PersonalBest>> = Map.empty();

  // ── Mixins ─────────────────────────────────────────────────────────────────

  include AiMixin(aiState);
  include SubscriptionMixin(profiles, aiMessageCounts, aiState, founderState);
  include MetricsMixin(metricsMap, pbMap);
};

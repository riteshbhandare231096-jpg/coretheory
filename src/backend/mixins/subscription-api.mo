import Types "../types/subscription";
import AiTypes "../types/ai";
import SubscriptionLib "../lib/subscription";
import AiLib "../lib/ai";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

/// Public API surface for user profiles and subscription management.
/// State is injected by main.mo.
mixin (
  profiles          : Map.Map<Types.UserId, Types.UserProfile>,
  aiMessageCounts   : Map.Map<Types.UserId, Nat>,
  aiState           : { var apiKey : Text },
  founderState      : { var principal : ?Principal },
) {

  // ── IC Management Canister (HTTP outcalls) ─────────────────────────────────
  type StripeIC = actor {
    http_request : AiTypes.HttpRequestArgs -> async AiTypes.HttpResponse;
  };
  let stripeIc : StripeIC = actor "aaaaa-aa";

  // ── Stripe configuration ───────────────────────────────────────────────────
  // Stripe secret key is stored in aiState to avoid adding a new stable slot.
  // Controllers set it via setStripeKey (or reuse setApiKey for the combined key).
  // For Stripe calls we read from a dedicated var injected below.
  var stripeKey : Text = "";

  /// Set the Stripe secret key. Only callable by canister controllers.
  public shared ({ caller }) func setStripeKey(key : Text) : async () {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: only controllers can set the Stripe key");
    };
    stripeKey := key;
  };

  // ── Founder management ────────────────────────────────────────────────────

  /// Check whether a principal is the configured founder.
  func isFounder(p : Principal) : Bool {
    switch (founderState.principal) {
      case (?fp) { fp == p };
      case null  { false };
    }
  };

  /// Set the founder principal. Only callable by canister controllers.
  /// Once set, the founder receives permanent free premium access on every login.
  public shared ({ caller }) func setFounderPrincipal(p : Principal) : async () {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: only controllers can set the founder principal");
    };
    founderState.principal := ?p;
  };

  /// Returns true if the caller is the registered founder.
  public query ({ caller }) func getIsFounder() : async Bool {
    isFounder(caller)
  };

  // ── Internal helpers ───────────────────────────────────────────────────────

  /// Get or create a profile for the given principal.
  func getOrCreateProfile(userId : Types.UserId) : Types.UserProfile {
    switch (profiles.get(userId)) {
      case (?p) {
        // expire stale premium before returning
        SubscriptionLib.maybeExpire(p, Time.now());
        p;
      };
      case null {
        let p = SubscriptionLib.newProfile(userId);
        profiles.add(userId, p);
        p;
      };
    }
  };

  /// Extract a JSON string value for a given key from a flat JSON object.
  /// Supports nested objects by only reading the first occurrence.
  func jsonGetText(json : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\":\"";
    let parts = json.split(#text needle);
    var seenFirst = false;
    var found : ?Text = null;
    for (part in parts) {
      if (not seenFirst) {
        seenFirst := true;
      } else if (found == null) {
        var result = "";
        var escaped = false;
        var done = false;
        for (c in part.toIter()) {
          if (not done) {
            if (escaped) {
              result #= if (c == 'n') "\n"
                         else if (c == 'r') "\r"
                         else if (c == 't') "\t"
                         else Text.fromChar(c);
              escaped := false;
            } else if (c == '\\') {
              escaped := true;
            } else if (c == '\"') {
              done := true;
            } else {
              result #= Text.fromChar(c);
            };
          };
        };
        found := ?(if (done) result else "");
      };
    };
    found
  };

  // ── Profile / subscription status ─────────────────────────────────────────

  /// Return the caller's subscription profile (creates a free profile if new).
  /// For the founder, tier is permanently set to #premium with no expiry.
  public shared ({ caller }) func getMyProfile() : async Types.UserProfilePublic {
    let profile = getOrCreateProfile(caller);
    if (isFounder(caller)) {
      profile.tier      := #premium;
      profile.plan      := null;
      profile.expiresAt := null;
    };
    SubscriptionLib.toPublic(profile)
  };

  /// Return all available subscription plans (durations, prices, labels).
  public query func getSubscriptionPlans() : async [Types.SubscriptionPlan] {
    SubscriptionLib.getPlans()
  };

  // ── Stripe checkout ────────────────────────────────────────────────────────

  /// Initiate a Stripe checkout session for the given plan duration.
  /// Returns the Stripe session ID and redirect URL.
  public shared ({ caller }) func createCheckoutSession(
    duration : Types.PlanDuration,
  ) : async Types.CheckoutResult {
    if (stripeKey == "") {
      return #err("Payment system is not configured. Please try again later.");
    };

    let plan = switch (SubscriptionLib.findPlan(duration)) {
      case (?p) p;
      case null { return #err("Unknown plan duration.") };
    };

    // Ensure a profile exists for this user (stores caller principal in metadata)
    ignore getOrCreateProfile(caller);

    // Build URL-encoded form body for Stripe Checkout Sessions API
    let body = "mode=subscription" #
               "&line_items[0][price]=" # plan.stripePriceId #
               "&line_items[0][quantity]=1" #
               "&success_url=https%3A%2F%2Fcoretheory.ic0.app%2F%3Fpayment%3Dsuccess" #
               "&cancel_url=https%3A%2F%2Fcoretheory.ic0.app%2F%3Fpayment%3Dcancelled" #
               "&metadata[userId]=" # caller.toText() #
               "&metadata[duration]=" # planDurationToText(duration);

    let requestArgs : AiTypes.HttpRequestArgs = {
      url               = "https://api.stripe.com/v1/checkout/sessions";
      max_response_bytes = ?20_000;
      method            = #post;
      headers           = [
        { name = "Content-Type";  value = "application/x-www-form-urlencoded" },
        { name = "Authorization"; value = "Bearer " # stripeKey },
      ];
      body          = ?(body.encodeUtf8());
      transform     = null;
      is_replicated = ?false;
    };

    let response = try {
      await (with cycles = 220_000_000_000) stripeIc.http_request(requestArgs);
    } catch (_) {
      return #err("Network error: Failed to reach payment service.");
    };

    switch (response.body.decodeUtf8()) {
      case null { #err("Could not decode payment service response.") };
      case (?json) {
        if (response.status < 200 or response.status >= 300) {
          let errMsg = switch (jsonGetText(json, "message")) {
            case (?m) m;
            case null { "status " # response.status.toText() };
          };
          return #err("Payment error: " # errMsg);
        };
        let sessionId = switch (jsonGetText(json, "id")) {
          case (?id) id;
          case null  { return #err("Could not parse session ID from response.") };
        };
        let url = switch (jsonGetText(json, "url")) {
          case (?u) u;
          case null { return #err("Could not parse redirect URL from response.") };
        };
        #ok({ sessionId; url })
      };
    }
  };

  /// Cancel the caller's active premium subscription immediately.
  public shared ({ caller }) func cancelSubscription() : async () {
    switch (profiles.get(caller)) {
      case (?profile) {
        SubscriptionLib.cancelPremium(profile);
      };
      case null {
        // no profile — nothing to cancel
      };
    };
  };

  // ── Stripe webhook ─────────────────────────────────────────────────────────

  /// Receive a raw Stripe webhook payload (called by the Stripe extension / frontend relay).
  /// Handles: checkout.session.completed → activate premium
  ///          customer.subscription.deleted → revert to free
  public shared func stripeWebhook(payload : Text) : async Types.WebhookResult {
    let eventType = switch (jsonGetText(payload, "type")) {
      case (?t) t;
      case null { return #err("Missing event type in webhook payload.") };
    };

    if (eventType == "checkout.session.completed") {
      // Extract metadata: userId and duration are embedded at checkout creation
      let userIdText = switch (jsonGetText(payload, "userId")) {
        case (?u) u;
        case null { return #err("Missing userId in webhook metadata.") };
      };
      let durationText = switch (jsonGetText(payload, "duration")) {
        case (?d) d;
        case null { return #err("Missing duration in webhook metadata.") };
      };
      let subscriptionId = switch (jsonGetText(payload, "subscription")) {
        case (?s) s;
        case null "unknown";
      };
      let customerId = switch (jsonGetText(payload, "customer")) {
        case (?c) c;
        case null "";
      };

      let userId = try {
        Principal.fromText(userIdText)
      } catch (_) {
        return #err("Invalid userId principal in webhook.");
      };

      let duration = switch (textToPlanDuration(durationText)) {
        case (?d) d;
        case null { return #err("Unknown duration in webhook: " # durationText) };
      };

      let profile = getOrCreateProfile(userId);
      SubscriptionLib.activatePremium(profile, duration, Time.now(), subscriptionId);
      if (customerId != "") {
        SubscriptionLib.setStripeCustomerId(profile, customerId);
      };
      #ok

    } else if (eventType == "customer.subscription.deleted") {
      // Find the profile by Stripe subscription ID and revert to free
      let subscriptionId = switch (jsonGetText(payload, "id")) {
        case (?id) id;
        case null  { return #err("Missing subscription id in webhook.") };
      };

      for ((_, profile) in profiles.entries()) {
        switch (profile.stripeSubscriptionId) {
          case (?sid) {
            if (sid == subscriptionId) {
              SubscriptionLib.cancelPremium(profile);
            };
          };
          case null {};
        };
      };
      #ok

    } else {
      // Unhandled event — acknowledge without error to avoid Stripe retries
      #ok
    }
  };

  // ── Tier-gated AI query ────────────────────────────────────────────────────

  /// Query CORE AI with conversation history, enforcing free-tier message limits.
  /// messagesInSession: number of messages the user has sent this session so far.
  public shared ({ caller }) func queryAIGated(
    messages          : [{ role : Text; content : Text }],
    messagesInSession : Nat,
  ) : async Types.AiQueryResult {
    let profile = getOrCreateProfile(caller);

    // Founder always has unlimited AI — bypass message limit entirely
    let callerIsFounder = isFounder(caller);

    if (not callerIsFounder and SubscriptionLib.isLimitExceeded(profile.tier, messagesInSession)) {
      return #err(
        "You have used all " # SubscriptionLib.freeMessageLimit.toText() #
        " free messages for this session. Upgrade to CORE Premium for unlimited CORE AI access, " #
        "personalised workout plans, and custom nutrition meal plans."
      );
    };

    if (aiState.apiKey == "") {
      return #err("CORE AI is not configured yet. Please contact the platform administrator.");
    };

    let body = AiLib.buildRequestBody(AiLib.systemPrompt(), messages);

    let requestArgs : AiTypes.HttpRequestArgs = {
      url               = "https://openrouter.ai/api/v1/chat/completions";
      max_response_bytes = ?10_000;
      method            = #post;
      headers           = [
        { name = "Content-Type";  value = "application/json" },
        { name = "Authorization"; value = "Bearer " # aiState.apiKey },
        { name = "HTTP-Referer";  value = "https://coretheory.ic0.app" },
        { name = "X-Title";       value = "CORE Theory Library" },
      ];
      body          = ?(body.encodeUtf8());
      transform     = null;
      is_replicated = ?false;
    };

    let response = try {
      await (with cycles = 220_000_000_000) stripeIc.http_request(requestArgs);
    } catch (_) {
      return #err("Error: Failed to reach CORE AI. Please try again later.");
    };

    if (response.status < 200 or response.status >= 300) {
      return #err("Error: AI service returned status " # response.status.toText() # ".");
    };

    switch (response.body.decodeUtf8()) {
      case null { #err("Error: Could not decode AI response.") };
      case (?responseText) {
        switch (AiLib.extractContent(responseText)) {
          case null { #err("Error: Could not parse AI response.") };
          case (?content) {
            let messagesRemaining : ?Nat = if (callerIsFounder or profile.tier == #premium) {
              null  // unlimited
            } else {
              let used = messagesInSession + 1;
              ?SubscriptionLib.messagesRemaining(used)
            };
            #ok({ response = content; messagesRemaining })
          };
        };
      };
    }
  };

  // ── Founder dashboard ──────────────────────────────────────────────────────

  /// Return aggregated client stats. Only callable by the registered founder.
  /// Counts users by tier/plan and computes total revenue in INR.
  public query ({ caller }) func getFounderDashboardStats() : async Types.FounderDashboardStats {
    if (not isFounder(caller)) {
      return {
        freeCount     = 0;
        months3Count  = 0;
        months6Count  = 0;
        months9Count  = 0;
        months12Count = 0;
        totalRevenue  = 0;
      };
    };

    var freeCount     : Nat = 0;
    var months3Count  : Nat = 0;
    var months6Count  : Nat = 0;
    var months9Count  : Nat = 0;
    var months12Count : Nat = 0;

    for ((_, profile) in profiles.entries()) {
      switch (profile.tier) {
        case (#free) { freeCount += 1 };
        case (#premium) {
          switch (profile.plan) {
            case (?#months3)  { months3Count  += 1 };
            case (?#months6)  { months6Count  += 1 };
            case (?#months9)  { months9Count  += 1 };
            case (?#months12) { months12Count += 1 };
            case null         {};
          };
        };
      };
    };

    let totalRevenue = (months3Count  * 1500)
                     + (months6Count  * 2500)
                     + (months9Count  * 4500)
                     + (months12Count * 8500);

    {
      freeCount;
      months3Count;
      months6Count;
      months9Count;
      months12Count;
      totalRevenue;
    }
  };

  // ── Disabled user dashboard ────────────────────────────────────────────────

  /// Record the caller's UDID government document upload path and verify them.
  /// Sets udidVerified = true and udidUploadPath on the caller's profile.
  public shared ({ caller }) func submitUdidUpload(uploadPath : Text) : async Types.UdidUploadResult {
    let profile = getOrCreateProfile(caller);
    profile.isDisabled      := true;
    profile.udidVerified    := true;
    profile.udidUploadPath  := uploadPath;
    profile.udidUploadTime  := ?Time.now();
    #ok
  };

  /// Returns true only if the caller's profile has udidVerified = true.
  public query ({ caller }) func getIsDisabledVerified() : async Bool {
    switch (profiles.get(caller)) {
      case (?p) { p.udidVerified };
      case null { false };
    }
  };

  /// Return the curated list of exercises for disabled users.
  /// Only accessible if the caller is UDID-verified (disabled) or is the founder.
  public query ({ caller }) func getDisabledExercises() : async [Types.DisabledExercise] {
    let canAccess = isFounder(caller) or (
      switch (profiles.get(caller)) {
        case (?p) { p.udidVerified };
        case null { false };
      }
    );
    if (not canAccess) {
      Runtime.trap("Access denied: UDID verification required to access the disabled dashboard.");
    };
    SubscriptionLib.getDisabledExercises()
  };

  // ── Women's fitness dashboard ──────────────────────────────────────────────

  /// Returns true if the caller is founder OR has an active premium subscription.
  public query ({ caller }) func getWomenDashboardAccess() : async Bool {
    if (isFounder(caller)) { return true };
    switch (profiles.get(caller)) {
      case (?p) { SubscriptionLib.isActive(p, Time.now()) };
      case null { false };
    }
  };

  /// Return the curated women's exercises split into basic and advanced sections.
  /// Only accessible if getWomenDashboardAccess() would return true.
  public query ({ caller }) func getWomenExercises() : async { basic : [Types.WomenExercise]; advanced : [Types.WomenExercise] } {
    let canAccess = isFounder(caller) or (
      switch (profiles.get(caller)) {
        case (?p) { SubscriptionLib.isActive(p, Time.now()) };
        case null { false };
      }
    );
    if (not canAccess) {
      Runtime.trap("Access denied: a premium subscription is required to access the women's dashboard.");
    };
    SubscriptionLib.getWomenExercises()
  };

  // ── Private text converters ────────────────────────────────────────────────

  func planDurationToText(duration : Types.PlanDuration) : Text {
    switch (duration) {
      case (#months3)  "months3";
      case (#months6)  "months6";
      case (#months9)  "months9";
      case (#months12) "months12";
    }
  };

  func textToPlanDuration(text : Text) : ?Types.PlanDuration {
    switch (text) {
      case "months3"  ?#months3;
      case "months6"  ?#months6;
      case "months9"  ?#months9;
      case "months12" ?#months12;
      case _          null;
    }
  };
};

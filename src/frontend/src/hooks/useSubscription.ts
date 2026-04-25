import { PlanDuration, Tier, createActor } from "@/backend";
import type {
  SubscriptionPlanUI,
  SubscriptionTier,
  UserProfile,
} from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useRef, useState } from "react";

function tierFromBackend(t: Tier): SubscriptionTier {
  return t === Tier.premium ? "premium" : "free";
}

function planKeyFromDuration(d: PlanDuration): SubscriptionPlanUI["duration"] {
  const map: Record<PlanDuration, SubscriptionPlanUI["duration"]> = {
    [PlanDuration.months3]: "months3",
    [PlanDuration.months6]: "months6",
    [PlanDuration.months9]: "months9",
    [PlanDuration.months12]: "months12",
  };
  return map[d];
}

export function useSubscription() {
  const { identity, loginStatus } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlanUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * CRITICAL: isFounder is `null` (unknown) until the backend call resolves.
   * Components MUST treat null as "not yet decided" — never as false.
   * Only true/false are conclusive states.
   */
  const [isFounder, setIsFounder] = useState<boolean | null>(null);
  const [isDisabledVerified, setIsDisabledVerified] = useState(false);
  const [hasWomenAccess, setHasWomenAccess] = useState(false);

  // `initialized` = true after profile fetch completes (success or error)
  const [initialized, setInitialized] = useState(false);
  // `founderResolved` = true after getIsFounder() call completes (success or error)
  const [founderResolved, setFounderResolved] = useState(false);

  /**
   * forceFounderUnlock — THE permanent latch.
   *
   * Once set to true (isFounder===true confirmed), it NEVER reverts to false,
   * even on profile refetch errors, logout re-renders, or race conditions.
   * This is the ultimate escape hatch for all lock checks.
   *
   * It is stored in a ref as well so it's immediately readable in closures
   * without waiting for a re-render cycle.
   */
  const [forceFounderUnlock, setForceFounderUnlock] = useState(false);
  const forceFounderUnlockRef = useRef(false);

  // Retry counter for founder status
  const [retryCount, setRetryCount] = useState(0);

  const isLoggedIn = loginStatus === "success" && !!identity;

  const fetchProfile = useCallback(async () => {
    if (!actor || isFetching || !isLoggedIn) return;
    setLoading(true);
    setError(null);
    try {
      // All status flags fetched in a single Promise.all — founder status is
      // resolved in the SAME tick as the profile, eliminating race conditions.
      const [raw, founderStatus, disabledStatus, womenStatus] =
        await Promise.all([
          actor.getMyProfile(),
          actor.getIsFounder().catch(() => null),
          actor.getIsDisabledVerified().catch(() => false),
          (async () => {
            for (let attempt = 0; attempt < 3; attempt++) {
              try {
                return await actor.getWomenDashboardAccess();
              } catch {
                if (attempt < 2) {
                  await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
                }
              }
            }
            return false;
          })(),
        ]);

      if (founderStatus === null) {
        // Backend call failed — schedule a retry unless max retries hit
        // BUT: if we already confirmed founder earlier (forceFounderUnlockRef),
        // do NOT touch the founder state — keep it locked in as true
        if (forceFounderUnlockRef.current) {
          // Already confirmed as founder — ignore the error, keep state as-is
          setFounderResolved(true);
        } else {
          const nextRetry = retryCount + 1;
          if (nextRetry > 3) {
            // Max retries hit — default to false so accessReady unblocks
            setIsFounder(false);
            setFounderResolved(true);
          } else {
            setRetryCount(nextRetry);
          }
        }
      } else {
        // Conclusive answer: true or false
        const isFounderConfirmed = founderStatus === true;
        setIsFounder(isFounderConfirmed);
        setFounderResolved(true);

        // If confirmed as founder, latch forceFounderUnlock permanently
        if (isFounderConfirmed && !forceFounderUnlockRef.current) {
          forceFounderUnlockRef.current = true;
          setForceFounderUnlock(true);
        }
      }

      setIsDisabledVerified(disabledStatus);
      setHasWomenAccess(womenStatus ?? false);
      setProfile({
        tier: tierFromBackend(raw.tier),
        plan: raw.plan ? planKeyFromDuration(raw.plan) : undefined,
        expiresAt: raw.expiresAt
          ? new Date(Number(raw.expiresAt) / 1_000_000).toISOString()
          : undefined,
        startedAt: raw.startedAt
          ? new Date(Number(raw.startedAt) / 1_000_000).toISOString()
          : undefined,
        isDisabled: raw.isDisabled,
        udidVerified: raw.udidVerified,
        udidUploadPath: raw.udidUploadPath || undefined,
      });
    } catch {
      setError("Failed to load profile");
      // On total failure: if already confirmed as founder, keep that state
      // founderResolved stays false only if we never got a conclusive answer
      if (forceFounderUnlockRef.current) {
        setFounderResolved(true);
      }
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, [actor, isFetching, isLoggedIn, retryCount]);

  const fetchPlans = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      const raw = await actor.getSubscriptionPlans();
      setPlans(
        raw.map((p) => ({
          duration: planKeyFromDuration(p.duration),
          displayLabel: p.displayLabel,
          priceUsdCents: Number(p.priceUsdCents),
          stripePriceId: p.stripePriceId,
        })),
      );
    } catch {
      // Plans are non-critical; silently fail
    }
  }, [actor, isFetching]);

  // Fetch profile when user logs in
  useEffect(() => {
    if (isLoggedIn && actor && !isFetching) {
      fetchProfile();
      fetchPlans();
    } else if (isLoggedIn && (!actor || isFetching)) {
      setLoading(true);
    } else if (!isLoggedIn) {
      setProfile(null);
      setIsFounder(null); // reset to unknown, not false
      setIsDisabledVerified(false);
      setHasWomenAccess(false);
      setInitialized(false);
      setFounderResolved(false);
      setRetryCount(0);
      setLoading(false);
      // NOTE: forceFounderUnlock is intentionally NOT reset on logout.
      // This session variable persists within the current JS session to
      // prevent any edge case where a brief logout/login cycle re-introduces
      // the race condition. It will be reset on full page reload.
    }
  }, [isLoggedIn, actor, isFetching, fetchProfile, fetchPlans]);

  // Retry up to 3 times if founder status fetch failed (returned null)
  useEffect(() => {
    if (retryCount === 0 || !isLoggedIn || !actor || isFetching) return;
    if (retryCount > 3) return;
    const delay = 1000 * retryCount; // progressive backoff: 1s, 2s, 3s
    const timer = setTimeout(() => {
      fetchProfile();
    }, delay);
    return () => clearTimeout(timer);
  }, [retryCount, isLoggedIn, actor, isFetching, fetchProfile]);

  const startCheckout = useCallback(
    async (
      duration: SubscriptionPlanUI["duration"],
    ): Promise<string | null> => {
      if (!actor || isFetching) return null;
      const durationMap: Record<SubscriptionPlanUI["duration"], PlanDuration> =
        {
          months3: PlanDuration.months3,
          months6: PlanDuration.months6,
          months9: PlanDuration.months9,
          months12: PlanDuration.months12,
        };
      try {
        const result = await actor.createCheckoutSession(durationMap[duration]);
        if (result.__kind__ === "ok") return result.ok.url;
        return null;
      } catch {
        return null;
      }
    },
    [actor, isFetching],
  );

  const cancelSubscription = useCallback(async () => {
    if (!actor || isFetching) return;
    try {
      await actor.cancelSubscription();
      await fetchProfile();
    } catch {
      // ignore
    }
  }, [actor, isFetching, fetchProfile]);

  const tier: SubscriptionTier = profile?.tier ?? "free";

  /**
   * isPremium: forceFounderUnlock or isFounder===true always means premium.
   * isFounder===null means unknown — do NOT treat as false here.
   */
  const isPremium =
    forceFounderUnlock || isFounder === true || tier === "premium";
  const isFree = !isPremium;

  /**
   * accessReady: the single gate that ALL lock checks must pass through.
   * Only true when both the profile AND founder status have been conclusively resolved.
   * EXCEPTION: if forceFounderUnlock is true, access is always "ready" — no waiting.
   */
  const accessReady = forceFounderUnlock || (initialized && founderResolved);

  return {
    profile,
    tier,
    isPremium,
    isFree,
    isFounder, // boolean | null — null means "not yet resolved"
    isDisabledVerified,
    hasWomenAccess,
    plans,
    loading,
    error,
    isLoggedIn,
    loginStatus,
    initialized,
    founderResolved,
    accessReady,
    forceFounderUnlock, // permanent latch — true once founder is confirmed, never reverts
    fetchProfile,
    startCheckout,
    cancelSubscription,
  };
}

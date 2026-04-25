/**
 * useAccessControl — Single source of truth for ALL access/lock decisions.
 *
 * INVARIANT: No component in the app should perform its own lock check.
 * Every gate MUST go through this hook.
 *
 * The fundamental rule (in priority order):
 *   1. forceFounderUnlock === true → NEVER lock, always grant access
 *   2. isFounder === true          → NEVER lock
 *   3. isFounder === null          → NEVER lock (still loading)
 *   4. accessReady === false       → NEVER lock (still loading)
 *   5. isPremium === true          → NEVER lock
 *   6. else                        → apply specific access rules
 */

import { useSubscription } from "@/hooks/useSubscription";
import type { Exercise } from "@/types";

export function useAccessControl() {
  const {
    isFounder,
    isPremium,
    isDisabledVerified,
    accessReady,
    isLoggedIn,
    loading,
    initialized,
    founderResolved,
    forceFounderUnlock,
  } = useSubscription();

  /**
   * isExerciseLocked — returns true ONLY when ALL of the following are true:
   *   1. forceFounderUnlock is false (not a confirmed founder)
   *   2. isFounder is NOT true
   *   3. accessReady is true (we know exactly who the user is)
   *   4. user is not premium
   *   5. exercise difficulty is Advanced
   *
   * Any other combination → not locked (including while loading).
   */
  function isExerciseLocked(exercise: Exercise): boolean {
    // Priority 1: permanent founder latch — absolute override
    if (forceFounderUnlock) return false;
    // Priority 2: confirmed founder
    if (isFounder === true) return false;
    // Priority 3 & 4: still resolving or not yet ready
    if (isFounder === null) return false;
    if (!accessReady) return false;
    // Priority 5: premium
    if (isPremium) return false;
    // Only now can we evaluate the exercise's difficulty
    return exercise.difficulty === "Advanced";
  }

  /**
   * canAccessWomenDashboard — returns true when:
   *   - forceFounderUnlock === true (permanent latch, highest priority)
   *   - isFounder === true (always access)
   *   - isFounder === null or !accessReady (loading — don't block)
   *   - accessReady AND isPremium
   */
  function canAccessWomenDashboard(): boolean {
    if (forceFounderUnlock) return true;
    if (isFounder === true) return true;
    if (isFounder === null) return true;
    if (!accessReady) return true;
    return isPremium;
  }

  /**
   * canAccessDisabledDashboard — returns true when:
   *   - forceFounderUnlock === true (permanent latch, highest priority)
   *   - isFounder === true (always access)
   *   - isFounder === null or !accessReady (loading — don't block)
   *   - accessReady AND isDisabledVerified
   */
  function canAccessDisabledDashboard(): boolean {
    if (forceFounderUnlock) return true;
    if (isFounder === true) return true;
    if (isFounder === null) return true;
    if (!accessReady) return true;
    return isDisabledVerified;
  }

  /**
   * canAccessFounderDashboard — returns true when:
   *   - forceFounderUnlock === true (permanent latch)
   *   - isFounder === true
   *   - isFounder === null (loading — don't block while resolving)
   *
   * Note: We also allow null here to avoid blocking the dashboard
   * during the founder status resolution window.
   */
  function canAccessFounderDashboard(): boolean {
    if (forceFounderUnlock) return true;
    if (isFounder === true) return true;
    if (isFounder === null) return true; // loading — don't block
    return false;
  }

  return {
    // State
    isFounder, // boolean | null
    isPremium,
    isFree: !isPremium,
    isDisabledVerified,
    isLoggedIn,
    accessReady,
    forceFounderUnlock, // permanent latch — expose for direct use in components
    loading,
    initialized,
    founderResolved,

    // Lock/access functions — use these everywhere instead of inline checks
    isExerciseLocked,
    canAccessWomenDashboard,
    canAccessDisabledDashboard,
    canAccessFounderDashboard,
  };
}

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Lock, Sparkles, Zap } from "lucide-react";

interface PremiumGateProps {
  /** When true, renders children unblocked */
  isPremium: boolean;
  /**
   * isFounder must be boolean | null.
   * - null = still loading → NEVER show lock
   * - true = founder → NEVER show lock
   * - false = not founder → evaluate isPremium/accessReady
   */
  isFounder?: boolean | null;
  /**
   * accessReady: true only after both profile AND founder status have resolved.
   * When false, NEVER show the lock UI — show children or a neutral skeleton.
   */
  accessReady?: boolean;
  /**
   * forceFounderUnlock: permanent latch — if true, always renders children.
   * Once set to true by useSubscription, NEVER reverts.
   * This is the highest-priority escape hatch.
   */
  forceFounderUnlock?: boolean;
  /**
   * Extra safety escape hatch. If true, always renders children regardless
   * of isPremium or isFounder.
   */
  forceUnlock?: boolean;
  /** Called when user clicks any upgrade CTA */
  onUpgrade: () => void;
  /** Compact variant — used as a card overlay (default: false = full page overlay) */
  variant?: "card" | "page";
  children?: React.ReactNode;
}

/**
 * Wraps content with a premium lock overlay for free users.
 *
 * Unlock priority (first match wins):
 *   1. forceFounderUnlock === true → NEVER lock (permanent founder latch)
 *   2. accessReady === false       → NEVER lock (may still be loading)
 *   3. isFounder === null          → NEVER lock (founder status unknown)
 *   4. isFounder === true          → NEVER lock (confirmed founder)
 *   5. forceUnlock === true        → NEVER lock
 *   6. isPremium === true          → NEVER lock
 *   7. else                        → show lock overlay (ONLY when: accessReady AND isFounder===false AND !isPremium)
 *
 * The lock UI MUST NEVER render when forceFounderUnlock=true or accessReady=false.
 */
export function PremiumGate({
  isPremium,
  isFounder = null,
  accessReady = true,
  forceFounderUnlock = false,
  forceUnlock = false,
  onUpgrade,
  variant = "page",
  children,
}: PremiumGateProps) {
  // Priority 1: permanent founder latch — highest authority, unconditional
  if (forceFounderUnlock) return <>{children}</>;
  // Priority 2 & 3: not ready or founder status unknown — never lock
  if (!accessReady || isFounder === null) return <>{children}</>;
  // Priority 4: confirmed founder — absolute authority
  if (isFounder === true) return <>{children}</>;
  // Priority 5: explicit force unlock
  if (forceUnlock) return <>{children}</>;
  // Priority 6: premium
  if (isPremium) return <>{children}</>;

  // Only reaches here when: accessReady=true AND isFounder=false AND !isPremium AND !forceFounderUnlock
  if (variant === "card") {
    return (
      <div
        className="relative rounded-xl overflow-hidden group"
        data-ocid="premium_gate.card"
      >
        {/* Blurred children preview */}
        <div className="select-none pointer-events-none blur-[2px] opacity-60 saturate-50">
          {children}
        </div>
        {/* Gold lock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[1px] rounded-xl gap-2 px-3 text-center transition-smooth">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shadow-subtle">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-white font-display font-bold text-sm leading-tight">
            Premium exercise
          </p>
          <button
            type="button"
            onClick={onUpgrade}
            data-ocid="premium_gate.card_upgrade_button"
            className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-smooth shadow-subtle"
          >
            <Crown className="w-3 h-3" />
            Unlock Premium
          </button>
        </div>
      </div>
    );
  }

  // Page variant — full page premium gate
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center"
      data-ocid="premium_gate.page"
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shadow-subtle">
          <Crown className="w-12 h-12 text-amber-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-subtle">
          <Lock className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      {/* Headline */}
      <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mb-3 max-w-md">
        Advanced Exercise — Premium Only
      </h2>
      <p className="text-muted-foreground text-base md:text-lg max-w-sm mb-8 leading-relaxed">
        Unlock all advanced exercises, unlimited CORE AI coaching, personalised
        workout plans, and custom nutrition guidance.
      </p>

      {/* Features list */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mb-10 max-w-xl text-sm">
        {[
          "All 50+ exercises including advanced",
          "Unlimited CORE AI chat",
          "Personalised workout plans",
          "Custom nutrition & meal plans",
        ].map((f) => (
          <div
            key={f}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/8 border border-primary/20 text-foreground font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            {f}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Button
          onClick={onUpgrade}
          data-ocid="premium_gate.page_upgrade_button"
          className="gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold shadow-subtle px-8 h-12 text-base"
        >
          <Zap className="w-5 h-5" />
          Unlock Premium
        </Button>
        <p className="text-xs text-muted-foreground">
          Cancel anytime · Secure payment via Stripe
        </p>
      </div>
    </div>
  );
}

/**
 * LoadingGate — shown while accessReady is false.
 * Renders a neutral skeleton that matches the variant shape.
 */
export function LoadingGate({
  variant = "page",
}: { variant?: "card" | "page" }) {
  if (variant === "card") {
    return <Skeleton className="w-full aspect-[4/3] rounded-xl" />;
  }
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16"
      data-ocid="premium_gate.loading_state"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">Verifying access…</p>
      </div>
    </div>
  );
}

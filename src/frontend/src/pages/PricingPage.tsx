import { PlanCard } from "@/components/PlanCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import type { SubscriptionPlanUI } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Brain,
  CalendarCheck,
  Check,
  Crown,
  Dumbbell,
  ShieldCheck,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const FREE_FEATURES = [
  "Beginner & intermediate exercises",
  "5 CORE AI messages per session",
  "Search & browse exercise library",
  "Exercise instructions & tips",
];

const FREE_LIMITATIONS = [
  "Advanced exercises locked",
  "Limited AI conversations",
  "No personalised workout plans",
  "No custom nutrition plans",
];

const STATIC_PLANS: SubscriptionPlanUI[] = [
  {
    duration: "months3",
    displayLabel: "3 Months",
    priceUsdCents: 1500,
    stripePriceId: "",
  },
  {
    duration: "months6",
    displayLabel: "6 Months",
    priceUsdCents: 2500,
    stripePriceId: "",
  },
  {
    duration: "months9",
    displayLabel: "9 Months",
    priceUsdCents: 4500,
    stripePriceId: "",
  },
  {
    duration: "months12",
    displayLabel: "12 Months",
    priceUsdCents: 8500,
    stripePriceId: "",
  },
];

export function PricingPage() {
  const {
    plans,
    isLoggedIn,
    isPremium,
    isFounder,
    profile,
    startCheckout,
    loading,
    initialized,
  } = useSubscription();
  const { login } = useInternetIdentity();
  const [loadingPlan, setLoadingPlan] = useState<
    SubscriptionPlanUI["duration"] | null
  >(null);

  const displayPlans = plans.length > 0 ? plans : STATIC_PLANS;

  // While subscription status loads, show a brief spinner so founder gets correct view
  if (loading || !initialized) {
    return (
      <div
        className="min-h-[40vh] flex items-center justify-center"
        data-ocid="pricing.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  const handleSubscribe = async (duration: SubscriptionPlanUI["duration"]) => {
    if (!isLoggedIn) {
      login();
      return;
    }
    setLoadingPlan(duration);
    try {
      const url = await startCheckout(duration);
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not start checkout. Please try again.");
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  const expiryDate = profile?.expiresAt
    ? new Date(profile.expiresAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background" data-ocid="pricing.page">
      {/* Hero section */}
      <section className="bg-gradient-to-b from-card via-card to-background border-b border-border pb-12 pt-14">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              <Crown className="w-4 h-4" />
              CORE Theory Premium
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-foreground leading-tight mb-4">
              Elevate your training with{" "}
              <span className="text-gradient">premium access</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Unlock every exercise, unlimited AI coaching, and personalised
              plans — all in one subscription.
            </p>
          </motion.div>

          {/* Active premium badge */}
          {(isPremium || isFounder) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 inline-flex items-center gap-3 bg-amber-500/10 border border-amber-400/40 rounded-xl px-5 py-3"
              data-ocid="pricing.active_premium_banner"
            >
              <Crown className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <p className="font-semibold text-amber-600 dark:text-amber-400 text-sm">
                  {isFounder
                    ? "Founder — Lifetime Premium Access"
                    : "You're on Premium"}
                </p>
                {isFounder ? (
                  <p className="text-muted-foreground text-xs mt-0.5">
                    Full access to all features, always free for you
                  </p>
                ) : expiryDate ? (
                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                    <CalendarCheck className="w-3 h-3" />
                    Renews / expires on {expiryDate}
                  </p>
                ) : null}
              </div>
              <Badge className="bg-amber-500 text-white border-0 font-bold ml-2">
                {isFounder ? "Founder" : "Active"}
              </Badge>
            </motion.div>
          )}
        </div>
      </section>

      {/* Plan cards — hidden for founders who already have lifetime access */}
      {!isFounder && (
        <section
          id="pricing-plans"
          className="container mx-auto px-4 py-14 max-w-6xl"
          data-ocid="pricing.plans_section"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayPlans.map((plan, index) => (
              <motion.div
                key={plan.duration}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <PlanCard
                  plan={plan}
                  isBestValue={plan.duration === "months12"}
                  isLoading={loadingPlan === plan.duration}
                  isLoggedIn={isLoggedIn}
                  onSubscribe={handleSubscribe}
                />
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-muted-foreground text-sm mt-6 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            Secure payment via Stripe · Cancel anytime from your account
          </motion.p>
        </section>
      )}

      {/* Free vs Premium comparison */}
      <section className="bg-muted/30 border-t border-border py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-extrabold text-3xl text-foreground">
              Free vs Premium
            </h2>
            <p className="text-muted-foreground mt-2">
              See exactly what you get with each tier
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Free column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="bg-card border border-border rounded-2xl p-6"
              data-ocid="pricing.free_tier_card"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    Free
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Always available
                  </p>
                </div>
              </div>
              <ul className="space-y-2.5 mb-4">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check
                        className="w-2.5 h-2.5 text-muted-foreground"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border pt-4 space-y-2">
                {FREE_LIMITATIONS.map((l) => (
                  <div key={l} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X
                        className="w-2.5 h-2.5 text-destructive"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-muted-foreground">{l}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Premium column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="bg-gradient-to-b from-amber-500/[0.08] to-card border-2 border-amber-400/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_32px_-8px_oklch(0.82_0.18_70/0.25)]"
              data-ocid="pricing.premium_tier_card"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
                    Premium
                    <Badge className="bg-amber-500 text-white border-0 text-[10px] font-bold">
                      BEST
                    </Badge>
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Everything, unlocked
                  </p>
                </div>
              </div>
              <ul className="space-y-2.5">
                {[
                  "All 50+ exercises including advanced",
                  "Unlimited CORE AI conversations",
                  "Personalised AI workout plans",
                  "Custom nutrition & meal plans",
                  "Priority AI responses",
                  "Access to future premium features",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check
                        className="w-2.5 h-2.5 text-amber-500"
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom CTA — hidden for founders */}
      {!isFounder && (
        <section className="bg-background py-14 border-t border-border">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display font-extrabold text-3xl text-foreground mb-3">
                Ready to level up?
              </h2>
              <p className="text-muted-foreground mb-7 text-base">
                Join CORE Theory Premium and get unlimited access to AI
                coaching, advanced exercises, and personalised plans tailored to
                your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  onClick={() => {
                    if (!isLoggedIn) {
                      login();
                      return;
                    }
                    const target = document.getElementById("pricing-plans");
                    target?.scrollIntoView({ behavior: "smooth" });
                  }}
                  data-ocid="pricing.bottom_cta_button"
                  className="gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-semibold shadow-[0_4px_20px_-4px_oklch(0.82_0.18_70/0.4)] h-12 px-8"
                >
                  <Crown className="w-5 h-5" />
                  {isLoggedIn ? "Choose a Plan" : "Log in to Subscribe"}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}

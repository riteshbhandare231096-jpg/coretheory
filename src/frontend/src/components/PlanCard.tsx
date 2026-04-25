import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlanUI } from "@/types";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface PlanCardProps {
  plan: SubscriptionPlanUI;
  isBestValue?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  isLoggedIn: boolean;
  onSubscribe: (duration: SubscriptionPlanUI["duration"]) => void;
}

const DURATION_MONTHS: Record<SubscriptionPlanUI["duration"], number> = {
  months3: 3,
  months6: 6,
  months9: 9,
  months12: 12,
};

const SAVINGS_LABEL: Record<SubscriptionPlanUI["duration"], string | null> = {
  months3: null,
  months6: "Save 10%",
  months9: "Save 15%",
  months12: "Best Value — Save 20%",
};

const PREMIUM_FEATURES = [
  "All 50+ exercises including advanced",
  "Unlimited CORE AI conversations",
  "Personalised AI workout plans",
  "Custom nutrition & meal plans",
  "Priority AI responses",
];

export function PlanCard({
  plan,
  isBestValue = false,
  isLoading = false,
  isLoggedIn,
  onSubscribe,
}: PlanCardProps) {
  const months = DURATION_MONTHS[plan.duration];
  const totalInr = plan.priceUsdCents; // values are stored as INR amounts directly
  const perMonth = Math.round(totalInr / months);
  const savingsLabel = SAVINGS_LABEL[plan.duration];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={[
        "relative flex flex-col rounded-2xl border-2 overflow-hidden transition-smooth",
        isBestValue
          ? "border-amber-400/70 shadow-[0_0_32px_-4px_oklch(0.82_0.18_70/0.35)]"
          : "border-border hover:border-primary/40",
      ].join(" ")}
      data-ocid={`pricing.plan_card.${plan.duration}`}
    >
      {/* Gold gradient top bar */}
      <div
        className={[
          "h-1.5 w-full",
          isBestValue
            ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"
            : "bg-gradient-to-r from-primary/60 to-accent/60",
        ].join(" ")}
      />

      {/* Best value ribbon */}
      {isBestValue && (
        <div className="absolute top-4 right-0 flex items-center gap-1 bg-gradient-to-l from-amber-500 to-amber-400 text-white text-[11px] font-bold px-3 py-1 rounded-l-full shadow">
          <Crown className="w-3 h-3" />
          Best Value
        </div>
      )}

      <div
        className={[
          "flex flex-col flex-1 p-6",
          isBestValue
            ? "bg-gradient-to-b from-amber-500/[0.08] to-card"
            : "bg-card",
        ].join(" ")}
      >
        {/* Duration label + savings badge */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-foreground leading-none">
              {plan.displayLabel}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">subscription</p>
          </div>
          {savingsLabel && !isBestValue && (
            <Badge
              variant="secondary"
              className="text-[10px] font-bold bg-primary/10 text-primary border-primary/20 mt-0.5 shrink-0"
            >
              {savingsLabel}
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-end gap-1">
            <span className="text-muted-foreground text-lg font-medium leading-none mb-1">
              ₹
            </span>
            <span
              className={[
                "font-display font-extrabold leading-none",
                isBestValue
                  ? "text-5xl text-amber-500 dark:text-amber-400"
                  : "text-5xl text-primary",
              ].join(" ")}
            >
              {totalInr.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            <span
              className={[
                "font-semibold",
                isBestValue
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-foreground",
              ].join(" ")}
            >
              ₹{perMonth.toLocaleString("en-IN")}
            </span>{" "}
            / month · billed once
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-5" />

        {/* Feature list */}
        <ul className="space-y-2.5 flex-1 mb-6">
          {PREMIUM_FEATURES.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5 text-sm">
              <div
                className={[
                  "w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  isBestValue
                    ? "bg-amber-500/20 text-amber-500"
                    : "bg-primary/15 text-primary",
                ].join(" ")}
              >
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </div>
              <span className="text-foreground leading-snug">{feat}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button
          onClick={() => onSubscribe(plan.duration)}
          disabled={isLoading}
          data-ocid={`pricing.subscribe_button.${plan.duration}`}
          className={[
            "w-full font-semibold gap-2 h-11",
            isBestValue
              ? "bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white shadow-[0_4px_16px_-2px_oklch(0.82_0.18_70/0.4)]"
              : "bg-primary hover:bg-primary/90 text-primary-foreground",
          ].join(" ")}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Redirecting…
            </>
          ) : isLoggedIn ? (
            <>
              <Sparkles className="w-4 h-4" />
              {isBestValue
                ? "Get Best Value"
                : `Subscribe — ${plan.displayLabel}`}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Log in to Subscribe
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DISABLED_EXERCISES,
  type DisabledCategory,
  type DisabledDifficulty,
  type DisabledExercise,
} from "@/data/disabled-exercises";
import { useAccessControl } from "@/hooks/useAccessControl";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Crown,
  Video,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ── Filter types ───────────────────────────────────────────────────────────

type DifficultyFilter = "All" | DisabledDifficulty;
type CategoryFilter = "All" | DisabledCategory;

const DIFFICULTY_FILTERS: DifficultyFilter[] = ["All", "Easy", "Moderate"];
const CATEGORY_FILTERS: CategoryFilter[] = [
  "All",
  "Seated",
  "Stretching",
  "Breathing",
  "Balance",
];

// ── Colour maps ────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<DisabledCategory, string> = {
  Seated: "bg-primary/10 text-primary border-primary/30",
  Stretching: "bg-accent/10 text-accent border-accent/30",
  Breathing: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  Balance: "bg-muted text-foreground border-border",
};

const DIFFICULTY_STYLES: Record<DisabledDifficulty, string> = {
  Easy: "badge-beginner",
  Moderate: "badge-intermediate",
};

// ── Exercise card ──────────────────────────────────────────────────────────

interface ExerciseCardProps {
  exercise: DisabledExercise;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function ExerciseCard({
  exercise,
  index,
  isExpanded,
  onToggle,
}: ExerciseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="exercise-card flex flex-col"
      data-ocid={`disabled_dashboard.exercise_card.${index + 1}`}
    >
      {/* Card body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_STYLES[exercise.category]}`}
          >
            {exercise.category}
          </span>
          <span className={DIFFICULTY_STYLES[exercise.difficulty]}>
            {exercise.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-base text-foreground leading-snug">
          {exercise.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {exercise.description}
        </p>
      </div>

      {/* View details button */}
      <div className="px-5 pb-5">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 transition-smooth"
          onClick={onToggle}
          data-ocid={`disabled_dashboard.view_details_button.${index + 1}`}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              View Details
            </>
          )}
        </Button>
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border mx-5 mb-5 pt-4 flex flex-col gap-5">
              {/* Video placeholder */}
              <div className="rounded-xl bg-muted/60 border border-border aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-center px-4">
                  Video demonstration coming soon
                </p>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-display font-bold text-sm text-foreground mb-2">
                  How to do it
                </h4>
                <ol className="flex flex-col gap-1.5">
                  {exercise.instructions.map((step, i) => (
                    <li
                      key={`${exercise.id}-instr-${i}`}
                      className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed"
                    >
                      <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Benefits */}
              <div>
                <h4 className="font-display font-bold text-sm text-foreground mb-2">
                  Key Benefits
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {exercise.benefits.map((benefit, i) => (
                    <li
                      key={`${exercise.id}-benefit-${i}`}
                      className="flex gap-2 text-sm text-muted-foreground leading-relaxed"
                    >
                      <BadgeCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export function DisabledDashboardPage({
  onNavigate,
}: {
  onNavigate: (view: "home") => void;
}) {
  const {
    isLoggedIn,
    isFounder,
    loading: subLoading,
    accessReady,
    forceFounderUnlock,
  } = useAccessControl();

  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>("All");
  const [catFilter, setCatFilter] = useState<CategoryFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Redirect unauthenticated users only AFTER initialization completes
  // Founders always get access without any UDID requirement
  useEffect(() => {
    if (accessReady && !subLoading && !isLoggedIn) {
      onNavigate("home");
    }
  }, [accessReady, subLoading, isLoggedIn, onNavigate]);

  const filtered = DISABLED_EXERCISES.filter((ex) => {
    const diffOk = diffFilter === "All" || ex.difficulty === diffFilter;
    const catOk = catFilter === "All" || ex.category === catFilter;
    return diffOk && catOk;
  });

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!forceFounderUnlock && (subLoading || !accessReady)) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="disabled_dashboard.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="disabled_dashboard.page"
    >
      {/* Hero header */}
      <section className="bg-gradient-to-b from-card via-card to-background border-b border-border pb-10 pt-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back link */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onNavigate("home")}
            className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="disabled_dashboard.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </motion.button>

          {/* Access banner — Founder gets a special variant */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`mb-6 flex items-start sm:items-center gap-3 rounded-2xl px-4 py-3 border ${
              isFounder
                ? "bg-primary/8 border-primary/30"
                : "bg-accent/10 border-accent/30"
            }`}
            data-ocid="disabled_dashboard.verified_banner"
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 sm:mt-0 ${isFounder ? "bg-primary/20" : "bg-accent/20"}`}
            >
              {isFounder ? (
                <Crown className="w-4 h-4 text-primary" />
              ) : (
                <BadgeCheck className="w-4 h-4 text-accent" />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {isFounder
                  ? "Founder Full Access"
                  : "Disability Access Verified"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isFounder
                  ? "As founder, you have complete unrestricted access to this dashboard and all exercises."
                  : "Welcome! You have free access to all exercises in this dashboard — curated especially for you."}
              </p>
            </div>
            <Badge
              className={`ml-auto flex-shrink-0 font-bold text-xs hidden sm:inline-flex border ${isFounder ? "bg-primary/15 text-primary border-primary/30" : "bg-accent/15 text-accent border-accent/30"}`}
            >
              {isFounder ? "Founder" : "Free Access"}
            </Badge>
          </motion.div>

          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-foreground mb-2">
              Accessibility Fitness Dashboard
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              Specially curated exercises designed for people with disabilities.
              Every exercise here is low-impact and suitable for a wide range of
              mobility levels — from wheelchair users to those with partial
              mobility. Take it at your own pace.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            {[
              { label: "Total Exercises", value: DISABLED_EXERCISES.length },
              {
                label: "Categories",
                value: CATEGORY_FILTERS.length - 1,
              },
              { label: "All Low-Impact", value: "✓" },
              { label: "No Equipment Needed for Most", value: "✓" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-background border border-border rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm"
              >
                <span className="font-bold text-foreground">{stat.value}</span>
                <span className="text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 max-w-6xl py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Difficulty filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[5rem]">
                Difficulty
              </span>
              <div
                className="flex gap-1.5 flex-wrap"
                data-ocid="disabled_dashboard.difficulty_filter"
              >
                {DIFFICULTY_FILTERS.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDiffFilter(d)}
                    data-ocid={`disabled_dashboard.difficulty_${d.toLowerCase()}_tab`}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-smooth border ${
                      diffFilter === d
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden sm:block w-px bg-border self-stretch" />

            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[5rem]">
                Category
              </span>
              <div
                className="flex gap-1.5 flex-wrap"
                data-ocid="disabled_dashboard.category_filter"
              >
                {CATEGORY_FILTERS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCatFilter(c)}
                    data-ocid={`disabled_dashboard.category_${c.toLowerCase()}_tab`}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-smooth border ${
                      catFilter === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exercise grid */}
      <section className="container mx-auto px-4 max-w-6xl py-10">
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="disabled_dashboard.exercises_empty_state"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4 text-2xl">
              🔍
            </div>
            <h3 className="font-display font-bold text-lg text-foreground mb-2">
              No exercises match your filters
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Try adjusting the difficulty or category filters above to see more
              exercises.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={() => {
                setDiffFilter("All");
                setCatFilter("All");
              }}
              data-ocid="disabled_dashboard.clear_filters_button"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              exercise{filtered.length !== 1 ? "s" : ""}
              {diffFilter !== "All" || catFilter !== "All" ? " (filtered)" : ""}
            </p>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              data-ocid="disabled_dashboard.exercises_list"
            >
              {filtered.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  isExpanded={expandedId === exercise.id}
                  onToggle={() => handleToggle(exercise.id)}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Bottom note */}
      <section className="bg-muted/40 border-t border-border">
        <div className="container mx-auto px-4 max-w-6xl py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
              💙
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-foreground mb-0.5">
                Always listen to your body
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These exercises are specially curated to be safe and accessible.
                However, please consult your physiotherapist or doctor before
                starting any new exercise programme, especially if you have a
                recent injury or medical condition.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

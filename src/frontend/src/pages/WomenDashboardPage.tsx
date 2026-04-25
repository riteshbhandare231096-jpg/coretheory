import { PremiumGate } from "@/components/PremiumGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WOMEN_EXERCISES } from "@/data/women-exercises";
import type { WomenCategory, WomenExercise } from "@/data/women-exercises";
import { useAccessControl } from "@/hooks/useAccessControl";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Crown,
  Dumbbell,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

type FilterCategory = WomenCategory | "All";

// ── Sub-components ─────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  if (difficulty === "Beginner")
    return <span className="badge-beginner">{difficulty}</span>;
  if (difficulty === "Intermediate")
    return <span className="badge-intermediate">{difficulty}</span>;
  return <span className="badge-advanced">{difficulty}</span>;
}

function CategoryBadge({ category }: { category: string }) {
  const colorMap: Record<string, string> = {
    "Lower Body": "bg-primary/10 text-primary border-primary/30",
    Core: "bg-accent/10 text-accent-foreground border-accent/30",
    "Upper Body":
      "bg-secondary/30 text-secondary-foreground border-secondary/40",
    "Full Body": "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold border ${colorMap[category] ?? "bg-muted text-muted-foreground"}`}
    >
      {category}
    </Badge>
  );
}

function ExerciseCard({
  exercise,
  index,
  accentClass,
}: {
  exercise: WomenExercise;
  index: number;
  accentClass: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className={`bg-card border rounded-2xl overflow-hidden transition-smooth hover:shadow-lg group ${accentClass}`}
      data-ocid={`women_dashboard.exercise_card.${index + 1}`}
    >
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-bold text-base text-foreground leading-tight">
            {exercise.title}
          </h3>
          <DifficultyBadge difficulty={exercise.difficulty} />
        </div>
        <div className="mb-3">
          <CategoryBadge category={exercise.category} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {exercise.description}
        </p>
      </div>

      {/* View Details toggle */}
      <div className="border-t border-border px-5 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 text-primary font-semibold hover:bg-primary/8 justify-between"
          onClick={() => setExpanded((p) => !p)}
          data-ocid={`women_dashboard.view_details_button.${index + 1}`}
        >
          <span>View Details</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-border bg-muted/20 px-5 py-5 flex flex-col gap-5"
          data-ocid={`women_dashboard.detail_panel.${index + 1}`}
        >
          {/* Video placeholder */}
          <div className="rounded-xl bg-muted/50 border border-dashed border-border aspect-video flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <PlayCircle className="w-8 h-8 opacity-40" />
            <span className="text-xs font-medium">
              Video demonstration coming soon
            </span>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="font-display font-bold text-sm text-foreground mb-2.5">
              Instructions
            </h4>
            <ol className="space-y-2">
              {exercise.instructions.map((step, stepIdx) => (
                <li
                  key={`${exercise.id}-step-${stepIdx}`}
                  className="flex gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center mt-0.5">
                    {stepIdx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-display font-bold text-sm text-foreground mb-2.5">
              Key Benefits
            </h4>
            <ul className="space-y-1.5">
              {exercise.benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex gap-2 text-sm text-muted-foreground"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function FilterBar({
  active,
  onChange,
  ocidPrefix,
}: {
  active: FilterCategory;
  onChange: (c: FilterCategory) => void;
  ocidPrefix: string;
}) {
  const categories: FilterCategory[] = [
    "All",
    "Lower Body",
    "Core",
    "Upper Body",
    "Full Body",
  ];

  return (
    <fieldset className="flex flex-wrap gap-2 border-0 p-0 m-0">
      <legend className="sr-only">Filter by category</legend>
      {categories.map((cat) => (
        <button
          type="button"
          key={cat}
          onClick={() => onChange(cat)}
          data-ocid={`${ocidPrefix}.filter.${cat.toLowerCase().replace(/ /g, "_")}`}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            active === cat
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </fieldset>
  );
}

function ExerciseSection({
  title,
  description,
  exercises,
  sectionKey,
  accentClass,
  bgClass,
  iconEl,
}: {
  title: string;
  description: string;
  exercises: WomenExercise[];
  sectionKey: string;
  accentClass: string;
  bgClass: string;
  iconEl: React.ReactNode;
}) {
  const [filter, setFilter] = useState<FilterCategory>("All");

  const filtered =
    filter === "All"
      ? exercises
      : exercises.filter((e) => e.category === filter);

  return (
    <section
      className={`${bgClass} py-10`}
      data-ocid={`women_dashboard.${sectionKey}_section`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-3 mb-2"
        >
          <div className="mt-1 flex-shrink-0">{iconEl}</div>
          <div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
              {title}
            </h2>
            <p className="text-muted-foreground text-sm mt-1 max-w-xl">
              {description}
            </p>
          </div>
        </motion.div>

        {/* Filter bar */}
        <div className="mt-5 mb-6">
          <FilterBar
            active={filter}
            onChange={setFilter}
            ocidPrefix={`women_dashboard.${sectionKey}`}
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-14 text-muted-foreground text-sm"
            data-ocid={`women_dashboard.${sectionKey}.empty_state`}
          >
            No exercises match this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((ex, idx) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                index={idx}
                accentClass={accentClass}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export function WomenDashboardPage({
  onNavigate,
}: {
  onNavigate: (view: "home" | "pricing") => void;
}) {
  const {
    isPremium,
    isFounder,
    loading: subLoading,
    accessReady,
    isLoggedIn,
    forceFounderUnlock,
    canAccessWomenDashboard,
  } = useAccessControl();

  const basicExercises = WOMEN_EXERCISES.filter((e) => e.section === "basic");
  const advancedExercises = WOMEN_EXERCISES.filter(
    (e) => e.section === "advanced",
  );

  // Show loading spinner until access state is fully resolved
  // EXCEPTION: if forceFounderUnlock is true, skip straight to content — founder is confirmed
  if (!forceFounderUnlock && (subLoading || !accessReady)) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="women_dashboard.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users to home — only after initialization is complete
  if (!isLoggedIn) {
    onNavigate("home");
    return null;
  }

  // Non-premium, non-founder users see an inline upgrade gate — no silent redirect
  if (!canAccessWomenDashboard()) {
    return (
      <div
        className="min-h-screen bg-background"
        data-ocid="women_dashboard.page"
      >
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            data-ocid="women_dashboard.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
        <PremiumGate
          isPremium={isPremium}
          isFounder={isFounder}
          accessReady={accessReady}
          forceFounderUnlock={forceFounderUnlock}
          onUpgrade={() => onNavigate("pricing")}
          variant="page"
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="women_dashboard.page"
    >
      {/* Hero header */}
      <section className="bg-gradient-to-b from-card via-card to-background border-b border-border pb-10 pt-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back nav */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            data-ocid="women_dashboard.back_link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold mb-4"
            data-ocid="women_dashboard.premium_badge"
          >
            <Crown className="w-3.5 h-3.5" />
            Premium Access — Your plan includes full access to the Women's
            Fitness Dashboard
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-foreground">
                Women's Fitness Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground text-base max-w-2xl mt-2">
              Exercises curated for women's physical fitness and body figure
              goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Basic exercises section */}
      <ExerciseSection
        title="Basic Exercises"
        description="Foundation exercises for building strength, flexibility, and tone"
        exercises={basicExercises}
        sectionKey="basic"
        bgClass="bg-background"
        accentClass="border-primary/20 hover:border-primary/40"
        iconEl={
          <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        }
      />

      {/* Advanced exercises section */}
      <ExerciseSection
        title="Advanced Exercises"
        description="Challenging exercises for sculpting and advanced conditioning"
        exercises={advancedExercises}
        sectionKey="advanced"
        bgClass="bg-muted/30"
        accentClass="border-accent/20 hover:border-accent/40"
        iconEl={
          <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
            <Crown className="w-4 h-4 text-accent-foreground" />
          </div>
        }
      />
    </div>
  );
}

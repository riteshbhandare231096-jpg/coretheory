import { AnimatedExerciseDemo } from "@/components/AnimatedExerciseDemo";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { ExerciseCard } from "@/components/ExerciseCard";
import { PremiumGate } from "@/components/PremiumGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EXERCISES } from "@/data/exercises";
import { useAccessControl } from "@/hooks/useAccessControl";
import type { Exercise } from "@/types";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Share2,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ExerciseDetailPageProps {
  exerciseId: string;
  onBack: () => void;
  onSelect: (exercise: Exercise) => void;
  onUpgrade?: () => void;
}

function DetailSkeleton() {
  return (
    <div
      className="container mx-auto px-4 py-8 max-w-6xl"
      data-ocid="exercise_detail.loading_state"
    >
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function NotFoundState({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="container mx-auto px-4 py-24 max-w-2xl text-center"
      data-ocid="exercise_detail.error_state"
    >
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
        <Dumbbell className="w-10 h-10 text-muted-foreground/40" />
      </div>
      <h2 className="font-display font-bold text-3xl text-foreground mb-3">
        Exercise Not Found
      </h2>
      <p className="text-muted-foreground text-lg mb-8">
        We couldn't find the exercise you're looking for. It may have been moved
        or the link is incorrect.
      </p>
      <Button
        onClick={onBack}
        className="gap-2"
        data-ocid="exercise_detail.back_button"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Browse
      </Button>
    </div>
  );
}

export function ExerciseDetailPage({
  exerciseId,
  onBack,
  onSelect,
  onUpgrade,
}: ExerciseDetailPageProps) {
  const [pageLoading, setPageLoading] = useState(true);
  const { isFounder, accessReady, forceFounderUnlock, isExerciseLocked } =
    useAccessControl();

  const exercise = EXERCISES.find((e) => e.id === exerciseId) ?? null;

  const related = exercise
    ? EXERCISES.filter(
        (e) => e.category === exercise.category && e.id !== exercise.id,
      ).slice(0, 4)
    : [];

  // Simulate brief render delay for skeleton effect
  // biome-ignore lint/correctness/useExhaustiveDependencies: exerciseId triggers reset intentionally
  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 400);
    return () => clearTimeout(t);
  }, [exerciseId]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() =>
          toast.success("Link copied!", {
            description: "Share this exercise with a friend.",
            duration: 4000,
          }),
        )
        .catch(() =>
          toast.error("Couldn't copy link", {
            description: "Try copying the URL manually.",
          }),
        );
    } else {
      toast.info("Copy this link:", { description: url });
    }
  }, []);

  if (pageLoading) return <DetailSkeleton />;
  if (!exercise) return <NotFoundState onBack={onBack} />;

  /**
   * Lock decision:
   * Lock decision delegated entirely to useAccessControl.isExerciseLocked().
   * Returns false until accessReady=true — no flash-of-locked-state ever.
   */
  const isLocked = isExerciseLocked(exercise);

  const durationMin = Math.round(exercise.durationSeconds / 60);
  const totalCalories = Math.round(exercise.caloriesPerMinute * durationMin);

  const stats = [
    {
      icon: Clock,
      label: "Duration",
      value: durationMin < 1 ? "<1 min" : `${durationMin} min`,
    },
    {
      icon: Flame,
      label: "Burn Rate",
      value: `${exercise.caloriesPerMinute} cal/min`,
    },
    { icon: Zap, label: "Total Burn", value: `~${totalCalories} kcal` },
    {
      icon: Target,
      label: "Equipment",
      value: exercise.equipment.length === 0 ? "None" : exercise.equipment[0],
    },
  ];

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="exercise_detail.page"
    >
      {/* Top bar */}
      <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4 max-w-6xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
            data-ocid="exercise_detail.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Browse</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="flex-1 min-w-0 hidden md:block">
            <p className="font-display font-semibold text-sm text-foreground truncate">
              {exercise.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
              data-ocid="exercise_detail.share_button"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Premium gate overlay for locked exercises */}
      {isLocked ? (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Show blurred preview of the exercise title and category */}
          <div className="mb-6 flex items-start gap-3 select-none pointer-events-none opacity-50 blur-[1px]">
            <div>
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-foreground">
                {exercise.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{exercise.category}</Badge>
                <DifficultyBadge difficulty={exercise.difficulty} />
              </div>
            </div>
          </div>
          <PremiumGate
            isPremium={false}
            isFounder={isFounder}
            accessReady={accessReady}
            forceFounderUnlock={forceFounderUnlock}
            onUpgrade={onUpgrade ?? (() => {})}
            variant="page"
          />
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* ── LEFT: Demo + Tabs ───────────────────────── */}
            <div className="lg:col-span-3 space-y-6">
              {/* Animated muscle player */}
              <AnimatedExerciseDemo
                exercise={exercise}
                className="w-full"
                style={{ minHeight: "420px" }}
                data-ocid="exercise_detail.video_player"
              />

              {/* Exercise title section */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 justify-between">
                  <h1 className="font-display font-extrabold text-3xl md:text-4xl text-foreground leading-tight">
                    {exercise.title}
                  </h1>
                  <DifficultyBadge
                    difficulty={exercise.difficulty}
                    className="shrink-0 mt-1 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-semibold">
                    {exercise.category}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {exercise.description}
                </p>
              </div>

              {/* Tabs: Instructions + Benefits */}
              <Tabs
                defaultValue="instructions"
                data-ocid="exercise_detail.tabs"
              >
                <TabsList className="w-full grid grid-cols-2 h-11">
                  <TabsTrigger
                    value="instructions"
                    className="font-semibold"
                    data-ocid="exercise_detail.instructions_tab"
                  >
                    Instructions
                  </TabsTrigger>
                  <TabsTrigger
                    value="benefits"
                    className="font-semibold"
                    data-ocid="exercise_detail.benefits_tab"
                  >
                    Benefits
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="instructions" className="mt-5">
                  <div
                    className="bg-card border border-border rounded-xl p-5 space-y-1"
                    data-ocid="exercise_detail.instructions_panel"
                  >
                    <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-4">
                      How To Perform
                    </h3>
                    <ol className="space-y-4">
                      {exercise.instructions.map((step, i) => (
                        <li
                          key={`step-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: ordered steps
                            i
                          }`}
                          className="flex gap-4 items-start"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                            {i + 1}
                          </div>
                          <p className="text-foreground/90 leading-relaxed pt-1">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </TabsContent>

                <TabsContent value="benefits" className="mt-5">
                  <div
                    className="bg-card border border-border rounded-xl p-5"
                    data-ocid="exercise_detail.benefits_panel"
                  >
                    <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-4">
                      Key Benefits
                    </h3>
                    <ul className="space-y-3">
                      {exercise.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground/90 leading-relaxed">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* ── RIGHT: Stats + Tags ──────────────────────── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Stats grid */}
              <div
                className="bg-card border border-border rounded-xl p-5"
                data-ocid="exercise_detail.stats_panel"
              >
                <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-4">
                  At a Glance
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="bg-muted/50 rounded-lg p-3.5 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground font-medium">
                          {label}
                        </span>
                      </div>
                      <span className="font-display font-bold text-foreground text-sm leading-tight truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Muscle groups */}
              <div
                className="bg-card border border-border rounded-xl p-5"
                data-ocid="exercise_detail.muscles_panel"
              >
                <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3">
                  Muscles Worked
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups.map((muscle) => (
                    <Badge
                      key={muscle}
                      variant="outline"
                      className="text-sm font-medium px-3 py-1"
                    >
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div
                className="bg-card border border-border rounded-xl p-5"
                data-ocid="exercise_detail.equipment_panel"
              >
                <h3 className="font-display font-semibold text-xs text-muted-foreground uppercase tracking-widest mb-3">
                  Equipment Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.equipment.length === 0 ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-primary" />
                      No equipment — bodyweight only
                    </div>
                  ) : (
                    exercise.equipment.map((item) => (
                      <Badge
                        key={item}
                        className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary border-primary/20"
                      >
                        <Dumbbell className="w-3.5 h-3.5 mr-1.5" />
                        {item}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Pro tip callout */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-foreground mb-1">
                      Pro Tip
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exercise.difficulty === "Beginner"
                        ? "Focus on form before adding reps. Quality movement beats quantity every time."
                        : exercise.difficulty === "Intermediate"
                          ? "Add tempo variation — slow the eccentric phase to maximize muscle tension."
                          : "Track progressive overload weekly. Small consistent gains compound powerfully over months."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related Exercises ──────────────────────────── */}
          {related.length > 0 && (
            <section
              className="mt-16 pt-10 border-t border-border"
              data-ocid="exercise_detail.related_section"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-2xl text-foreground">
                    More {exercise.category}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    Related exercises in the same category
                  </p>
                </div>
              </div>
              <ScrollArea
                className="w-full"
                data-ocid="exercise_detail.related_list"
              >
                <div className="flex gap-4 pb-4">
                  {related.map((rel, i) => (
                    <div
                      key={rel.id}
                      className="w-72 flex-shrink-0"
                      data-ocid={`exercise_detail.related.item.${i + 1}`}
                    >
                      <ExerciseCard
                        exercise={rel}
                        index={i}
                        onSelect={onSelect}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

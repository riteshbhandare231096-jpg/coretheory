import { DifficultyBadge } from "@/components/DifficultyBadge";
import { Badge } from "@/components/ui/badge";
import type { Category, Exercise } from "@/types";
import { Clock, Flame, Play } from "lucide-react";

// Category emoji map for card thumbnails
const CATEGORY_ICON: Record<Category, string> = {
  "Upper Body": "💪",
  "Lower Body": "🦵",
  Core: "🔥",
  Cardio: "🏃",
  Flexibility: "🧘",
  Strength: "🏋️",
  Balance: "⚖️",
  Mobility: "🔄",
};

// Category gradient map for card thumbnails
const CATEGORY_GRADIENT: Record<Category, string> = {
  "Upper Body": "from-blue-500/20 via-cyan-500/10 to-background",
  "Lower Body": "from-violet-500/20 via-purple-500/10 to-background",
  Core: "from-orange-500/20 via-red-500/10 to-background",
  Cardio: "from-red-500/20 via-pink-500/10 to-background",
  Flexibility: "from-teal-500/20 via-green-500/10 to-background",
  Strength: "from-amber-500/20 via-yellow-500/10 to-background",
  Balance: "from-sky-500/20 via-indigo-500/10 to-background",
  Mobility: "from-lime-500/20 via-emerald-500/10 to-background",
};

interface ExerciseCardProps {
  exercise: Exercise;
  index?: number;
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseCard({
  exercise,
  index = 0,
  onSelect,
}: ExerciseCardProps) {
  const durationMin = Math.round(exercise.durationSeconds / 60);
  const gradient = CATEGORY_GRADIENT[exercise.category];
  const icon = CATEGORY_ICON[exercise.category];

  return (
    <button
      type="button"
      className="exercise-card group w-full text-left"
      onClick={() => onSelect(exercise)}
      data-ocid={`exercise.item.${index + 1}`}
    >
      {/* Animated thumbnail */}
      <div className={`video-thumbnail bg-gradient-to-br ${gradient}`}>
        {/* Animated SVG pulse rings */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-24 h-24 rounded-full border border-primary/10 absolute animate-pulse" />
          <div
            className="w-16 h-16 rounded-full border border-primary/15 absolute"
            style={{ animationDelay: "0.3s" }}
          />
          <div className="w-8 h-8 rounded-full bg-primary/8 absolute" />
        </div>

        {/* Category icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-5xl transition-smooth group-hover:scale-110 group-hover:-rotate-6 inline-block drop-shadow-lg"
            role="img"
            aria-label={exercise.category}
          >
            {icon}
          </span>
        </div>

        {/* Play overlay */}
        <div className="play-icon opacity-0 group-hover:opacity-100 transition-smooth">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/90 text-primary-foreground shadow-play-icon">
            <Play className="w-6 h-6 ml-0.5" />
          </div>
        </div>

        {/* Category pill */}
        <div className="absolute top-2 left-2">
          <Badge
            variant="secondary"
            className="text-xs font-semibold shadow-subtle"
          >
            {exercise.category}
          </Badge>
        </div>

        {/* Animated demo indicator */}
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-0.5 rounded-full bg-black/40 text-white/80 text-[10px] font-semibold border border-white/10 backdrop-blur-sm">
            ▶ Animated
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-base text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {exercise.title}
          </h3>
          <DifficultyBadge
            difficulty={exercise.difficulty}
            className="shrink-0 mt-0.5"
          />
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {exercise.description}
        </p>

        {/* Muscle groups */}
        <div className="flex flex-wrap gap-1">
          {exercise.muscleGroups.slice(0, 3).map((muscle) => (
            <span
              key={muscle}
              className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground font-medium"
            >
              {muscle}
            </span>
          ))}
          {exercise.muscleGroups.length > 3 && (
            <span className="px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground font-medium">
              +{exercise.muscleGroups.length - 3}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-1 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{durationMin < 1 ? "<1 min" : `${durationMin} min`}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="w-3.5 h-3.5 text-destructive" />
            <span>{exercise.caloriesPerMinute} cal/min</span>
          </div>
          {exercise.equipment.length > 0 && (
            <div className="ml-auto text-xs text-muted-foreground truncate max-w-[100px]">
              {exercise.equipment[0]}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

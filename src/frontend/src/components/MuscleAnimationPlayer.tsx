import { MUSCLE_PHASES } from "@/data/muscle-phases";
import type { Exercise } from "@/types";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Muscle region → SVG path data (front view athletic silhouette) ────────────

const MUSCLE_PATHS: Record<string, { d: string; label: string }> = {
  neck: {
    d: "M 96 28 Q 100 24 104 28 L 106 42 Q 100 45 94 42 Z",
    label: "Neck",
  },
  traps: {
    d: "M 72 44 Q 84 40 96 43 Q 100 45 104 43 Q 116 40 128 44 L 130 58 Q 118 52 106 56 L 100 58 L 94 56 Q 82 52 70 58 Z",
    label: "Traps",
  },
  shoulders: {
    d: "M 58 56 Q 68 48 80 54 L 78 74 Q 66 68 56 72 Z M 142 56 Q 132 48 120 54 L 122 74 Q 134 68 144 72 Z",
    label: "Shoulders",
  },
  chest: {
    d: "M 80 58 Q 90 62 100 60 Q 110 62 120 58 L 118 84 Q 112 90 100 92 Q 88 90 82 84 Z",
    label: "Chest",
  },
  biceps: {
    d: "M 56 74 Q 50 78 48 92 Q 52 100 58 98 L 62 86 Q 62 78 64 74 Z M 144 74 Q 150 78 152 92 Q 148 100 142 98 L 138 86 Q 138 78 136 74 Z",
    label: "Biceps",
  },
  triceps: {
    d: "M 64 74 Q 70 76 76 78 L 74 94 Q 68 98 62 96 L 58 80 Z M 136 74 Q 130 76 124 78 L 126 94 Q 132 98 138 96 L 142 80 Z",
    label: "Triceps",
  },
  forearms: {
    d: "M 48 94 Q 44 104 46 114 Q 50 120 54 118 L 58 102 Q 54 98 52 96 Z M 152 94 Q 156 104 154 114 Q 150 120 146 118 L 142 102 Q 146 98 148 96 Z",
    label: "Forearms",
  },
  lats: {
    d: "M 76 78 Q 70 92 72 110 L 84 116 Q 84 100 82 84 Z M 124 78 Q 130 92 128 110 L 116 116 Q 116 100 118 84 Z",
    label: "Lats",
  },
  abs: {
    d: "M 88 92 Q 94 90 100 91 Q 106 90 112 92 L 112 118 Q 106 122 100 122 Q 94 122 88 118 Z",
    label: "Abs",
  },
  obliques: {
    d: "M 80 96 Q 84 100 86 112 L 80 120 Q 74 112 74 102 Z M 120 96 Q 116 100 114 112 L 120 120 Q 126 112 126 102 Z",
    label: "Obliques",
  },
  lower_back: {
    d: "M 84 116 Q 88 118 100 120 Q 112 118 116 116 L 118 130 Q 110 136 100 136 Q 90 136 82 130 Z",
    label: "Lower Back",
  },
  hip_flexors: {
    d: "M 86 118 Q 88 128 84 138 L 80 136 Q 80 126 82 118 Z M 114 118 Q 112 128 116 138 L 120 136 Q 120 126 118 118 Z",
    label: "Hip Flexors",
  },
  glutes: {
    d: "M 82 132 Q 88 128 100 130 Q 112 128 118 132 L 116 150 Q 108 156 100 156 Q 92 156 84 150 Z",
    label: "Glutes",
  },
  adductors: {
    d: "M 88 150 Q 92 156 92 168 L 88 170 Q 84 160 84 152 Z M 112 150 Q 108 156 108 168 L 112 170 Q 116 160 116 152 Z",
    label: "Adductors",
  },
  quads: {
    d: "M 84 152 Q 82 164 84 180 Q 88 188 92 186 L 94 170 Q 90 162 88 152 Z M 116 152 Q 118 164 116 180 Q 112 188 108 186 L 106 170 Q 110 162 112 152 Z",
    label: "Quads",
  },
  hamstrings: {
    d: "M 88 154 Q 92 162 92 178 L 96 186 Q 98 170 96 156 Z M 112 154 Q 108 162 108 178 L 104 186 Q 102 170 104 156 Z",
    label: "Hamstrings",
  },
  calves: {
    d: "M 84 188 Q 82 200 84 212 Q 88 218 92 216 L 92 198 Q 90 192 88 188 Z M 116 188 Q 118 200 116 212 Q 112 218 108 216 L 108 198 Q 110 192 112 188 Z",
    label: "Calves",
  },
  tibialis: {
    d: "M 92 192 Q 94 202 94 214 L 88 216 Q 86 206 86 192 Z M 108 192 Q 106 202 106 214 L 112 216 Q 114 206 114 192 Z",
    label: "Tibialis",
  },
};

// Ordered list for rendering (back to front layering)
const RENDER_ORDER = [
  "hamstrings",
  "glutes",
  "lower_back",
  "lats",
  "traps",
  "calves",
  "tibialis",
  "adductors",
  "quads",
  "hip_flexors",
  "obliques",
  "abs",
  "forearms",
  "biceps",
  "triceps",
  "chest",
  "shoulders",
  "neck",
];

// Full body outline silhouette path
const BODY_OUTLINE =
  "M 100 14 Q 108 14 112 22 L 112 28 Q 118 30 124 34 L 136 44 Q 150 50 156 62 L 154 80 Q 148 86 142 84 L 140 92 Q 142 108 140 120 L 136 136 Q 130 144 126 150 L 122 186 Q 120 200 120 214 Q 118 226 112 226 L 106 224 Q 102 224 100 224 Q 98 224 94 224 L 88 226 Q 82 226 80 214 Q 80 200 78 186 L 74 150 Q 70 144 64 136 L 60 120 Q 58 108 60 92 L 58 84 Q 52 86 46 80 L 44 62 Q 50 50 64 44 L 76 34 Q 82 30 88 28 L 88 22 Q 92 14 100 14 Z";

// Head
const HEAD_PATH =
  "M 100 6 Q 112 6 116 16 Q 118 24 116 32 Q 112 38 100 38 Q 88 38 84 32 Q 82 24 84 16 Q 88 6 100 6 Z";

type MuscleState = "inactive" | "active" | "secondary";

interface MuscleAnimationPlayerProps {
  exercise: Exercise;
  className?: string;
}

function getMuscleStates(
  activeMuscles: string[],
  secondaryMuscles: string[],
): Record<string, MuscleState> {
  const states: Record<string, MuscleState> = {};
  for (const key of Object.keys(MUSCLE_PATHS)) {
    if (activeMuscles.includes(key)) {
      states[key] = "active";
    } else if (secondaryMuscles.includes(key)) {
      states[key] = "secondary";
    } else {
      states[key] = "inactive";
    }
  }
  return states;
}

function getMuscleClass(state: MuscleState): string {
  switch (state) {
    case "active":
      return "muscle-glow-active";
    case "secondary":
      return "muscle-glow-secondary";
    default:
      return "muscle-inactive";
  }
}

export function MuscleAnimationPlayer({
  exercise,
  className = "",
}: MuscleAnimationPlayerProps) {
  const phases = MUSCLE_PHASES[exercise.id] ?? [
    {
      name: "Exercise Phase",
      primaryMuscles: exercise.muscleGroups
        .map((m) => m.toLowerCase().replace(/\s+/g, "_"))
        .slice(0, 3),
      secondaryMuscles: [],
      description: "Muscle activation phase",
    },
  ];

  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(
    (dir: 1 | -1) => {
      setCurrentPhase((p) => (p + dir + phases.length) % phases.length);
    },
    [phases.length],
  );

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => advance(1), 1800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, advance]);

  // Reset on exercise change
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when exercise changes
  useEffect(() => {
    setCurrentPhase(0);
    setIsPlaying(true);
  }, [exercise.id]);

  const phase = phases[currentPhase];
  const muscleStates = getMuscleStates(
    phase.primaryMuscles,
    phase.secondaryMuscles,
  );

  const activeCount = phase.primaryMuscles.length;
  const secondaryCount = phase.secondaryMuscles.length;

  return (
    <div
      className={`flex flex-col items-center gap-3 bg-gradient-to-b from-card to-background border border-border rounded-xl p-4 ${className}`}
    >
      {/* Phase label */}
      <div className="flex items-center gap-2 w-full justify-between px-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
            Phase {currentPhase + 1}/{phases.length}
          </span>
          <span className="text-sm font-bold text-foreground truncate">
            {phase.name}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            <span className="text-muted-foreground">{activeCount} primary</span>
          </span>
          <span className="flex items-center gap-1 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
            <span className="text-muted-foreground">
              {secondaryCount} secondary
            </span>
          </span>
        </div>
      </div>

      {/* SVG Body */}
      <div
        className="relative flex-1 w-full flex items-center justify-center"
        style={{ minHeight: 260 }}
      >
        {/* Background glow rings */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-48 h-48 rounded-full border border-primary/8 absolute" />
          <div className="w-64 h-64 rounded-full border border-primary/5 absolute" />
        </div>

        <svg
          viewBox="0 0 200 240"
          className="w-full max-w-[220px] h-auto"
          aria-label={`Muscle diagram for ${exercise.title} — ${phase.name}`}
          role="img"
        >
          <defs>
            <filter
              id="glow-active"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter
              id="glow-secondary"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-body" x="-5%" y="-5%" width="110%" height="110%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="bg-grad" cx="50%" cy="45%" r="50%">
              <stop
                offset="0%"
                stopColor="oklch(0.62 0.25 178)"
                stopOpacity="0.04"
              />
              <stop
                offset="100%"
                stopColor="oklch(0.62 0.25 178)"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          {/* Background fill */}
          <ellipse cx="100" cy="130" rx="60" ry="100" fill="url(#bg-grad)" />

          {/* Body outline */}
          <path
            d={BODY_OUTLINE}
            fill="oklch(0.45 0 0 / 0.12)"
            stroke="oklch(0.62 0.25 178 / 0.15)"
            strokeWidth="1"
            filter="url(#glow-body)"
          />

          {/* Muscle regions — rendered in order */}
          {RENDER_ORDER.map((muscleId) => {
            const muscle = MUSCLE_PATHS[muscleId];
            if (!muscle) return null;
            const state = muscleStates[muscleId] ?? "inactive";
            const cssClass = getMuscleClass(state);
            return (
              <path
                key={muscleId}
                d={muscle.d}
                className={cssClass}
                style={{
                  transition:
                    "fill 0.4s ease-in-out, filter 0.4s ease-in-out, opacity 0.4s ease-in-out",
                }}
              >
                <title>{muscle.label}</title>
              </path>
            );
          })}

          {/* Head */}
          <path
            d={HEAD_PATH}
            fill="oklch(0.55 0 0 / 0.35)"
            stroke="oklch(0.62 0.25 178 / 0.2)"
            strokeWidth="0.8"
          />
          {/* Face detail */}
          <circle cx="95" cy="18" r="1.2" fill="oklch(0.55 0 0 / 0.4)" />
          <circle cx="105" cy="18" r="1.2" fill="oklch(0.55 0 0 / 0.4)" />
          <path
            d="M 96 24 Q 100 27 104 24"
            stroke="oklch(0.55 0 0 / 0.3)"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Phase description */}
      <p className="text-xs text-muted-foreground text-center px-2 min-h-[2.5rem] leading-relaxed">
        {phase.description}
      </p>

      {/* Playback Controls */}
      <div className="flex items-center gap-3 w-full justify-center pb-1">
        {/* Backward */}
        <button
          type="button"
          onClick={() => advance(-1)}
          className="player-control-btn"
          aria-label="Previous phase"
          data-ocid="muscle_player.backward_button"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="player-control-btn player-control-btn--primary"
          aria-label={isPlaying ? "Pause" : "Play"}
          data-ocid="muscle_player.play_pause_button"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        {/* Forward */}
        <button
          type="button"
          onClick={() => advance(1)}
          className="player-control-btn"
          aria-label="Next phase"
          data-ocid="muscle_player.forward_button"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Phase dots */}
      <div className="flex items-center gap-1.5">
        {phases.map((_, i) => (
          <button
            key={`phase-dot-${
              // biome-ignore lint/suspicious/noArrayIndexKey: phase index is stable
              i
            }`}
            type="button"
            onClick={() => setCurrentPhase(i)}
            className={`transition-all duration-300 rounded-full ${
              i === currentPhase
                ? "w-5 h-2 bg-primary"
                : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
            aria-label={`Jump to phase ${i + 1}`}
            data-ocid={`muscle_player.phase_dot.${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

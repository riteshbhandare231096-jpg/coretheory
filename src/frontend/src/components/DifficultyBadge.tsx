import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; className: string }
> = {
  Beginner: {
    label: "Beginner",
    className: "badge-beginner",
  },
  Intermediate: {
    label: "Intermediate",
    className: "badge-intermediate",
  },
  Advanced: {
    label: "Advanced",
    className: "badge-advanced",
  },
};

export function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  const config = DIFFICULTY_CONFIG[difficulty];
  return (
    <span className={cn(config.className, className)}>{config.label}</span>
  );
}

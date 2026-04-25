/**
 * AnimatedExerciseDemo — uses AvatarExercisePlayer for exercise demonstrations.
 *
 * The cartoon founder avatar animates through exercise poses with glowing
 * muscle highlights driven by MUSCLE_PHASES data.
 *
 * All existing callers continue to work — props interface is unchanged.
 */
import { AvatarExercisePlayer } from "@/components/AvatarExercisePlayer";
import type { Exercise } from "@/types";

interface AnimatedExerciseDemoProps {
  exercise?: Exercise;
  // Legacy props — kept for backward compatibility but unused
  category?: string;
  title?: string;
  className?: string;
  [key: string]: unknown;
}

export function AnimatedExerciseDemo({
  exercise,
  className,
}: AnimatedExerciseDemoProps) {
  if (!exercise) return null;
  return <AvatarExercisePlayer exercise={exercise} className={className} />;
}

export default AnimatedExerciseDemo;

/**
 * AvatarExercisePlayer — Cartoon avatar exercise demonstration player.
 *
 * Renders a stylized South Asian cartoon figure (inspired by the founder's
 * appearance) that moves through exercise poses while glowing muscle regions
 * highlight in sync with MUSCLE_PHASES data.
 *
 * Poses: STANDING_REST | SQUAT_DOWN | PUSH_PRESS | HINGE_FORWARD |
 *        LYING_DOWN | PULL_UP | PLANK
 */

import { MUSCLE_PHASES } from "@/data/muscle-phases";
import type { Exercise } from "@/types";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Pose types ────────────────────────────────────────────────────────────────
type Pose =
  | "STANDING_REST"
  | "SQUAT_DOWN"
  | "PUSH_PRESS"
  | "HINGE_FORWARD"
  | "LYING_DOWN"
  | "PULL_UP"
  | "PLANK";

// ── Exercise → Pose mapping by exercise ID prefix / category ─────────────────
const EXERCISE_POSE_MAP: Record<string, Pose> = {
  // Pull movements
  "pull-up": "PULL_UP",
  "wide-grip-pull-up": "PULL_UP",
  "close-grip-pull-up": "PULL_UP",
  "neutral-grip-pull-up": "PULL_UP",
  "chin-up": "PULL_UP",
  "commando-pull-up": "PULL_UP",
  "archer-pull-up": "PULL_UP",
  "band-assisted-pull-up": "PULL_UP",
  "inverted-row": "PULL_UP",
  "weighted-pull-up": "PULL_UP",
  "barbell-row": "HINGE_FORWARD",
  "dumbbell-row": "HINGE_FORWARD",
  "cable-row": "PULL_UP",
  "lat-pulldown": "PULL_UP",
  // Push / press movements
  "push-up": "PUSH_PRESS",
  "wide-push-up": "PUSH_PRESS",
  "diamond-push-up": "PUSH_PRESS",
  "decline-push-up": "PUSH_PRESS",
  "incline-push-up": "PUSH_PRESS",
  "archer-push-up": "PUSH_PRESS",
  "pike-push-up": "PUSH_PRESS",
  "knee-push-up": "PUSH_PRESS",
  "wall-push-up": "PUSH_PRESS",
  "dumbbell-bench-press": "PUSH_PRESS",
  "barbell-bench-press": "PUSH_PRESS",
  "overhead-press": "PUSH_PRESS",
  "tricep-dips": "PUSH_PRESS",
  "tricep-pushdown": "PUSH_PRESS",
  // Squat / lower body
  squat: "SQUAT_DOWN",
  "sumo-squat": "SQUAT_DOWN",
  "jump-squat": "SQUAT_DOWN",
  "bulgarian-split-squat": "SQUAT_DOWN",
  "pistol-squat": "SQUAT_DOWN",
  "goblet-squat": "SQUAT_DOWN",
  "bodyweight-squat": "SQUAT_DOWN",
  lunges: "SQUAT_DOWN",
  "leg-press": "SQUAT_DOWN",
  "wall-sit": "SQUAT_DOWN",
  "calf-raises": "STANDING_REST",
  // Hinge movements
  deadlift: "HINGE_FORWARD",
  "romanian-deadlift": "HINGE_FORWARD",
  "good-morning": "HINGE_FORWARD",
  "hip-thrust": "LYING_DOWN",
  "glute-bridge": "LYING_DOWN",
  // Core / floor exercises
  plank: "PLANK",
  "side-plank": "PLANK",
  "mountain-climbers": "PLANK",
  "plank-reach": "PLANK",
  "hollow-hold": "LYING_DOWN",
  "bicycle-crunch": "LYING_DOWN",
  crunch: "LYING_DOWN",
  "leg-raises": "LYING_DOWN",
  "flutter-kicks": "LYING_DOWN",
  "v-ups": "LYING_DOWN",
  "dead-bug": "LYING_DOWN",
  "russian-twist": "LYING_DOWN",
  // Warmup / mobility
  "arm-circles": "STANDING_REST",
  "leg-swings": "STANDING_REST",
  "hip-circles": "STANDING_REST",
  "neck-rolls": "STANDING_REST",
  "torso-twists": "STANDING_REST",
  "high-knees": "STANDING_REST",
  "butt-kicks": "STANDING_REST",
  inchworm: "HINGE_FORWARD",
  "jumping-jacks": "STANDING_REST",
  "shoulder-rolls": "STANDING_REST",
  "hip-flexor-stretch": "SQUAT_DOWN",
  "glute-bridges-warmup": "LYING_DOWN",
};

function getPoseForExercise(exercise: Exercise): Pose {
  const mapped = EXERCISE_POSE_MAP[exercise.id];
  if (mapped) return mapped;
  const cat = exercise.category.toLowerCase();
  if (cat.includes("core")) return "LYING_DOWN";
  if (cat.includes("lower")) return "SQUAT_DOWN";
  if (cat.includes("upper") || cat.includes("strength")) return "PUSH_PRESS";
  if (cat.includes("warmup") || cat.includes("mobility"))
    return "STANDING_REST";
  if (cat.includes("flexibility")) return "STANDING_REST";
  return "STANDING_REST";
}

// ── Muscle region glow colors ─────────────────────────────────────────────────
const PRIMARY_COLOR = "oklch(0.72 0.28 178)";
const SECONDARY_COLOR = "oklch(0.72 0.22 70)";
const INACTIVE_COLOR = "oklch(0.55 0.04 30 / 0.35)";

type MuscleState = "active" | "secondary" | "inactive";

function getMuscleStates(
  primary: string[],
  secondary: string[],
): Record<string, MuscleState> {
  const all = [
    "neck",
    "traps",
    "shoulders",
    "chest",
    "biceps",
    "triceps",
    "forearms",
    "lats",
    "abs",
    "obliques",
    "lower_back",
    "hip_flexors",
    "glutes",
    "adductors",
    "quads",
    "hamstrings",
    "calves",
    "tibialis",
  ];
  const out: Record<string, MuscleState> = {};
  for (const m of all) {
    if (primary.includes(m)) out[m] = "active";
    else if (secondary.includes(m)) out[m] = "secondary";
    else out[m] = "inactive";
  }
  return out;
}

function muscleColor(s: MuscleState): string {
  if (s === "active") return PRIMARY_COLOR;
  if (s === "secondary") return SECONDARY_COLOR;
  return INACTIVE_COLOR;
}

function muscleOpacity(s: MuscleState): number {
  if (s === "active") return 0.92;
  if (s === "secondary") return 0.65;
  return 0.22;
}

// ── SVG Avatar figure component ───────────────────────────────────────────────
// Skin: deep warm brown (#6B3A2A / oklch equivalent) for South Asian complexion
// Hair: very dark brown/black
// Outfit: dark athletic wear (charcoal top, dark shorts)
// Height in viewBox: ~240px, viewBox "0 0 200 260"

interface AvatarFigureProps {
  pose: Pose;
  phase: number;
  muscles: Record<string, MuscleState>;
}

function AvatarFigure({ pose, phase, muscles }: AvatarFigureProps) {
  // Skin and outfit colors
  const skin = "#8B5A3C";
  const skinDark = "#6B3A2A";
  const hairColor = "#1A0A05";
  const topColor = "#1E293B";
  const shortsColor = "#0F172A";
  const shoeColor = "#374151";

  // Animated transform values per pose & phase
  // Each pose returns transforms for: leftArm, rightArm, leftLeg, rightLeg, torso, head
  interface PoseTransforms {
    torsoRotate: number;
    torsoTranslateY: number;
    headRotate: number;
    leftArmRotate: number;
    rightArmRotate: number;
    leftForearmRotate: number;
    rightForearmRotate: number;
    leftThighRotate: number;
    rightThighRotate: number;
    leftShinRotate: number;
    rightShinRotate: number;
  }

  function getPoseTransforms(p: Pose, ph: number): PoseTransforms {
    const phaseOscillate = ph % 2 === 0 ? 0 : 1; // alternates 0/1 for motion feel
    switch (p) {
      case "STANDING_REST":
        return {
          torsoRotate: 0,
          torsoTranslateY: phaseOscillate * -2,
          headRotate: 0,
          leftArmRotate: phaseOscillate * 8,
          rightArmRotate: phaseOscillate * -8,
          leftForearmRotate: phaseOscillate * 6,
          rightForearmRotate: phaseOscillate * -6,
          leftThighRotate: phaseOscillate * -4,
          rightThighRotate: phaseOscillate * 4,
          leftShinRotate: 0,
          rightShinRotate: 0,
        };
      case "SQUAT_DOWN":
        return {
          torsoRotate: phaseOscillate === 0 ? 12 : 0,
          torsoTranslateY: phaseOscillate === 0 ? 18 : 0,
          headRotate: 0,
          leftArmRotate: phaseOscillate === 0 ? 30 : 10,
          rightArmRotate: phaseOscillate === 0 ? -30 : -10,
          leftForearmRotate: phaseOscillate === 0 ? -10 : 0,
          rightForearmRotate: phaseOscillate === 0 ? 10 : 0,
          leftThighRotate: phaseOscillate === 0 ? 60 : 20,
          rightThighRotate: phaseOscillate === 0 ? -60 : -20,
          leftShinRotate: phaseOscillate === 0 ? -80 : -20,
          rightShinRotate: phaseOscillate === 0 ? 80 : 20,
        };
      case "PUSH_PRESS":
        return {
          torsoRotate: 0,
          torsoTranslateY: 0,
          headRotate: phaseOscillate === 0 ? -5 : 0,
          leftArmRotate: phaseOscillate === 0 ? -150 : -60,
          rightArmRotate: phaseOscillate === 0 ? 150 : 60,
          leftForearmRotate: phaseOscillate === 0 ? 20 : 0,
          rightForearmRotate: phaseOscillate === 0 ? -20 : 0,
          leftThighRotate: 0,
          rightThighRotate: 0,
          leftShinRotate: 0,
          rightShinRotate: 0,
        };
      case "HINGE_FORWARD":
        return {
          torsoRotate: phaseOscillate === 0 ? -50 : -15,
          torsoTranslateY: phaseOscillate === 0 ? 10 : 0,
          headRotate: phaseOscillate === 0 ? -15 : 0,
          leftArmRotate: phaseOscillate === 0 ? 70 : 20,
          rightArmRotate: phaseOscillate === 0 ? -70 : -20,
          leftForearmRotate: 0,
          rightForearmRotate: 0,
          leftThighRotate: phaseOscillate === 0 ? 10 : 0,
          rightThighRotate: phaseOscillate === 0 ? -10 : 0,
          leftShinRotate: phaseOscillate === 0 ? -5 : 0,
          rightShinRotate: phaseOscillate === 0 ? 5 : 0,
        };
      case "LYING_DOWN":
        return {
          torsoRotate: 90,
          torsoTranslateY: 30,
          headRotate: 90,
          leftArmRotate: phaseOscillate === 0 ? 30 : 10,
          rightArmRotate: phaseOscillate === 0 ? -30 : -10,
          leftForearmRotate: phaseOscillate === 0 ? 15 : 0,
          rightForearmRotate: phaseOscillate === 0 ? -15 : 0,
          leftThighRotate: phaseOscillate === 0 ? 15 : 0,
          rightThighRotate: phaseOscillate === 0 ? -15 : 0,
          leftShinRotate: phaseOscillate === 0 ? -20 : 0,
          rightShinRotate: phaseOscillate === 0 ? 20 : 0,
        };
      case "PULL_UP":
        return {
          torsoRotate: 0,
          torsoTranslateY: phaseOscillate === 0 ? 10 : 0,
          headRotate: phaseOscillate === 0 ? -8 : 0,
          leftArmRotate: phaseOscillate === 0 ? -145 : -170,
          rightArmRotate: phaseOscillate === 0 ? 145 : 170,
          leftForearmRotate: phaseOscillate === 0 ? 30 : 10,
          rightForearmRotate: phaseOscillate === 0 ? -30 : -10,
          leftThighRotate: phaseOscillate === 0 ? 20 : 0,
          rightThighRotate: phaseOscillate === 0 ? -20 : 0,
          leftShinRotate: phaseOscillate === 0 ? -30 : 0,
          rightShinRotate: phaseOscillate === 0 ? 30 : 0,
        };
      case "PLANK":
        return {
          torsoRotate: 10,
          torsoTranslateY: 25,
          headRotate: -5,
          leftArmRotate: 80,
          rightArmRotate: -80,
          leftForearmRotate: -80,
          rightForearmRotate: 80,
          leftThighRotate: 10,
          rightThighRotate: -10,
          leftShinRotate: 0,
          rightShinRotate: 0,
        };
    }
  }

  const t = getPoseTransforms(pose, phase);
  // Smooth CSS transition for all animated limb groups
  const anim: React.CSSProperties = {
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <svg
      viewBox="0 0 200 280"
      className="w-full max-w-[240px] h-auto"
      aria-label="Animated founder avatar exercise demonstration"
      role="img"
    >
      <defs>
        <filter id="av-glow-a" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <filter id="av-glow-b" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
        <filter id="av-shadow" x="-10%" y="-5%" width="120%" height="115%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="rgba(0,0,0,0.4)"
          />
        </filter>
        <radialGradient id="av-bg" cx="50%" cy="60%" r="45%">
          <stop
            offset="0%"
            stopColor="oklch(0.62 0.25 178)"
            stopOpacity="0.06"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.62 0.25 178)"
            stopOpacity="0"
          />
        </radialGradient>
        <radialGradient id="skinGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={skin} />
          <stop offset="100%" stopColor={skinDark} />
        </radialGradient>
        <clipPath id="torsoClip">
          <rect x="80" y="95" width="40" height="60" rx="4" />
        </clipPath>
      </defs>

      {/* Background glow */}
      <ellipse cx="100" cy="155" rx="65" ry="90" fill="url(#av-bg)" />

      {/* Ground shadow */}
      <ellipse
        cx="100"
        cy={245 + t.torsoTranslateY * 0.3}
        rx="28"
        ry="5"
        fill="oklch(0.12 0 0 / 0.25)"
      />

      {/* ── Full avatar group ─────────────────────────────── */}
      <g
        style={{
          transform: `rotate(${t.torsoRotate}deg) translateY(${t.torsoTranslateY}px)`,
          transformOrigin: "100px 155px",
          ...anim,
        }}
      >
        {/* ── LEFT ARM (behind torso) ──────────────────── */}
        <g
          style={{
            transform: `rotate(${t.leftArmRotate}deg)`,
            transformOrigin: "82px 105px",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Upper left arm */}
          <rect x="72" y="105" width="12" height="30" rx="6" fill={topColor} />
          <rect
            x="73"
            y="105"
            width="10"
            height="25"
            rx="5"
            fill="url(#skinGrad)"
            fillOpacity="0.3"
          />
          {/* Muscle overlay — shoulders left */}
          <rect
            x="72"
            y="105"
            width="12"
            height="18"
            rx="5"
            fill={muscleColor(muscles.shoulders ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.shoulders ?? "inactive") * 0.7}
            filter={
              muscles.shoulders === "active" ? "url(#av-glow-a)" : undefined
            }
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          {/* Forearm left */}
          <g
            style={{
              transform: `rotate(${t.leftForearmRotate}deg)`,
              transformOrigin: "78px 135px",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <rect
              x="74"
              y="135"
              width="8"
              height="26"
              rx="4"
              fill="url(#skinGrad)"
            />
            {/* Biceps/forearm muscle overlay */}
            <rect
              x="74"
              y="135"
              width="8"
              height="14"
              rx="4"
              fill={muscleColor(muscles.biceps ?? "inactive")}
              fillOpacity={muscleOpacity(muscles.biceps ?? "inactive") * 0.7}
              filter={
                muscles.biceps === "active" ? "url(#av-glow-b)" : undefined
              }
              style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
            />
            <rect
              x="74"
              y="149"
              width="8"
              height="12"
              rx="4"
              fill={muscleColor(muscles.forearms ?? "inactive")}
              fillOpacity={muscleOpacity(muscles.forearms ?? "inactive") * 0.7}
              style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
            />
            {/* Left hand */}
            <circle cx="78" cy="164" r="5" fill="url(#skinGrad)" />
          </g>
        </g>

        {/* ── RIGHT ARM (behind torso) ─────────────────── */}
        <g
          style={{
            transform: `rotate(${t.rightArmRotate}deg)`,
            transformOrigin: "118px 105px",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <rect x="116" y="105" width="12" height="30" rx="6" fill={topColor} />
          <rect
            x="117"
            y="105"
            width="10"
            height="25"
            rx="5"
            fill="url(#skinGrad)"
            fillOpacity="0.3"
          />
          <rect
            x="116"
            y="105"
            width="12"
            height="18"
            rx="5"
            fill={muscleColor(muscles.shoulders ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.shoulders ?? "inactive") * 0.7}
            filter={
              muscles.shoulders === "active" ? "url(#av-glow-a)" : undefined
            }
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          <g
            style={{
              transform: `rotate(${t.rightForearmRotate}deg)`,
              transformOrigin: "122px 135px",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <rect
              x="118"
              y="135"
              width="8"
              height="26"
              rx="4"
              fill="url(#skinGrad)"
            />
            <rect
              x="118"
              y="135"
              width="8"
              height="14"
              rx="4"
              fill={muscleColor(muscles.biceps ?? "inactive")}
              fillOpacity={muscleOpacity(muscles.biceps ?? "inactive") * 0.7}
              filter={
                muscles.biceps === "active" ? "url(#av-glow-b)" : undefined
              }
              style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
            />
            <rect
              x="118"
              y="149"
              width="8"
              height="12"
              rx="4"
              fill={muscleColor(muscles.forearms ?? "inactive")}
              fillOpacity={muscleOpacity(muscles.forearms ?? "inactive") * 0.7}
              style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
            />
            <circle cx="122" cy="164" r="5" fill="url(#skinGrad)" />
          </g>
        </g>

        {/* ── TORSO ────────────────────────────────────── */}
        <g filter="url(#av-shadow)">
          {/* Athletic top */}
          <rect x="82" y="96" width="36" height="58" rx="8" fill={topColor} />
          {/* Top seam detail */}
          <line
            x1="100"
            y1="96"
            x2="100"
            y2="154"
            stroke="oklch(0.4 0 0 / 0.3)"
            strokeWidth="1"
          />
          {/* Chest muscle overlay */}
          <rect
            x="83"
            y="100"
            width="16"
            height="22"
            rx="5"
            fill={muscleColor(muscles.chest ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.chest ?? "inactive") * 0.8}
            filter={muscles.chest === "active" ? "url(#av-glow-a)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          <rect
            x="101"
            y="100"
            width="16"
            height="22"
            rx="5"
            fill={muscleColor(muscles.chest ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.chest ?? "inactive") * 0.8}
            filter={muscles.chest === "active" ? "url(#av-glow-a)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          {/* Abs overlay */}
          <rect
            x="88"
            y="124"
            width="10"
            height="12"
            rx="3"
            fill={muscleColor(muscles.abs ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.abs ?? "inactive") * 0.9}
            filter={muscles.abs === "active" ? "url(#av-glow-a)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          <rect
            x="102"
            y="124"
            width="10"
            height="12"
            rx="3"
            fill={muscleColor(muscles.abs ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.abs ?? "inactive") * 0.9}
            filter={muscles.abs === "active" ? "url(#av-glow-a)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          <rect
            x="88"
            y="138"
            width="10"
            height="12"
            rx="3"
            fill={muscleColor(muscles.abs ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.abs ?? "inactive") * 0.9}
            filter={muscles.abs === "active" ? "url(#av-glow-a)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          <rect
            x="102"
            y="138"
            width="10"
            height="12"
            rx="3"
            fill={muscleColor(muscles.abs ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.abs ?? "inactive") * 0.9}
            filter={muscles.abs === "active" ? "url(#av-glow-a)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          {/* Obliques */}
          <rect
            x="82"
            y="120"
            width="8"
            height="30"
            rx="4"
            fill={muscleColor(muscles.obliques ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.obliques ?? "inactive") * 0.7}
            filter={
              muscles.obliques === "active" ? "url(#av-glow-b)" : undefined
            }
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          <rect
            x="110"
            y="120"
            width="8"
            height="30"
            rx="4"
            fill={muscleColor(muscles.obliques ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.obliques ?? "inactive") * 0.7}
            filter={
              muscles.obliques === "active" ? "url(#av-glow-b)" : undefined
            }
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          {/* Traps neck area */}
          <rect
            x="88"
            y="84"
            width="24"
            height="14"
            rx="5"
            fill={muscleColor(muscles.traps ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.traps ?? "inactive") * 0.7}
            filter={muscles.traps === "active" ? "url(#av-glow-b)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
        </g>

        {/* ── SHORTS / HIPS ────────────────────────────── */}
        <rect x="84" y="152" width="32" height="24" rx="6" fill={shortsColor} />
        {/* Glutes / lower back overlay */}
        <rect
          x="84"
          y="152"
          width="32"
          height="16"
          rx="5"
          fill={muscleColor(muscles.glutes ?? "inactive")}
          fillOpacity={muscleOpacity(muscles.glutes ?? "inactive") * 0.7}
          filter={muscles.glutes === "active" ? "url(#av-glow-a)" : undefined}
          style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
        />
        <rect
          x="84"
          y="152"
          width="32"
          height="10"
          rx="5"
          fill={muscleColor(muscles.lower_back ?? "inactive")}
          fillOpacity={muscleOpacity(muscles.lower_back ?? "inactive") * 0.6}
          filter={
            muscles.lower_back === "active" ? "url(#av-glow-b)" : undefined
          }
          style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
        />

        {/* ── LEFT LEG ─────────────────────────────────── */}
        <g
          style={{
            transform: `rotate(${t.leftThighRotate}deg)`,
            transformOrigin: "90px 175px",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Thigh */}
          <rect
            x="84"
            y="175"
            width="14"
            height="36"
            rx="6"
            fill="url(#skinGrad)"
          />
          {/* Quad overlay */}
          <rect
            x="84"
            y="175"
            width="14"
            height="36"
            rx="6"
            fill={muscleColor(muscles.quads ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.quads ?? "inactive") * 0.75}
            filter={muscles.quads === "active" ? "url(#av-glow-a)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          {/* Hamstrings subtle overlay on back of thigh */}
          <rect
            x="86"
            y="185"
            width="6"
            height="24"
            rx="3"
            fill={muscleColor(muscles.hamstrings ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.hamstrings ?? "inactive") * 0.5}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          {/* Shin */}
          <g
            style={{
              transform: `rotate(${t.leftShinRotate}deg)`,
              transformOrigin: "91px 211px",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <rect
              x="85"
              y="211"
              width="12"
              height="32"
              rx="5"
              fill="url(#skinGrad)"
            />
            <rect
              x="85"
              y="211"
              width="12"
              height="22"
              rx="5"
              fill={muscleColor(muscles.calves ?? "inactive")}
              fillOpacity={muscleOpacity(muscles.calves ?? "inactive") * 0.7}
              filter={
                muscles.calves === "active" ? "url(#av-glow-b)" : undefined
              }
              style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
            />
            {/* Shoe */}
            <rect
              x="82"
              y="240"
              width="18"
              height="8"
              rx="4"
              fill={shoeColor}
            />
            <rect
              x="80"
              y="244"
              width="20"
              height="5"
              rx="2"
              fill={shoeColor}
            />
          </g>
        </g>

        {/* ── RIGHT LEG ────────────────────────────────── */}
        <g
          style={{
            transform: `rotate(${t.rightThighRotate}deg)`,
            transformOrigin: "110px 175px",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <rect
            x="102"
            y="175"
            width="14"
            height="36"
            rx="6"
            fill="url(#skinGrad)"
          />
          <rect
            x="102"
            y="175"
            width="14"
            height="36"
            rx="6"
            fill={muscleColor(muscles.quads ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.quads ?? "inactive") * 0.75}
            filter={muscles.quads === "active" ? "url(#av-glow-a)" : undefined}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          <rect
            x="108"
            y="185"
            width="6"
            height="24"
            rx="3"
            fill={muscleColor(muscles.hamstrings ?? "inactive")}
            fillOpacity={muscleOpacity(muscles.hamstrings ?? "inactive") * 0.5}
            style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
          />
          <g
            style={{
              transform: `rotate(${t.rightShinRotate}deg)`,
              transformOrigin: "109px 211px",
              transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <rect
              x="103"
              y="211"
              width="12"
              height="32"
              rx="5"
              fill="url(#skinGrad)"
            />
            <rect
              x="103"
              y="211"
              width="12"
              height="22"
              rx="5"
              fill={muscleColor(muscles.calves ?? "inactive")}
              fillOpacity={muscleOpacity(muscles.calves ?? "inactive") * 0.7}
              filter={
                muscles.calves === "active" ? "url(#av-glow-b)" : undefined
              }
              style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
            />
            <rect
              x="100"
              y="240"
              width="18"
              height="8"
              rx="4"
              fill={shoeColor}
            />
            <rect
              x="100"
              y="244"
              width="20"
              height="5"
              rx="2"
              fill={shoeColor}
            />
          </g>
        </g>

        {/* ── NECK ─────────────────────────────────────── */}
        <rect
          x="94"
          y="80"
          width="12"
          height="18"
          rx="4"
          fill="url(#skinGrad)"
        />
        <rect
          x="94"
          y="80"
          width="12"
          height="10"
          rx="3"
          fill={muscleColor(muscles.neck ?? "inactive")}
          fillOpacity={muscleOpacity(muscles.neck ?? "inactive") * 0.6}
          style={{ transition: "fill 0.4s, fill-opacity 0.4s" }}
        />

        {/* ── HEAD ─────────────────────────────────────── */}
        <g
          style={{
            transform: `rotate(${t.headRotate}deg)`,
            transformOrigin: "100px 55px",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Head shape — slightly oval, South Asian skin */}
          <ellipse
            cx="100"
            cy="55"
            rx="18"
            ry="22"
            fill="url(#skinGrad)"
            filter="url(#av-shadow)"
          />

          {/* Hair — short dark, natural style */}
          <path
            d="M 82 48 Q 84 30 100 28 Q 116 30 118 48 Q 115 34 100 32 Q 85 34 82 48 Z"
            fill={hairColor}
          />
          {/* Hair sides */}
          <path d="M 82 48 Q 80 52 82 56 Q 82 44 86 38 Z" fill={hairColor} />
          <path
            d="M 118 48 Q 120 52 118 56 Q 118 44 114 38 Z"
            fill={hairColor}
          />

          {/* Eyebrows */}
          <path
            d="M 89 46 Q 93 44 97 46"
            stroke={hairColor}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 103 46 Q 107 44 111 46"
            stroke={hairColor}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Eyes — almond shaped */}
          <ellipse cx="93" cy="51" rx="4" ry="2.8" fill="#fff" />
          <ellipse cx="107" cy="51" rx="4" ry="2.8" fill="#fff" />
          <circle cx="93.5" cy="51" r="2" fill="#1A0A05" />
          <circle cx="107.5" cy="51" r="2" fill="#1A0A05" />
          {/* Iris highlight */}
          <circle cx="94.2" cy="50.2" r="0.7" fill="white" fillOpacity="0.8" />
          <circle cx="108.2" cy="50.2" r="0.7" fill="white" fillOpacity="0.8" />
          {/* Upper eyelid line */}
          <path
            d="M 89 49.5 Q 93 48 97 49.5"
            stroke={skinDark}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 103 49.5 Q 107 48 111 49.5"
            stroke={skinDark}
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />

          {/* Nose — subtle */}
          <path
            d="M 100 53 Q 98 59 96 62 Q 100 64 104 62 Q 102 59 100 53"
            fill={skinDark}
            fillOpacity="0.3"
          />

          {/* Mouth — slight smile */}
          <path
            d="M 95 66 Q 100 70 105 66"
            stroke={skinDark}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 96 66 Q 100 68.5 104 66"
            stroke={skinDark}
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
            strokeOpacity="0.5"
          />

          {/* Ear details */}
          <ellipse cx="82" cy="55" rx="3.5" ry="5" fill="url(#skinGrad)" />
          <ellipse cx="118" cy="55" rx="3.5" ry="5" fill="url(#skinGrad)" />

          {/* Chin shadow */}
          <ellipse
            cx="100"
            cy="72"
            rx="8"
            ry="3"
            fill={skinDark}
            fillOpacity="0.15"
          />
        </g>
      </g>
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface AvatarExercisePlayerProps {
  exercise: Exercise;
  className?: string;
}

export function AvatarExercisePlayer({
  exercise,
  className = "",
}: AvatarExercisePlayerProps) {
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when exercise changes
  useEffect(() => {
    setCurrentPhase(0);
    setIsPlaying(true);
  }, [exercise.id]);

  const phase = phases[currentPhase];
  const muscles = getMuscleStates(phase.primaryMuscles, phase.secondaryMuscles);
  const pose = getPoseForExercise(exercise);

  const activeCount = phase.primaryMuscles.length;
  const secondaryCount = phase.secondaryMuscles.length;

  return (
    <div
      className={`flex flex-col items-center gap-3 bg-gradient-to-b from-card to-background border border-border rounded-xl p-4 ${className}`}
    >
      {/* Phase header */}
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

      {/* Avatar figure */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{ minHeight: 260 }}
      >
        {/* Decorative glow rings */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-44 h-44 rounded-full border border-primary/10 absolute" />
          <div className="w-60 h-60 rounded-full border border-primary/5 absolute" />
        </div>

        <AvatarFigure pose={pose} phase={currentPhase} muscles={muscles} />
      </div>

      {/* Phase description */}
      <p className="text-xs text-muted-foreground text-center px-2 min-h-[2.5rem] leading-relaxed">
        {phase.description}
      </p>

      {/* Playback Controls */}
      <div className="flex items-center gap-3 w-full justify-center pb-1">
        <button
          type="button"
          onClick={() => advance(-1)}
          className="player-control-btn"
          aria-label="Previous phase"
          data-ocid="avatar_player.backward_button"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="player-control-btn player-control-btn--primary"
          aria-label={isPlaying ? "Pause" : "Play"}
          data-ocid="avatar_player.play_pause_button"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => advance(1)}
          className="player-control-btn"
          aria-label="Next phase"
          data-ocid="avatar_player.forward_button"
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
            data-ocid={`avatar_player.phase_dot.${i + 1}`}
          />
        ))}
      </div>

      {/* Avatar label */}
      <p className="text-[10px] text-muted-foreground/50 text-center">
        Founder avatar · {exercise.category}
      </p>
    </div>
  );
}

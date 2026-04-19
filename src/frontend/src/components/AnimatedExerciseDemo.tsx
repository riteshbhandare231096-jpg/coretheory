import type { Category } from "@/types";
import type { ReactElement } from "react";

interface AnimatedExerciseDemoProps {
  category: Category;
  title: string;
  className?: string;
}

// ── SVG animation definitions per category ──────────────────────────────

function UpperBodyAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <defs>
        <style>{`
          .ub-arm-l { transform-origin: 60px 85px; animation: ub-arm-curl-l 1.6s ease-in-out infinite alternate; }
          .ub-arm-r { transform-origin: 140px 85px; animation: ub-arm-curl-r 1.6s ease-in-out infinite alternate; }
          .ub-chest { animation: ub-chest-pulse 1.6s ease-in-out infinite alternate; }
          @keyframes ub-arm-curl-l {
            0%   { transform: rotate(10deg); }
            100% { transform: rotate(-55deg); }
          }
          @keyframes ub-arm-curl-r {
            0%   { transform: rotate(-10deg); }
            100% { transform: rotate(55deg); }
          }
          @keyframes ub-chest-pulse {
            0%   { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>
      </defs>
      <ellipse
        cx="100"
        cy="130"
        rx="26"
        ry="34"
        fill="currentColor"
        opacity="0.12"
      />
      <ellipse
        className="ub-chest"
        cx="100"
        cy="115"
        rx="18"
        ry="12"
        fill="currentColor"
        opacity="0.5"
      />
      <circle cx="100" cy="60" r="22" fill="currentColor" opacity="0.18" />
      <circle cx="100" cy="60" r="17" fill="currentColor" opacity="0.3" />
      <g className="ub-arm-l">
        <rect
          x="48"
          y="85"
          width="12"
          height="44"
          rx="6"
          fill="currentColor"
          opacity="0.7"
        />
        <circle cx="54" cy="132" r="7" fill="currentColor" opacity="0.5" />
      </g>
      <g className="ub-arm-r">
        <rect
          x="140"
          y="85"
          width="12"
          height="44"
          rx="6"
          fill="currentColor"
          opacity="0.7"
        />
        <circle cx="146" cy="132" r="7" fill="currentColor" opacity="0.5" />
      </g>
      <rect
        x="86"
        y="162"
        width="12"
        height="26"
        rx="6"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="102"
        y="162"
        width="12"
        height="26"
        rx="6"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

function LowerBodyAnimation() {
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full" aria-hidden="true">
      <defs>
        <style>{`
          .lb-body { transform-origin: 100px 120px; animation: lb-squat-down 1.8s ease-in-out infinite alternate; }
          .lb-leg-l { transform-origin: 88px 160px; animation: lb-leg-bend-l 1.8s ease-in-out infinite alternate; }
          .lb-leg-r { transform-origin: 112px 160px; animation: lb-leg-bend-r 1.8s ease-in-out infinite alternate; }
          @keyframes lb-squat-down {
            0%   { transform: translateY(0px); }
            100% { transform: translateY(24px); }
          }
          @keyframes lb-leg-bend-l {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(18deg); }
          }
          @keyframes lb-leg-bend-r {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(-18deg); }
          }
        `}</style>
      </defs>
      <g className="lb-body">
        <circle cx="100" cy="55" r="20" fill="currentColor" opacity="0.25" />
        <ellipse
          cx="100"
          cy="110"
          rx="24"
          ry="32"
          fill="currentColor"
          opacity="0.18"
        />
        <rect
          x="58"
          y="88"
          width="10"
          height="34"
          rx="5"
          fill="currentColor"
          opacity="0.55"
        />
        <rect
          x="132"
          y="88"
          width="10"
          height="34"
          rx="5"
          fill="currentColor"
          opacity="0.55"
        />
      </g>
      <g className="lb-leg-l">
        <rect
          x="83"
          y="152"
          width="14"
          height="38"
          rx="7"
          fill="currentColor"
          opacity="0.7"
        />
        <rect
          x="80"
          y="188"
          width="16"
          height="14"
          rx="5"
          fill="currentColor"
          opacity="0.5"
        />
      </g>
      <g className="lb-leg-r">
        <rect
          x="103"
          y="152"
          width="14"
          height="38"
          rx="7"
          fill="currentColor"
          opacity="0.7"
        />
        <rect
          x="104"
          y="188"
          width="16"
          height="14"
          rx="5"
          fill="currentColor"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

function CoreAnimation() {
  return (
    <svg viewBox="0 0 200 180" className="w-full h-full" aria-hidden="true">
      <defs>
        <style>{`
          .co-body { transform-origin: 100px 110px; animation: co-plank-hold 2s ease-in-out infinite alternate; }
          .co-glow { animation: co-core-glow 2s ease-in-out infinite alternate; }
          @keyframes co-plank-hold {
            0%   { transform: translateY(0px) rotate(0deg); }
            100% { transform: translateY(-4px) rotate(-1deg); }
          }
          @keyframes co-core-glow {
            0%   { opacity: 0.2; r: 18; }
            100% { opacity: 0.7; r: 24; }
          }
        `}</style>
      </defs>
      <g className="co-body">
        <circle cx="28" cy="96" r="16" fill="currentColor" opacity="0.25" />
        <rect
          x="40"
          y="100"
          width="120"
          height="18"
          rx="9"
          fill="currentColor"
          opacity="0.2"
        />
        <circle className="co-glow" cx="100" cy="109" fill="currentColor" />
        <rect
          x="38"
          y="108"
          width="10"
          height="26"
          rx="5"
          fill="currentColor"
          opacity="0.65"
          transform="rotate(-10 43 108)"
        />
        <rect
          x="152"
          y="108"
          width="10"
          height="26"
          rx="5"
          fill="currentColor"
          opacity="0.65"
          transform="rotate(10 157 108)"
        />
        <rect
          x="158"
          y="105"
          width="12"
          height="32"
          rx="6"
          fill="currentColor"
          opacity="0.6"
          transform="rotate(5 164 105)"
        />
        <rect
          x="163"
          y="118"
          width="12"
          height="32"
          rx="6"
          fill="currentColor"
          opacity="0.5"
          transform="rotate(8 169 118)"
        />
      </g>
    </svg>
  );
}

function CardioAnimation() {
  return (
    <svg viewBox="0 0 200 220" className="w-full h-full" aria-hidden="true">
      <defs>
        <style>{`
          .ca-body { transform-origin: 100px 100px; animation: ca-jump-up 0.7s ease-in-out infinite alternate; }
          .ca-arm-l { transform-origin: 76px 100px; animation: ca-arm-l 0.7s ease-in-out infinite alternate; }
          .ca-arm-r { transform-origin: 124px 100px; animation: ca-arm-r 0.7s ease-in-out infinite alternate; }
          .ca-leg-l { transform-origin: 88px 160px; animation: ca-leg-l 0.7s ease-in-out infinite alternate; }
          .ca-leg-r { transform-origin: 112px 160px; animation: ca-leg-r 0.7s ease-in-out infinite alternate; }
          @keyframes ca-jump-up {
            0%   { transform: translateY(0px); }
            100% { transform: translateY(-18px); }
          }
          @keyframes ca-arm-l {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(-80deg); }
          }
          @keyframes ca-arm-r {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(80deg); }
          }
          @keyframes ca-leg-l {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(-30deg); }
          }
          @keyframes ca-leg-r {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(30deg); }
          }
        `}</style>
      </defs>
      <g className="ca-body">
        <circle cx="100" cy="58" r="20" fill="currentColor" opacity="0.25" />
        <ellipse
          cx="100"
          cy="108"
          rx="22"
          ry="30"
          fill="currentColor"
          opacity="0.18"
        />
      </g>
      <g className="ca-arm-l">
        <rect
          x="66"
          y="96"
          width="10"
          height="36"
          rx="5"
          fill="currentColor"
          opacity="0.65"
        />
      </g>
      <g className="ca-arm-r">
        <rect
          x="124"
          y="96"
          width="10"
          height="36"
          rx="5"
          fill="currentColor"
          opacity="0.65"
        />
      </g>
      <g className="ca-leg-l">
        <rect
          x="84"
          y="156"
          width="13"
          height="42"
          rx="6"
          fill="currentColor"
          opacity="0.7"
        />
      </g>
      <g className="ca-leg-r">
        <rect
          x="103"
          y="156"
          width="13"
          height="42"
          rx="6"
          fill="currentColor"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

function FlexibilityAnimation() {
  return (
    <svg viewBox="0 0 200 210" className="w-full h-full" aria-hidden="true">
      <defs>
        <style>{`
          .fl-body { transform-origin: 100px 100px; animation: fl-fold-down 2.2s ease-in-out infinite alternate; }
          .fl-line { animation: fl-stretch-pulse 2.2s ease-in-out infinite alternate; }
          @keyframes fl-fold-down {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(30deg) translateY(10px); }
          }
          @keyframes fl-stretch-pulse {
            0%   { opacity: 0.3; stroke-width: 2; }
            100% { opacity: 0.8; stroke-width: 3; }
          }
        `}</style>
      </defs>
      <rect
        x="84"
        y="140"
        width="14"
        height="52"
        rx="7"
        fill="currentColor"
        opacity="0.55"
      />
      <rect
        x="102"
        y="140"
        width="14"
        height="52"
        rx="7"
        fill="currentColor"
        opacity="0.55"
      />
      <g className="fl-body">
        <circle cx="100" cy="55" r="20" fill="currentColor" opacity="0.25" />
        <ellipse
          cx="100"
          cy="108"
          rx="22"
          ry="30"
          fill="currentColor"
          opacity="0.18"
        />
        <rect
          x="60"
          y="112"
          width="10"
          height="36"
          rx="5"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="130"
          y="112"
          width="10"
          height="36"
          rx="5"
          fill="currentColor"
          opacity="0.6"
        />
      </g>
      <path
        className="fl-line"
        d="M 60 148 Q 100 180 140 148"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
}

function StrengthAnimation() {
  return (
    <svg viewBox="0 0 200 210" className="w-full h-full" aria-hidden="true">
      <defs>
        <style>{`
          .st-body { transform-origin: 100px 120px; animation: st-deadlift-up 1.8s ease-in-out infinite alternate; }
          .st-barbell { animation: st-barbell-rise 1.8s ease-in-out infinite alternate; }
          @keyframes st-deadlift-up {
            0%   { transform: rotate(30deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes st-barbell-rise {
            0%   { transform: translateY(30px); }
            100% { transform: translateY(0px); }
          }
        `}</style>
      </defs>
      <rect
        x="84"
        y="150"
        width="14"
        height="48"
        rx="7"
        fill="currentColor"
        opacity="0.6"
      />
      <rect
        x="102"
        y="150"
        width="14"
        height="48"
        rx="7"
        fill="currentColor"
        opacity="0.6"
      />
      <g className="st-body">
        <circle cx="100" cy="52" r="20" fill="currentColor" opacity="0.25" />
        <ellipse
          cx="100"
          cy="105"
          rx="22"
          ry="32"
          fill="currentColor"
          opacity="0.18"
        />
        <rect
          x="60"
          y="92"
          width="10"
          height="42"
          rx="5"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="130"
          y="92"
          width="10"
          height="42"
          rx="5"
          fill="currentColor"
          opacity="0.6"
        />
      </g>
      <g className="st-barbell">
        <rect
          x="20"
          y="148"
          width="160"
          height="10"
          rx="5"
          fill="currentColor"
          opacity="0.6"
        />
        <circle cx="22" cy="153" r="13" fill="currentColor" opacity="0.4" />
        <circle cx="178" cy="153" r="13" fill="currentColor" opacity="0.4" />
      </g>
    </svg>
  );
}

function BalanceAnimation() {
  return (
    <svg viewBox="0 0 200 210" className="w-full h-full" aria-hidden="true">
      <defs>
        <style>{`
          .ba-body { transform-origin: 100px 130px; animation: ba-balance-sway 2.5s ease-in-out infinite alternate; }
          .ba-leg { transform-origin: 108px 150px; animation: ba-leg-raise 2.5s ease-in-out infinite alternate; }
          @keyframes ba-balance-sway {
            0%   { transform: rotate(-3deg); }
            100% { transform: rotate(3deg); }
          }
          @keyframes ba-leg-raise {
            0%   { transform: rotate(-10deg); }
            100% { transform: rotate(20deg); }
          }
        `}</style>
      </defs>
      <g className="ba-body">
        <circle cx="100" cy="52" r="20" fill="currentColor" opacity="0.25" />
        <ellipse
          cx="100"
          cy="108"
          rx="22"
          ry="32"
          fill="currentColor"
          opacity="0.18"
        />
        <rect
          x="55"
          y="90"
          width="10"
          height="40"
          rx="5"
          fill="currentColor"
          opacity="0.6"
          transform="rotate(-35 60 90)"
        />
        <rect
          x="135"
          y="90"
          width="10"
          height="40"
          rx="5"
          fill="currentColor"
          opacity="0.6"
          transform="rotate(35 140 90)"
        />
        <rect
          x="90"
          y="138"
          width="14"
          height="52"
          rx="7"
          fill="currentColor"
          opacity="0.7"
        />
      </g>
      <g className="ba-leg">
        <rect
          x="108"
          y="146"
          width="14"
          height="44"
          rx="7"
          fill="currentColor"
          opacity="0.65"
        />
      </g>
    </svg>
  );
}

function MobilityAnimation() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <defs>
        <style>{`
          .mo-torso { transform-origin: 100px 105px; animation: mo-rotate 2s ease-in-out infinite alternate; }
          .mo-arm { transform-origin: 100px 95px; animation: mo-arm-swing 2s ease-in-out infinite alternate; }
          @keyframes mo-rotate {
            0%   { transform: rotate(-20deg); }
            100% { transform: rotate(20deg); }
          }
          @keyframes mo-arm-swing {
            0%   { transform: rotate(-40deg); }
            100% { transform: rotate(40deg); }
          }
        `}</style>
      </defs>
      <rect
        x="84"
        y="145"
        width="13"
        height="44"
        rx="6"
        fill="currentColor"
        opacity="0.5"
      />
      <rect
        x="103"
        y="145"
        width="13"
        height="44"
        rx="6"
        fill="currentColor"
        opacity="0.5"
      />
      <g className="mo-torso">
        <circle cx="100" cy="52" r="20" fill="currentColor" opacity="0.25" />
        <ellipse
          cx="100"
          cy="105"
          rx="22"
          ry="32"
          fill="currentColor"
          opacity="0.2"
        />
      </g>
      <g className="mo-arm">
        <rect
          x="95"
          y="88"
          width="10"
          height="52"
          rx="5"
          fill="currentColor"
          opacity="0.65"
        />
        <circle cx="100" cy="142" r="8" fill="currentColor" opacity="0.5" />
      </g>
    </svg>
  );
}

const DEMO_MAP: Record<Category, () => ReactElement> = {
  "Upper Body": UpperBodyAnimation,
  "Lower Body": LowerBodyAnimation,
  Core: CoreAnimation,
  Cardio: CardioAnimation,
  Flexibility: FlexibilityAnimation,
  Strength: StrengthAnimation,
  Balance: BalanceAnimation,
  Mobility: MobilityAnimation,
};

export function AnimatedExerciseDemo({
  category,
  title,
  className = "",
}: AnimatedExerciseDemoProps) {
  const AnimComp = DEMO_MAP[category];

  return (
    <div
      className={`relative flex items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border ${className}`}
      role="img"
      aria-label={`Animated demonstration of ${title}`}
    >
      {/* Background rings */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-52 h-52 rounded-full border border-primary/10 absolute" />
        <div className="w-36 h-36 rounded-full border border-primary/15 absolute" />
        <div className="w-20 h-20 rounded-full bg-primary/5 absolute" />
      </div>

      {/* Animated figure */}
      <div className="relative w-40 h-40 text-primary">
        <AnimComp />
      </div>

      {/* Category label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/20 backdrop-blur-sm whitespace-nowrap">
          {category} · Animated Demo
        </span>
      </div>
    </div>
  );
}

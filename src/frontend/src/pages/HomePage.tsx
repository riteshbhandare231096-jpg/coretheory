import { ExerciseCard } from "@/components/ExerciseCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES, EXERCISES } from "@/data/exercises";
import type { Exercise } from "@/types";
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Dumbbell,
  Flame,
  Layers,
  Quote,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Core Theory Pillars ──────────────────────────────────────────────────
interface Pillar {
  emoji: string;
  color: string;
  accent: string;
  border: string;
  title: string;
  subtitle: string;
  body: string;
  stat: string;
  statLabel: string;
}

const PILLARS: Pillar[] = [
  {
    emoji: "🏋️",
    color: "from-primary/15 via-primary/5 to-transparent",
    accent: "text-primary",
    border: "border-primary/25 hover:border-primary/55",
    title: "Resistance Training",
    subtitle: "Build the engine",
    body: "Muscle is your metabolic currency. Structured progressive overload preserves lean mass, elevates resting metabolic rate, and reshapes body composition far beyond what cardio alone can achieve.",
    stat: "↑ RMR",
    statLabel: "resting metabolic rate",
  },
  {
    emoji: "🎯",
    color: "from-secondary/15 via-secondary/5 to-transparent",
    accent: "text-secondary",
    border: "border-secondary/25 hover:border-secondary/55",
    title: "Metabolic Nutrition",
    subtitle: "Precision fuelling",
    body: "Calories are not equal — macronutrient composition determines whether you lose fat or muscle. Evidence-based caloric periodisation and protein-first protocols fuel performance and accelerate recovery.",
    stat: "Macro-precise",
    statLabel: "caloric strategy",
  },
  {
    emoji: "⚡",
    color: "from-accent/15 via-accent/5 to-transparent",
    accent: "text-accent",
    border: "border-accent/25 hover:border-accent/55",
    title: "NEAT Optimisation",
    subtitle: "The silent multiplier",
    body: "Non-Exercise Activity Thermogenesis accounts for up to 30% of daily calorie expenditure. Systematically increasing everyday movement stacks an invisible second workout on top of your training.",
    stat: "Up to 30%",
    statLabel: "of daily calorie burn",
  },
];

// ── Intersection-observer animation hook ────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── Types ────────────────────────────────────────────────────────────────
type View = "home" | "browse" | "search";

interface HomePageProps {
  onNavigate: (view: View) => void;
  onSelect: (e: Exercise) => void;
}

// ── Stat Card ────────────────────────────────────────────────────────────
interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
  accent: string;
}

const STATS: StatItem[] = [
  {
    icon: Dumbbell,
    value: `${EXERCISES.length}+`,
    label: "Exercises",
    accent: "text-primary",
  },
  { icon: Layers, value: "8", label: "Categories", accent: "text-secondary" },
  { icon: BarChart3, value: "3", label: "Skill Levels", accent: "text-accent" },
  { icon: Users, value: "Free", label: "Always", accent: "text-primary" },
];

// ── Category colors mapped to ring/glow ─────────────────────────────────
const CATEGORY_GLOW: Record<string, string> = {
  "Upper Body": "hover:shadow-[0_0_24px_4px_rgba(56,189,248,0.18)]",
  "Lower Body": "hover:shadow-[0_0_24px_4px_rgba(167,139,250,0.18)]",
  Core: "hover:shadow-[0_0_24px_4px_rgba(251,146,60,0.18)]",
  Cardio: "hover:shadow-[0_0_24px_4px_rgba(249,115,22,0.18)]",
  Flexibility: "hover:shadow-[0_0_24px_4px_rgba(20,184,166,0.18)]",
  Strength: "hover:shadow-[0_0_24px_4px_rgba(245,158,11,0.18)]",
  Balance: "hover:shadow-[0_0_24px_4px_rgba(99,102,241,0.18)]",
  Mobility: "hover:shadow-[0_0_24px_4px_rgba(132,204,22,0.18)]",
};

// ── Featured exercise pick (6 different categories) ──────────────────────
const FEATURED_IDS = [
  "push-up",
  "squat",
  "plank",
  "burpees",
  "deadlift",
  "kettlebell-swing",
];

// ── HomePage ─────────────────────────────────────────────────────────────
export function HomePage({ onNavigate, onSelect }: HomePageProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const theoryReveal = useReveal();

  const featured = FEATURED_IDS.map((id) =>
    EXERCISES.find((e) => e.id === id),
  ).filter((e): e is Exercise => !!e);

  function scrollFeatured(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 340 : -340,
      behavior: "smooth",
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        {/* Full-bleed photo background — user's teal shirt photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/assets/images/hero-core-theory.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden
        />

        {/* Subtle dark overlay — 25% so the photo stays clearly visible */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.25)" }}
          aria-hidden
        />

        {/* Subtle color accent glow on top of the overlay */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px]" />
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
          {/* CORE Theory Library label — prominent display title */}
          <div className="mb-4" data-ocid="hero.core_theory_label">
            <span className="font-display font-black text-2xl sm:text-3xl tracking-[0.25em] uppercase text-white/60 drop-shadow-lg">
              CORE Theory Library
            </span>
          </div>

          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-white text-sm font-semibold mb-8 border border-primary/40 backdrop-blur-sm"
            data-ocid="hero.badge"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-primary" />
            <span>
              {EXERCISES.length}+ exercises with animated demonstrations
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] mb-6">
            <span className="text-white drop-shadow-lg">Your complete</span>
            <br />
            <span className="text-gradient drop-shadow-lg">
              fitness library.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow">
            Explore {EXERCISES.length}+ expertly curated exercises with
            step-by-step animated guides — from beginner stretches to advanced
            lifts. Always free.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => onNavigate("browse")}
              className="gap-2 font-bold text-base px-10 h-13 shadow-lg transition-smooth hover:scale-105"
              data-ocid="hero.browse_button"
            >
              <Dumbbell className="w-4 h-4" />
              Browse All Exercises
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate("search")}
              className="gap-2 font-semibold text-base px-8 h-13 transition-smooth hover:scale-105 border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
              data-ocid="hero.search_button"
            >
              <TrendingUp className="w-4 h-4" />
              Explore Categories
            </Button>
          </div>

          {/* Scroll hint */}
          <div className="mt-16 flex flex-col items-center gap-2 text-white/40 text-xs font-medium tracking-widest uppercase">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ── WHAT IS CORE THEORY? ──────────────────────────────── */}
      <section
        className="py-24 md:py-32 bg-background border-b border-border relative overflow-hidden"
        data-ocid="core_theory.section"
      >
        {/* Background accent blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/6 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative container mx-auto px-4">
          {/* Section header */}
          <div
            ref={theoryReveal.ref}
            className="text-center mb-16"
            style={{
              opacity: theoryReveal.visible ? 1 : 0,
              transform: theoryReveal.visible
                ? "translateY(0)"
                : "translateY(28px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
            }}
          >
            <Badge
              variant="outline"
              className="mb-4 text-xs font-semibold tracking-widest uppercase px-3 py-1 border-primary/40 text-primary"
            >
              The Methodology
            </Badge>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight mb-5">
              What is <span className="text-gradient">Core Theory?</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Core Theory is a science-first fitness methodology — not a workout
              programme, but a complete operating system for the human body.
              Three evidence-based pillars work in synergy to build lean muscle,
              eliminate fat, and sustain results without crash cycles or
              guesswork.
            </p>
          </div>

          {/* Pillar cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className={`group relative overflow-hidden rounded-2xl border bg-card p-7 flex flex-col gap-4 transition-smooth ${pillar.border}`}
                data-ocid={`core_theory.pillar.${i + 1}`}
                style={{
                  opacity: theoryReveal.visible ? 1 : 0,
                  transform: theoryReveal.visible
                    ? "translateY(0)"
                    : "translateY(36px)",
                  transition: `opacity 0.65s ease ${i * 0.15}s, transform 0.65s ease ${i * 0.15}s`,
                }}
              >
                {/* Top gradient fill */}
                <div
                  className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${pillar.color} opacity-60 pointer-events-none`}
                  aria-hidden
                />
                {/* Accent top stripe */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r ${
                    i === 0
                      ? "from-primary to-primary/30"
                      : i === 1
                        ? "from-secondary to-secondary/30"
                        : "from-accent to-accent/30"
                  }`}
                  aria-hidden
                />

                {/* Icon + subtitle row */}
                <div className="relative flex items-center gap-3 mt-2">
                  <span
                    className="text-4xl leading-none transition-smooth group-hover:scale-110 group-hover:-rotate-6 inline-block"
                    role="img"
                    aria-hidden
                  >
                    {pillar.emoji}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-widest ${pillar.accent} opacity-80`}
                  >
                    {pillar.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="relative font-display font-extrabold text-2xl text-foreground tracking-tight leading-tight">
                  {pillar.title}
                </h3>

                {/* Body */}
                <p className="relative text-muted-foreground text-sm leading-relaxed flex-1">
                  {pillar.body}
                </p>

                {/* Stat chip */}
                <div className="relative flex items-baseline gap-2 pt-2 border-t border-border/60">
                  <span
                    className={`font-display font-extrabold text-xl ${pillar.accent}`}
                  >
                    {pillar.stat}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {pillar.statLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA nudge */}
          <div
            className="mt-14 text-center"
            style={{
              opacity: theoryReveal.visible ? 1 : 0,
              transition: "opacity 0.65s ease 0.55s",
            }}
          >
            <Button
              size="lg"
              onClick={() => onNavigate("browse")}
              className="gap-2 font-bold px-10 transition-smooth hover:scale-105"
              data-ocid="core_theory.browse_button"
            >
              <Dumbbell className="w-4 h-4" />
              Apply the theory — browse exercises
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section
        className="bg-muted/40 border-b border-border py-10"
        data-ocid="stats.section"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, value, label, accent }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center gap-2"
                data-ocid={`stats.${label.toLowerCase()}_item`}
              >
                <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center mb-1 shadow-subtle">
                  <Icon className={`w-5 h-5 ${accent}`} />
                </div>
                <span className="font-display font-extrabold text-3xl text-foreground tracking-tight">
                  {value}
                </span>
                <span className="text-muted-foreground text-sm font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE FOUNDER ──────────────────────────────────── */}
      <section
        className="py-20 border-b border-border relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--background)) 60%, hsl(var(--card)) 100%)",
        }}
        data-ocid="founder.section"
      >
        {/* Decorative teal glow blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full bg-primary/8 blur-[90px]" />
          <div className="absolute bottom-[-40px] left-[-40px] w-[260px] h-[260px] rounded-full bg-secondary/6 blur-[80px]" />
        </div>

        <div className="relative container mx-auto px-4">
          {/* Section label */}
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-3 text-xs font-semibold tracking-widest uppercase px-3 py-1 border-primary/40 text-primary"
            >
              The Founder
            </Badge>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground tracking-tight">
              Meet the <span className="text-gradient">Founder</span>
            </h2>
          </div>

          {/* Card */}
          <div
            className="max-w-4xl mx-auto rounded-3xl border border-border bg-card/80 backdrop-blur-sm shadow-subtle overflow-hidden"
            data-ocid="founder.card"
          >
            {/* Top accent stripe */}
            <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent" />

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12">
              {/* Avatar */}
              <div
                className="shrink-0 flex flex-col items-center gap-4"
                data-ocid="founder.avatar"
              >
                <div className="relative">
                  {/* Glow ring */}
                  <div
                    className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-110"
                    aria-hidden
                  />
                  <img
                    src="/assets/images/founder-profile.jpg"
                    alt="Ritesh Bhandare — Founder of CORE Theory Library"
                    className="relative w-32 h-32 md:w-36 md:h-36 rounded-full object-cover object-top border-4 border-primary/40 shadow-lg"
                  />
                </div>
                {/* Free access badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-bold tracking-wide">
                  <Star className="w-3 h-3 fill-current" />
                  Founder — Free Access
                </span>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                {/* Quote icon */}
                <Quote
                  className="w-8 h-8 text-primary/30 mb-4 mx-auto md:mx-0"
                  aria-hidden
                />

                <h3
                  className="font-display font-extrabold text-3xl md:text-4xl text-foreground tracking-tight mb-1"
                  data-ocid="founder.name"
                >
                  Ritesh Bhandare
                </h3>
                <p
                  className="text-primary font-semibold text-sm tracking-wide uppercase mb-5"
                  data-ocid="founder.title"
                >
                  Founder &amp; Creator, CORE Theory Library
                </p>

                <p
                  className="text-muted-foreground leading-relaxed text-base mb-6 max-w-prose"
                  data-ocid="founder.bio"
                >
                  CORE Theory Library was built from a passion for fitness,
                  science, and making world-class exercise knowledge accessible
                  to everyone. Ritesh Bhandare created this platform to bridge
                  the gap between complex training theory and real-world results
                  — for beginners and advanced athletes alike. As founder, he is
                  committed to continuously growing this library and the CORE AI
                  to serve your fitness journey.
                </p>

                {/* Divider */}
                <div
                  className="w-16 h-px bg-gradient-to-r from-primary to-transparent mb-5 mx-auto md:mx-0"
                  aria-hidden
                />

                {/* Key stats row */}
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  {[
                    { value: `${EXERCISES.length}+`, label: "Exercises Built" },
                    { value: "8", label: "Categories" },
                    { value: "CORE AI", label: "Powered" },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center md:text-left">
                      <div className="font-display font-extrabold text-xl text-primary">
                        {value}
                      </div>
                      <div className="text-muted-foreground text-xs font-medium">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID ─────────────────────────────────────── */}
      <section className="py-24 bg-background" data-ocid="categories.section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 text-xs font-semibold tracking-widest uppercase px-3 py-1"
            >
              Browse by Type
            </Badge>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-4 tracking-tight">
              Find your focus
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
              Eight disciplines — every angle of physical fitness, covered.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
            {CATEGORIES.map((cat) => {
              const count = EXERCISES.filter(
                (e) => e.category === cat.name,
              ).length;
              const glow = CATEGORY_GLOW[cat.name] ?? "";
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => onNavigate("browse")}
                  data-ocid={`category.${cat.name.toLowerCase().replace(/\s/g, "_")}_button`}
                  className={`group relative overflow-hidden rounded-2xl p-5 md:p-6 text-left border border-border bg-gradient-to-br ${cat.color} bg-card hover:border-primary/40 hover:scale-[1.035] transition-smooth ${glow} cursor-pointer`}
                >
                  {/* Icon */}
                  <span className="text-4xl mb-4 block leading-none transition-smooth group-hover:scale-110 group-hover:-rotate-3 inline-block">
                    {cat.icon}
                  </span>

                  <h3 className="font-display font-bold text-foreground text-sm md:text-base leading-tight mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-snug line-clamp-2 mb-3">
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">
                      {count} exercises
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-smooth" />
                  </div>

                  {/* Corner glow on hover */}
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-primary/0 group-hover:bg-primary/8 blur-xl transition-smooth" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED EXERCISES ────────────────────────────────── */}
      <section
        className="py-24 bg-muted/20 border-t border-border"
        data-ocid="featured.section"
      >
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <Badge
                variant="outline"
                className="mb-4 text-xs font-semibold tracking-widest uppercase px-3 py-1"
              >
                Editor's Picks
              </Badge>
              <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground tracking-tight mb-2">
                Start here
              </h2>
              <p className="text-muted-foreground text-base">
                Six essential exercises that belong in every routine
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollFeatured("left")}
                aria-label="Scroll left"
                data-ocid="featured.scroll_left_button"
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:text-primary transition-smooth"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => scrollFeatured("right")}
                aria-label="Scroll right"
                data-ocid="featured.scroll_right_button"
                className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:border-primary/50 hover:text-primary transition-smooth"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("browse")}
                className="gap-1 ml-2"
                data-ocid="featured.view_all_button"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
            data-ocid="featured.list"
          >
            {featured.map((exercise, i) => (
              <div
                key={exercise.id}
                className="shrink-0 w-[300px] sm:w-[320px]"
                data-ocid={`featured.item.${i + 1}`}
              >
                <ExerciseCard
                  exercise={exercise}
                  index={i}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              onClick={() => onNavigate("browse")}
              className="gap-2"
              data-ocid="featured.mobile_view_all_button"
            >
              View all exercises <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── WHY SECTION ───────────────────────────────────────── */}
      <section
        className="py-24 bg-card border-t border-border"
        data-ocid="why.section"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mb-4">
              Everything you need to{" "}
              <span className="text-gradient">train smarter</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Built for athletes, beginners, and everyone in between.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: "🎬",
                title: "Animated demo for every exercise",
                body: "Watch clean looping animations so you can see exact form and movement before you train.",
              },
              {
                icon: "📊",
                title: "All skill levels",
                body: "Filter by Beginner, Intermediate, or Advanced. Progress at your own pace.",
              },
              {
                icon: "⚡",
                title: "Instant, free access",
                body: "No accounts, no paywalls. Open the app and start training.",
              },
            ].map((feat, i) => (
              <div
                key={feat.title}
                className="bg-muted/30 rounded-2xl p-6 border border-border hover:border-primary/30 transition-smooth"
                data-ocid={`why.feature.${i + 1}`}
              >
                <span className="text-3xl mb-4 block">{feat.icon}</span>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feat.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ─────────────────────────────────── */}
      <section
        className="py-20 bg-background border-t border-border relative overflow-hidden"
        data-ocid="cta.section"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-secondary mb-5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground mb-5 tracking-tight">
            Ready to level up?
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto mb-10 leading-relaxed">
            Browse {EXERCISES.length}+ exercises with step-by-step animated
            guides. Your next workout starts here.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("browse")}
            className="gap-2 font-bold text-base px-12 shadow-lg transition-smooth hover:scale-105"
            data-ocid="cta.browse_button"
          >
            <Flame className="w-4 h-4" />
            Start Browsing
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

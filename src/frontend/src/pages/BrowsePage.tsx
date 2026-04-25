import { ExerciseCard } from "@/components/ExerciseCard";
import { PremiumGate } from "@/components/PremiumGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIES, EXERCISES } from "@/data/exercises";
import { useAccessControl } from "@/hooks/useAccessControl";
import type { Category, Difficulty, Exercise, SortOption } from "@/types";
import {
  ChevronDown,
  Dumbbell,
  Filter,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ── Constants ────────────────────────────────────────────────────────────
const DIFFICULTIES: Array<Difficulty | "All"> = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
];

const EQUIPMENT_GROUPS: Array<{ label: string; values: string[] }> = [
  { label: "No Equipment", values: ["Bodyweight"] },
  { label: "Dumbbells", values: ["Dumbbells", "Dumbbell"] },
  { label: "Barbell", values: ["Barbell"] },
  { label: "Kettlebell", values: ["Kettlebell", "Kettlebells"] },
  { label: "Resistance Band", values: ["Resistance Band"] },
  { label: "Pull-up Bar", values: ["Pull-up Bar"] },
  { label: "Bench", values: ["Bench", "Parallel Bars", "Chair"] },
  { label: "Machine / Cable", values: ["Cable Machine", "Rowing Machine"] },
  {
    label: "Other",
    values: [
      "Ab Wheel",
      "Jump Rope",
      "Plyo Box",
      "BOSU Ball",
      "Yoga Mat",
      "Weight Plate",
      "Squat Rack",
    ],
  },
];

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
  { value: "difficulty-asc", label: "Easiest first" },
  { value: "difficulty-desc", label: "Hardest first" },
];

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  Beginner: 0,
  Intermediate: 1,
  Advanced: 2,
};

// ── URL param helpers ────────────────────────────────────────────────────
function getParams() {
  return new URLSearchParams(window.location.search);
}
function setParam(key: string, value: string) {
  const p = getParams();
  if (value && value !== "All" && value !== "") {
    p.set(key, value);
  } else {
    p.delete(key);
  }
  const newUrl = `${window.location.pathname}${p.toString() ? `?${p.toString()}` : ""}`;
  window.history.replaceState(null, "", newUrl);
}
function deleteParam(key: string) {
  const p = getParams();
  p.delete(key);
  const newUrl = `${window.location.pathname}${p.toString() ? `?${p.toString()}` : ""}`;
  window.history.replaceState(null, "", newUrl);
}

// ── Props ────────────────────────────────────────────────────────────────
interface BrowsePageProps {
  onSelect: (exercise: Exercise) => void;
  onUpgrade?: () => void;
}

// ── Locked exercise card wrapper ─────────────────────────────────────────
function LockedExerciseCard({
  exercise,
  index,
  onUpgrade,
  isPremium,
  isFounder,
  accessReady,
  forceFounderUnlock,
}: {
  exercise: Exercise;
  index: number;
  onUpgrade?: () => void;
  isPremium: boolean;
  isFounder: boolean | null;
  accessReady: boolean;
  forceFounderUnlock: boolean;
}) {
  // forceFounderUnlock is the permanent latch — highest priority
  if (forceFounderUnlock) {
    return (
      <ExerciseCard exercise={exercise} index={index} onSelect={() => {}} />
    );
  }
  // If access isn't ready or founder/premium: always render plain card
  if (!accessReady || isFounder === true || isPremium) {
    return (
      <ExerciseCard exercise={exercise} index={index} onSelect={() => {}} />
    );
  }

  return (
    <PremiumGate
      isPremium={isPremium}
      isFounder={isFounder}
      accessReady={accessReady}
      forceFounderUnlock={forceFounderUnlock}
      onUpgrade={onUpgrade ?? (() => {})}
      variant="card"
    >
      <ExerciseCard
        exercise={exercise}
        index={index}
        onSelect={() => {}} // locked — no navigation
      />
    </PremiumGate>
  );
}

// ── BrowsePage ───────────────────────────────────────────────────────────
export function BrowsePage({ onSelect, onUpgrade }: BrowsePageProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const {
    isPremium,
    isFounder,
    accessReady,
    forceFounderUnlock,
    isExerciseLocked,
  } = useAccessControl();

  // Read initial state from URL
  const init = useMemo((): {
    category: Category | "All";
    difficulty: Difficulty | "All";
    equipment: string;
    search: string;
    sort: SortOption;
  } => {
    const p = getParams();
    return {
      category: (p.get("category") as Category | null) ?? "All",
      difficulty: (p.get("difficulty") as Difficulty | null) ?? "All",
      equipment: p.get("equipment") ?? "All",
      search: p.get("search") ?? "",
      sort: (p.get("sort") as SortOption | null) ?? "az",
    };
  }, []);

  const [search, setSearch] = useState(init.search);
  const [activeCategory, setActiveCategory] = useState<Category | "All">(
    init.category,
  );
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty | "All">(
    init.difficulty,
  );
  const [activeEquipment, setActiveEquipment] = useState<string>(
    init.equipment,
  );
  const [sort, setSort] = useState<SortOption>(init.sort);
  const [showEquipmentPanel, setShowEquipmentPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);

  // Sync state → URL params
  useEffect(() => {
    setParam("category", activeCategory);
  }, [activeCategory]);
  useEffect(() => {
    setParam("difficulty", activeDifficulty);
  }, [activeDifficulty]);
  useEffect(() => {
    setParam("equipment", activeEquipment);
  }, [activeEquipment]);
  useEffect(() => {
    setParam("sort", sort);
  }, [sort]);
  useEffect(() => {
    if (search.trim()) {
      setParam("search", search.trim());
    } else {
      deleteParam("search");
    }
  }, [search]);

  // Derived: are any filters active?
  const hasActiveFilters =
    activeCategory !== "All" ||
    activeDifficulty !== "All" ||
    activeEquipment !== "All" ||
    search.trim() !== "";

  // Filter & sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = EXERCISES.filter((e) => {
      if (activeCategory !== "All" && e.category !== activeCategory)
        return false;
      if (activeDifficulty !== "All" && e.difficulty !== activeDifficulty)
        return false;
      if (activeEquipment !== "All") {
        const group = EQUIPMENT_GROUPS.find((g) => g.label === activeEquipment);
        if (group && !e.equipment.some((eq) => group.values.includes(eq)))
          return false;
      }
      if (q) {
        return (
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
          e.category.toLowerCase().includes(q) ||
          e.equipment.some((eq) => eq.toLowerCase().includes(q))
        );
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "za") return b.title.localeCompare(a.title);
      if (sort === "difficulty-asc")
        return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty];
      return DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty];
    });

    return list;
  }, [search, activeCategory, activeDifficulty, activeEquipment, sort]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setActiveCategory("All");
    setActiveDifficulty("All");
    setActiveEquipment("All");
    setSort("az");
    window.history.replaceState(null, "", window.location.pathname);
    searchRef.current?.focus();
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === sort)?.label ?? "A → Z";

  /**
   * accessReady is the single gate from useAccessControl.
   * Until accessReady, treat ALL exercises as unlocked.
   */

  // Count locked (advanced) exercises — only relevant for non-premium, non-founder users
  const lockedCount =
    accessReady && !isPremium && isFounder !== true
      ? filtered.filter((e) => e.difficulty === "Advanced").length
      : 0;

  return (
    /* Full-page background wrapper */
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/assets/images/bg-browse.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Strong dark overlay — 72% opacity */}
      <div
        className="absolute inset-0 pointer-events-none bg-black/70"
        aria-hidden
      />

      {/* All page content sits above overlay */}
      <div className="relative z-10">
        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="bg-black/30 border-b border-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-1 drop-shadow-lg">
                  Browse Exercises
                </h1>
                <p className="text-white/60">
                  {EXERCISES.length} exercises across 8 categories — filter,
                  search &amp; explore
                </p>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="gap-2 self-start sm:self-auto border-white/20 text-white hover:bg-white/10 bg-transparent"
                  data-ocid="browse.reset_filters_button"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset filters
                </Button>
              )}
            </div>

            {/* Search bar */}
            <div className="relative mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              <Input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, muscle group, equipment…"
                className="pl-12 pr-12 h-12 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-primary focus-visible:bg-white/15"
                data-ocid="browse.search_input"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Clear search"
                  data-ocid="browse.clear_search_button"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* ── Filter bar ─────────────────────────────────────────── */}
          <div
            className="bg-black/40 border border-white/10 backdrop-blur-sm rounded-xl p-5 mb-8 space-y-5"
            data-ocid="browse.filters_panel"
          >
            {/* Category pills */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                  Category
                </span>
              </div>
              <ScrollArea>
                <div className="flex flex-wrap gap-2 pb-1">
                  <button
                    type="button"
                    onClick={() => setActiveCategory("All")}
                    data-ocid="browse.category.all_tab"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                      activeCategory === "All"
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    All
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeCategory === "All" ? "bg-primary-foreground/20 text-primary-foreground" : "bg-white/10 text-white/60"}`}
                    >
                      {EXERCISES.length}
                    </span>
                  </button>
                  {CATEGORIES.map((cat) => {
                    const count = EXERCISES.filter(
                      (e) => e.category === cat.name,
                    ).length;
                    const isActive = activeCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() =>
                          setActiveCategory(isActive ? "All" : cat.name)
                        }
                        data-ocid={`browse.category.${cat.name.toLowerCase().replace(/\s/g, "_")}_tab`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                          isActive
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        {cat.name}
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-white/10 text-white/60"}`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Difficulty + Equipment + Sort row */}
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              {/* Difficulty */}
              <div className="flex-1 min-w-[200px]">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                  Difficulty
                </div>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((d) => {
                    const isActive = activeDifficulty === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() =>
                          setActiveDifficulty(
                            isActive && d !== "All" ? "All" : d,
                          )
                        }
                        data-ocid={`browse.difficulty.${d.toLowerCase()}_tab`}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-smooth ${
                          isActive
                            ? d === "Beginner"
                              ? "bg-[oklch(var(--chart-1)/0.15)] text-[oklch(var(--chart-1))] border-[oklch(var(--chart-1)/0.4)] shadow-sm"
                              : d === "Intermediate"
                                ? "bg-[oklch(var(--secondary)/0.2)] text-[oklch(var(--secondary))] border-[oklch(var(--secondary)/0.5)] shadow-sm"
                                : d === "Advanced"
                                  ? "bg-[oklch(var(--destructive)/0.15)] text-[oklch(var(--destructive))] border-[oklch(var(--destructive)/0.4)] shadow-sm"
                                  : "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/10"
                        }`}
                      >
                        {d === "All" ? (
                          "All"
                        ) : (
                          <DifficultyInline difficulty={d} active={isActive} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Equipment dropdown */}
              <div className="relative flex-1 min-w-[180px]">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                  Equipment
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowEquipmentPanel((p) => !p);
                    setShowSortPanel(false);
                  }}
                  data-ocid="browse.equipment.select"
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-smooth ${
                    activeEquipment !== "All"
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Dumbbell className="w-3.5 h-3.5 text-white/40" />
                    {activeEquipment === "All"
                      ? "All Equipment"
                      : activeEquipment}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${showEquipmentPanel ? "rotate-180" : ""}`}
                  />
                </button>
                {showEquipmentPanel && (
                  <div className="absolute top-full left-0 z-30 mt-1.5 w-56 bg-popover border border-border rounded-xl shadow-elevated overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEquipment("All");
                        setShowEquipmentPanel(false);
                      }}
                      data-ocid="browse.equipment.all_item"
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-muted/50 transition-colors ${activeEquipment === "All" ? "text-primary font-semibold bg-primary/5" : "text-foreground"}`}
                    >
                      All Equipment
                      {activeEquipment === "All" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </button>
                    <div className="h-px bg-border mx-3" />
                    {EQUIPMENT_GROUPS.map((g) => (
                      <button
                        key={g.label}
                        type="button"
                        onClick={() => {
                          setActiveEquipment(g.label);
                          setShowEquipmentPanel(false);
                        }}
                        data-ocid={`browse.equipment.${g.label.toLowerCase().replace(/[\s/]+/g, "_")}_item`}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-muted/50 transition-colors ${activeEquipment === g.label ? "text-primary font-semibold bg-primary/5" : "text-foreground"}`}
                      >
                        {g.label}
                        {activeEquipment === g.label && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="relative flex-1 min-w-[160px]">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                  Sort by
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowSortPanel((p) => !p);
                    setShowEquipmentPanel(false);
                  }}
                  data-ocid="browse.sort.select"
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-white/20 text-sm font-medium text-white hover:bg-white/10 transition-smooth"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
                    {currentSortLabel}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${showSortPanel ? "rotate-180" : ""}`}
                  />
                </button>
                {showSortPanel && (
                  <div className="absolute top-full left-0 z-30 mt-1.5 w-48 bg-popover border border-border rounded-xl shadow-elevated overflow-hidden">
                    {SORT_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => {
                          setSort(s.value);
                          setShowSortPanel(false);
                        }}
                        data-ocid={`browse.sort.${s.value}_toggle`}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-muted/50 transition-colors ${sort === s.value ? "text-primary font-semibold bg-primary/5" : "text-foreground"}`}
                      >
                        {s.label}
                        {sort === s.value && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
                <span className="text-xs text-white/50 font-medium">
                  Active:
                </span>
                {search.trim() && (
                  <ActiveChip
                    label={`"${search.trim()}"`}
                    onRemove={() => setSearch("")}
                    ocid="browse.chip.search_clear"
                  />
                )}
                {activeCategory !== "All" && (
                  <ActiveChip
                    label={activeCategory}
                    onRemove={() => setActiveCategory("All")}
                    ocid="browse.chip.category_clear"
                  />
                )}
                {activeDifficulty !== "All" && (
                  <ActiveChip
                    label={activeDifficulty}
                    onRemove={() => setActiveDifficulty("All")}
                    ocid="browse.chip.difficulty_clear"
                  />
                )}
                {activeEquipment !== "All" && (
                  <ActiveChip
                    label={activeEquipment}
                    onRemove={() => setActiveEquipment("All")}
                    ocid="browse.chip.equipment_clear"
                  />
                )}
              </div>
            )}
          </div>

          {/* ── Results count & premium notice ───────────────────────── */}
          <div
            className="flex items-center justify-between mb-6 flex-wrap gap-3"
            data-ocid="browse.results_count"
          >
            <p className="text-sm text-white/60">
              Showing{" "}
              <strong className="text-white font-semibold">
                {filtered.length}
              </strong>{" "}
              of{" "}
              <strong className="text-white font-semibold">
                {EXERCISES.length}
              </strong>{" "}
              exercise{EXERCISES.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              {lockedCount > 0 && (
                <button
                  type="button"
                  onClick={onUpgrade}
                  data-ocid="browse.premium_notice_button"
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  🔒 {lockedCount} advanced exercise
                  {lockedCount !== 1 ? "s" : ""} locked — Unlock Premium
                </button>
              )}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1 transition-colors"
                  data-ocid="browse.reset_filters_inline_button"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* ── Grid / Empty state ──────────────────────────────────── */}
          {filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} search={search} />
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-ocid="browse.exercises_list"
            >
              {filtered.map((exercise, i) => {
                /**
                 * Lock decision delegated entirely to useAccessControl.isExerciseLocked().
                 * That function returns false until accessReady=true, ensuring
                 * no lock UI ever flashes while founder status is loading.
                 */
                const isLocked = isExerciseLocked(exercise);

                return isLocked ? (
                  <div
                    key={exercise.id}
                    data-ocid={`browse.exercise.item.${i + 1}`}
                  >
                    <LockedExerciseCard
                      exercise={exercise}
                      index={i}
                      onUpgrade={onUpgrade}
                      isPremium={isPremium}
                      isFounder={isFounder}
                      accessReady={accessReady}
                      forceFounderUnlock={forceFounderUnlock}
                    />
                  </div>
                ) : (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    index={i}
                    onSelect={onSelect}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for dropdowns */}
      {(showEquipmentPanel || showSortPanel) && (
        <button
          type="button"
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowEquipmentPanel(false);
            setShowSortPanel(false);
          }}
          aria-label="Close dropdown"
          tabIndex={-1}
        />
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────

function DifficultyInline({
  difficulty,
  active,
}: {
  difficulty: Difficulty;
  active: boolean;
}) {
  if (active) return <span>{difficulty}</span>;
  return (
    <span
      style={{
        color:
          difficulty === "Beginner"
            ? "oklch(var(--chart-1))"
            : difficulty === "Intermediate"
              ? "oklch(var(--secondary))"
              : "oklch(var(--destructive))",
      }}
    >
      {difficulty}
    </span>
  );
}

function ActiveChip({
  label,
  onRemove,
  ocid,
}: {
  label: string;
  onRemove: () => void;
  ocid: string;
}) {
  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 px-2 py-1 text-xs font-medium cursor-pointer hover:bg-muted transition-colors"
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        data-ocid={ocid}
        className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </Badge>
  );
}

function EmptyState({
  onReset,
  search,
}: {
  onReset: () => void;
  search: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-28 text-center"
      data-ocid="browse.empty_state"
    >
      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
        <Dumbbell className="w-9 h-9 text-white/30" />
      </div>
      <h3 className="font-display font-bold text-2xl text-white mb-2">
        {search.trim()
          ? `No results for "${search.trim()}"`
          : "No exercises found"}
      </h3>
      <p className="text-white/60 mb-8 max-w-sm">
        {search.trim()
          ? "Try different keywords or clear your search to browse all exercises."
          : "None of our exercises match all the active filters. Try loosening your criteria."}
      </p>
      <Button
        onClick={onReset}
        variant="outline"
        className="gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
        data-ocid="browse.empty_state.reset_button"
      >
        <RotateCcw className="w-4 h-4" />
        Reset all filters
      </Button>
    </div>
  );
}

import { ExerciseCard } from "@/components/ExerciseCard";
import { Input } from "@/components/ui/input";
import { EXERCISES } from "@/data/exercises";
import type { Exercise } from "@/types";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface SearchPageProps {
  onSelect: (exercise: Exercise) => void;
}

export function SearchPage({ onSelect }: SearchPageProps) {
  const [query, setQuery] = useState(() => {
    return new URLSearchParams(window.location.search).get("q") ?? "";
  });

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (query.trim()) {
      p.set("q", query.trim());
    } else {
      p.delete("q");
    }
    const newUrl = `${window.location.pathname}${p.toString() ? `?${p.toString()}` : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [query]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return EXERCISES.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.muscleGroups.some((m) => m.toLowerCase().includes(q)) ||
        e.category.toLowerCase().includes(q) ||
        e.equipment.some((eq) => eq.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    /* Full-page background wrapper */
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/assets/images/bg-search.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Strong dark overlay — 72% opacity */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.72)" }}
        aria-hidden
      />

      {/* All page content sits above overlay */}
      <div className="relative z-10 container mx-auto px-4 py-10 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="font-display font-extrabold text-4xl text-white mb-3 drop-shadow-lg">
            Search Exercises
          </h1>
          <p className="text-white/60">
            Search by exercise name, muscle group, equipment, or category
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try 'push-up', 'hamstring', 'kettlebell'…"
            className="pl-12 pr-12 h-14 text-base rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-primary focus-visible:bg-white/15 backdrop-blur-sm"
            autoFocus
            data-ocid="search.search_input"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Clear search"
              data-ocid="search.clear_button"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim() === "" ? (
          <div
            className="text-center py-16 text-white/50"
            data-ocid="search.empty_state"
          >
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg text-white/60">
              Start typing to find exercises
            </p>
            <p className="text-sm mt-2 text-white/40">
              {EXERCISES.length} exercises available
            </p>
          </div>
        ) : results.length === 0 ? (
          <div
            className="text-center py-16"
            data-ocid="search.no_results_state"
          >
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No results for "{query}"
            </h3>
            <p className="text-white/60">
              Try different keywords like a muscle group or equipment type
            </p>
          </div>
        ) : (
          <div>
            <p
              className="text-sm text-white/50 mb-6"
              data-ocid="search.results_count"
            >
              <strong className="text-white">{results.length}</strong> result
              {results.length !== 1 ? "s" : ""} for "{query}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {results.map((exercise, i) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={i}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

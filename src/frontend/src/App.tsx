import { CoreAIChat } from "@/components/CoreAIChat";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/use-theme";
import { BrowsePage } from "@/pages/BrowsePage";
import { ExerciseDetailPage } from "@/pages/ExerciseDetailPage";
import { HomePage } from "@/pages/HomePage";
import { SearchPage } from "@/pages/SearchPage";
import type { Exercise } from "@/types";
import { useState } from "react";

export type View = "home" | "browse" | "search" | "detail";

const year = new Date().getFullYear();

function AppShell({
  children,
  onNavigate,
  currentView,
  onOpenAI,
  aiOpen,
}: {
  children: React.ReactNode;
  onNavigate: (view: "home" | "browse" | "search") => void;
  currentView: "home" | "browse" | "search";
  onOpenAI: () => void;
  aiOpen: boolean;
}) {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onNavigate={onNavigate}
        currentView={currentView}
        onOpenAI={onOpenAI}
        aiOpen={aiOpen}
      />
      <main className="flex-1">{children}</main>
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-foreground">
              CORE Theory Library
            </span>
            <span>— Your premium exercise reference</span>
          </div>
          <span>
            © {year}. Built with love using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  const handleSelectExercise = (exercise: Exercise) => {
    setDetailId(exercise.id);
    setView("detail");
  };

  const handleNavigate = (v: "home" | "browse" | "search") => {
    setView(v);
    setDetailId(null);
  };

  const handleToggleAI = () => setAiOpen((prev) => !prev);
  const handleCloseAI = () => setAiOpen(false);

  const shellCurrentView =
    view === "detail" ? "browse" : (view as "home" | "browse" | "search");

  return (
    <ThemeProvider>
      <AppShell
        onNavigate={handleNavigate}
        currentView={shellCurrentView}
        onOpenAI={handleToggleAI}
        aiOpen={aiOpen}
      >
        {view === "detail" && detailId ? (
          <ExerciseDetailPage
            exerciseId={detailId}
            onBack={() => handleNavigate("browse")}
            onSelect={handleSelectExercise}
          />
        ) : null}
        {view === "home" && (
          <HomePage
            onNavigate={handleNavigate}
            onSelect={handleSelectExercise}
          />
        )}
        {view === "browse" && <BrowsePage onSelect={handleSelectExercise} />}
        {view === "search" && <SearchPage onSelect={handleSelectExercise} />}
      </AppShell>

      {/* CORE AI Chat Panel */}
      <CoreAIChat isOpen={aiOpen} onClose={handleCloseAI} />

      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}

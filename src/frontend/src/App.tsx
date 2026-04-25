import { CoreAIChat } from "@/components/CoreAIChat";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/use-theme";
import { useAccessControl } from "@/hooks/useAccessControl";
import { ArticleDetailPage } from "@/pages/ArticleDetailPage";
import { ArticlesPage } from "@/pages/ArticlesPage";
import { AuthPage } from "@/pages/AuthPage";
import { BrowsePage } from "@/pages/BrowsePage";
import { DisabledDashboardPage } from "@/pages/DisabledDashboardPage";
import { ExerciseDetailPage } from "@/pages/ExerciseDetailPage";
import { FounderDashboardPage } from "@/pages/FounderDashboardPage";
import { HomePage } from "@/pages/HomePage";
import { MetricsPage } from "@/pages/MetricsPage";
import { PricingPage } from "@/pages/PricingPage";
import { SearchPage } from "@/pages/SearchPage";
import { TdeePage } from "@/pages/TdeePage";
import { WomenDashboardPage } from "@/pages/WomenDashboardPage";
import type { Exercise } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useEffect, useState } from "react";

export type View =
  | "home"
  | "browse"
  | "search"
  | "detail"
  | "pricing"
  | "auth"
  | "founder-dashboard"
  | "disabled-dashboard"
  | "women-dashboard"
  | "metrics"
  | "tdee"
  | "articles"
  | "article-detail";

const year = new Date().getFullYear();

type NavView = Exclude<View, "detail">;

function AppShell({
  children,
  onNavigate,
  currentView,
  onOpenAI,
  aiOpen,
  onUpgrade,
}: {
  children: React.ReactNode;
  onNavigate: (view: NavView) => void;
  currentView: NavView;
  onOpenAI: () => void;
  aiOpen: boolean;
  onUpgrade: () => void;
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
        onUpgrade={onUpgrade}
      />
      <main className="flex-1">{children}</main>
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-foreground">
              CORE Theory
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

// ── Authenticated app shell ───────────────────────────────────────────────

function AuthenticatedApp() {
  const [view, setView] = useState<View>("home");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<bigint | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  const {
    isLoggedIn,
    isFounder,
    isDisabledVerified,
    loading,
    accessReady,
    forceFounderUnlock,
    canAccessWomenDashboard,
    canAccessDisabledDashboard,
  } = useAccessControl();

  // One-time post-login redirect based on user type — only after full access resolution
  useEffect(() => {
    if (!isLoggedIn || loading || !accessReady || hasRedirected) return;
    setHasRedirected(true);
    // Only auto-redirect to special dashboards from the home view
    // to avoid disrupting the user if they navigated elsewhere
    if (view === "home") {
      if (isDisabledVerified) {
        setView("disabled-dashboard");
      } else if (isFounder === true) {
        setView("founder-dashboard");
      }
    }
    // premium and free users stay on their current view
  }, [
    isLoggedIn,
    loading,
    accessReady,
    isFounder,
    isDisabledVerified,
    hasRedirected,
    view,
  ]);

  const handleSelectExercise = (exercise: Exercise) => {
    setDetailId(exercise.id);
    setView("detail");
  };

  const handleNavigate = (v: NavView) => {
    setView(v);
    setDetailId(null);
    setArticleId(null);
  };

  const handleSelectArticle = (id: bigint) => {
    setArticleId(id);
    setView("article-detail");
  };

  const [aiPrefilledPrompt, setAiPrefilledPrompt] = useState<string | null>(
    null,
  );

  const handleToggleAI = () => setAiOpen((prev) => !prev);
  const handleCloseAI = () => setAiOpen(false);
  const handleOpenAIWithPrompt = (prompt: string) => {
    setAiPrefilledPrompt(prompt);
    setAiOpen(true);
  };

  const shellCurrentView: NavView =
    view === "detail"
      ? "browse"
      : view === "article-detail"
        ? "articles"
        : (view as NavView);

  // Route guards — ordered by priority:
  // 1. forceFounderUnlock === true → bypass ALL guards permanently (highest priority)
  // 2. Founder confirmed (isFounder===true) → bypass ALL guards
  // 3. isFounder === null (still resolving) → NEVER redirect, pass through
  // 4. Access not yet ready → pass view through (never redirect during loading)
  // 5. Access resolved and not founder → apply specific dashboard guards
  const effectiveView: View = (() => {
    if (forceFounderUnlock) return view; // permanent founder latch — no guards at all
    if (isFounder === true) return view; // confirmed founder → bypass all guards
    if (isFounder === null) return view; // founder status unknown → never redirect
    if (!accessReady) return view; // still loading → wait, never redirect
    if (view === "disabled-dashboard" && !canAccessDisabledDashboard())
      return "home";
    if (view === "women-dashboard" && !canAccessWomenDashboard()) return "home";
    return view;
  })();

  return (
    <AppShell
      onNavigate={handleNavigate}
      currentView={shellCurrentView}
      onOpenAI={handleToggleAI}
      aiOpen={aiOpen}
      onUpgrade={() => handleNavigate("pricing")}
    >
      {effectiveView === "detail" && detailId ? (
        <ExerciseDetailPage
          exerciseId={detailId}
          onBack={() => handleNavigate("browse")}
          onSelect={handleSelectExercise}
          onUpgrade={() => handleNavigate("pricing")}
        />
      ) : null}
      {effectiveView === "home" && (
        <HomePage onNavigate={handleNavigate} onSelect={handleSelectExercise} />
      )}
      {effectiveView === "browse" && (
        <BrowsePage
          onSelect={handleSelectExercise}
          onUpgrade={() => handleNavigate("pricing")}
        />
      )}
      {effectiveView === "search" && (
        <SearchPage onSelect={handleSelectExercise} />
      )}
      {effectiveView === "pricing" && <PricingPage />}
      {effectiveView === "auth" && <AuthPage onNavigate={handleNavigate} />}
      {effectiveView === "founder-dashboard" && (
        <FounderDashboardPage onRedirect={() => handleNavigate("home")} />
      )}
      {effectiveView === "disabled-dashboard" && (
        <DisabledDashboardPage onNavigate={handleNavigate} />
      )}
      {effectiveView === "women-dashboard" && (
        <WomenDashboardPage onNavigate={handleNavigate} />
      )}
      {effectiveView === "metrics" && <MetricsPage />}
      {effectiveView === "tdee" && <TdeePage />}
      {effectiveView === "articles" && (
        <ArticlesPage onSelectArticle={handleSelectArticle} />
      )}
      {effectiveView === "article-detail" && articleId !== null && (
        <ArticleDetailPage
          articleId={articleId}
          onBack={() => handleNavigate("articles")}
          onSelectArticle={handleSelectArticle}
          onOpenAI={handleOpenAIWithPrompt}
        />
      )}

      <CoreAIChat
        isOpen={aiOpen}
        onClose={handleCloseAI}
        onUpgrade={() => handleNavigate("pricing")}
        prefilledPrompt={aiPrefilledPrompt}
        onPrefilledConsumed={() => setAiPrefilledPrompt(null)}
      />
    </AppShell>
  );
}

// ── App root ──────────────────────────────────────────────────────────────

export default function App() {
  const { loginStatus, identity } = useInternetIdentity();

  const isAuthenticated =
    loginStatus === "success" && identity !== null && identity !== undefined;
  const isInitializing =
    loginStatus === "initializing" || loginStatus === "logging-in";

  return (
    <ThemeProvider>
      {isInitializing ? (
        // Loading while identity resolves
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading CORE Theory…</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        // Unauthenticated — show auth page only, no other routes accessible
        <div className="min-h-screen bg-background">
          <div className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle h-16 flex items-center px-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-primary-foreground"
                  aria-hidden="true"
                >
                  <path d="M6 4v16M18 4v16M6 12h12M4 6.5h4M4 17.5h4M16 6.5h4M16 17.5h4" />
                </svg>
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-gradient">
                CORE Theory
              </span>
            </div>
          </div>
          <AuthPage
            onNavigate={() => {
              /* Cannot navigate away until authenticated */
            }}
          />
        </div>
      ) : (
        <AuthenticatedApp />
      )}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}

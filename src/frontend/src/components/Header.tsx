import type { View } from "@/App";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAccessControl } from "@/hooks/useAccessControl";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Accessibility,
  Activity,
  BookOpen,
  Brain,
  Calculator,
  Crown,
  Dumbbell,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

type NavView = Exclude<View, "detail">;

interface HeaderProps {
  onNavigate: (view: NavView) => void;
  currentView: NavView;
  onOpenAI: () => void;
  aiOpen: boolean;
  onUpgrade?: () => void;
}

const NAV_LINKS = [
  { id: "home" as const, label: "Home" },
  { id: "browse" as const, label: "Browse" },
  { id: "search" as const, label: "Search" },
  { id: "pricing" as const, label: "Pricing" },
];

export function Header({
  onNavigate,
  currentView,
  onOpenAI,
  aiOpen,
  onUpgrade,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { clear, loginStatus } = useInternetIdentity();
  const {
    isPremium,
    isFree,
    isLoggedIn,
    loading,
    isFounder,
    isDisabledVerified,
    accessReady,
    forceFounderUnlock,
  } = useAccessControl();

  const handleNav = (view: NavView) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  const handleLogin = () => {
    onNavigate("auth");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    clear();
  };

  const isAuthLoading = loginStatus === "logging-in" || loading;

  /**
   * Navigation link visibility rules — priority order:
   *
   * 1. forceFounderUnlock === true (permanent latch) → ALWAYS show ALL dashboards.
   *    This is the highest-priority gate. Once the founder is confirmed, this
   *    never reverts — even across re-renders or profile refetch failures.
   *
   * 2. FOUNDER CHECK: isFounder === true → ALWAYS show all special dashboards.
   *
   * 3. NULL (LOADING) STATE: isFounder === null means founder status is still
   *    being resolved. NEVER hide links while null — treat null as "show".
   *
   * 4. Not ready: !accessReady → NEVER hide links while still loading.
   *
   * 5. SPECIFIC USER CONDITIONS (post-load, isFounder === false only):
   *    - Founder Dashboard: isFounder must be true or loading
   *    - Disabled: only isDisabledVerified users
   *    - Women's: only isPremium users
   */
  const showFounderDashboard =
    isLoggedIn &&
    (forceFounderUnlock ||
      isFounder === true ||
      isFounder === null ||
      !accessReady);

  // Disabled dashboard: show if founder (any state), OR loading, OR user is verified
  const showDisabledDashboard =
    isLoggedIn &&
    (forceFounderUnlock ||
      isFounder === true ||
      isFounder === null ||
      !accessReady ||
      isDisabledVerified);

  // Women's dashboard: show if founder (any state), OR loading, OR user is premium
  const showWomensDashboard =
    isLoggedIn &&
    (forceFounderUnlock ||
      isFounder === true ||
      isFounder === null ||
      !accessReady ||
      isPremium);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNav("home")}
          className="flex items-center gap-2 group"
          data-ocid="nav.logo"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-subtle group-hover:shadow-elevated transition-smooth">
            <Dumbbell className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-gradient">
            CORE Theory Library
          </span>
        </button>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNav(link.id)}
              data-ocid={`nav.${link.id}_link`}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth ${
                currentView === link.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Auth-gated feature links — visible to all logged-in users */}
          {isLoggedIn && (
            <>
              <button
                type="button"
                onClick={() => handleNav("metrics")}
                data-ocid="nav.metrics_link"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1.5 ${
                  currentView === "metrics"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Progress
              </button>
              <button
                type="button"
                onClick={() => handleNav("tdee")}
                data-ocid="nav.tdee_link"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1.5 ${
                  currentView === "tdee"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                TDEE
              </button>
              <button
                type="button"
                onClick={() => handleNav("articles")}
                data-ocid="nav.articles_link"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1.5 ${
                  currentView === "articles" || currentView === "article-detail"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Articles
              </button>
            </>
          )}

          {/* Founder Dashboard link — visible to founder (or while loading for logged-in users) */}
          {showFounderDashboard && (
            <button
              type="button"
              onClick={() => handleNav("founder-dashboard")}
              data-ocid="nav.founder_dashboard_link"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1.5 ${
                currentView === "founder-dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>
          )}

          {/* Disability Dashboard link */}
          {showDisabledDashboard && (
            <button
              type="button"
              onClick={() => handleNav("disabled-dashboard")}
              data-ocid="nav.disabled_dashboard_link"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1.5 ${
                currentView === "disabled-dashboard"
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              {isFounder && !isDisabledVerified ? "Disability" : "My Dashboard"}
            </button>
          )}

          {/* Women's Dashboard link */}
          {showWomensDashboard && (
            <button
              type="button"
              onClick={() => handleNav("women-dashboard")}
              data-ocid="nav.women_dashboard_link"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-smooth flex items-center gap-1.5 ${
                currentView === "women-dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              Women's
            </button>
          )}

          {/* Premium badge in nav */}
          {isLoggedIn && isPremium && (
            <Badge
              variant="secondary"
              className="ml-1 gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
              data-ocid="nav.premium_badge"
            >
              <Crown className="w-3 h-3" />
              {isFounder ? "Founder" : "Premium"}
            </Badge>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* CORE AI Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenAI}
            aria-label="Open CORE AI chat"
            aria-expanded={aiOpen}
            data-ocid="nav.open_ai_button"
            className={`gap-1.5 font-semibold transition-smooth ${
              aiOpen
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            }`}
          >
            <Brain className={`w-4 h-4 ${aiOpen ? "text-primary" : ""}`} />
            <span className="hidden sm:inline text-sm">CORE AI</span>
          </Button>

          {/* Upgrade button — free logged-in users only, never shown to founder */}
          {isLoggedIn &&
            isFree &&
            !isFounder &&
            !forceFounderUnlock &&
            onUpgrade && (
              <Button
                size="sm"
                onClick={onUpgrade}
                data-ocid="nav.upgrade_button"
                className="gap-1.5 hidden sm:flex bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-subtle"
              >
                <Crown className="w-3.5 h-3.5" />
                Upgrade
              </Button>
            )}

          {/* Auth button */}
          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isAuthLoading}
              data-ocid="nav.logout_button"
              aria-label="Log out"
              className="gap-1.5 text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Log out</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogin}
              disabled={isAuthLoading}
              data-ocid="nav.login_button"
              className="gap-1.5 hidden sm:flex border-primary/40 text-primary hover:bg-primary/10 font-semibold"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm">
                {isAuthLoading ? "Connecting…" : "Log in"}
              </span>
            </Button>
          )}

          <ThemeToggle />

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            data-ocid="nav.mobile_menu_toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-up">
          <nav
            className="container mx-auto px-4 py-3 space-y-1"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNav(link.id)}
                data-ocid={`nav.mobile_${link.id}_link`}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-smooth ${
                  currentView === link.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Auth-gated feature links — visible to all logged-in users */}
            {isLoggedIn && (
              <>
                <button
                  type="button"
                  onClick={() => handleNav("metrics")}
                  data-ocid="nav.mobile_metrics_link"
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-smooth flex items-center gap-2 ${
                    currentView === "metrics"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleNav("tdee")}
                  data-ocid="nav.mobile_tdee_link"
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-smooth flex items-center gap-2 ${
                    currentView === "tdee"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  TDEE Calculator
                </button>
                <button
                  type="button"
                  onClick={() => handleNav("articles")}
                  data-ocid="nav.mobile_articles_link"
                  className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-smooth flex items-center gap-2 ${
                    currentView === "articles" ||
                    currentView === "article-detail"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Science Articles
                </button>
              </>
            )}

            {/* Founder Dashboard mobile link */}
            {showFounderDashboard && (
              <button
                type="button"
                onClick={() => handleNav("founder-dashboard")}
                data-ocid="nav.mobile_founder_dashboard_link"
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-smooth flex items-center gap-2 ${
                  currentView === "founder-dashboard"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Founder Dashboard
              </button>
            )}

            {/* Disability Dashboard mobile link */}
            {showDisabledDashboard && (
              <button
                type="button"
                onClick={() => handleNav("disabled-dashboard")}
                data-ocid="nav.mobile_disabled_dashboard_link"
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-smooth flex items-center gap-2 ${
                  currentView === "disabled-dashboard"
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Accessibility className="w-4 h-4" />
                {isFounder && !isDisabledVerified
                  ? "Disability Dashboard"
                  : "My Dashboard"}
              </button>
            )}

            {/* Women's Dashboard mobile link */}
            {showWomensDashboard && (
              <button
                type="button"
                onClick={() => handleNav("women-dashboard")}
                data-ocid="nav.mobile_women_dashboard_link"
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-smooth flex items-center gap-2 ${
                  currentView === "women-dashboard"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Crown className="w-4 h-4" />
                Women's Dashboard
              </button>
            )}

            {/* Mobile auth actions */}
            <div className="pt-2 border-t border-border space-y-1">
              {isLoggedIn ? (
                <>
                  {isFree && !isFounder && !forceFounderUnlock && onUpgrade && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpgrade();
                        setMobileOpen(false);
                      }}
                      data-ocid="nav.mobile_upgrade_button"
                      className="w-full text-left px-4 py-3 rounded-md text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-smooth flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade to Premium
                    </button>
                  )}
                  {isPremium && (
                    <div className="px-4 py-2 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-semibold">
                      <Crown className="w-4 h-4" />
                      {isFounder ? "Founder Access" : "Premium Member"}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.mobile_logout_button"
                    className="w-full text-left px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleLogin();
                    setMobileOpen(false);
                  }}
                  data-ocid="nav.mobile_login_button"
                  className="w-full text-left px-4 py-3 rounded-md text-sm font-semibold text-primary hover:bg-primary/10 transition-smooth flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Log in with Internet Identity
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

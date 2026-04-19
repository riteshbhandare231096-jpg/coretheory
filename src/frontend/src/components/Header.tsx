import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Brain, Dumbbell, Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onNavigate: (view: "home" | "browse" | "search") => void;
  currentView: "home" | "browse" | "search";
  onOpenAI: () => void;
  aiOpen: boolean;
}

const NAV_LINKS = [
  { id: "home" as const, label: "Home" },
  { id: "browse" as const, label: "Browse" },
  { id: "search" as const, label: "Search" },
];

export function Header({
  onNavigate,
  currentView,
  onOpenAI,
  aiOpen,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (view: "home" | "browse" | "search") => {
    onNavigate(view);
    setMobileOpen(false);
  };

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
          </nav>
        </div>
      )}
    </header>
  );
}

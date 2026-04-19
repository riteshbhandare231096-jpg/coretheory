import { Header } from "@/components/Header";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  onNavigate: (view: "home" | "browse" | "search") => void;
  currentView: "home" | "browse" | "search";
  onOpenAI?: () => void;
  aiOpen?: boolean;
}

const year = new Date().getFullYear();

export function Layout({
  children,
  onNavigate,
  currentView,
  onOpenAI = () => {},
  aiOpen = false,
}: LayoutProps) {
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

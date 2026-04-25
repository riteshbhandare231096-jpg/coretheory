import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticles } from "@/hooks/useArticles";
import type { ArticleCategory } from "@/types";
import { BookOpen, ChevronRight, Clock, FlaskConical } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  hypertrophy: "Hypertrophy",
  "fat-loss": "Fat Loss",
  nutrition: "Nutrition",
  recovery: "Recovery",
};

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  hypertrophy: "bg-primary/10 text-primary border-primary/25",
  "fat-loss": "bg-destructive/10 text-destructive border-destructive/25",
  nutrition: "bg-accent/10 text-accent-foreground border-accent/25",
  recovery: "bg-secondary/15 text-secondary-foreground border-secondary/25",
};

const CATEGORY_ACCENT: Record<ArticleCategory, string> = {
  hypertrophy: "border-l-primary",
  "fat-loss": "border-l-destructive",
  nutrition: "border-l-accent",
  recovery: "border-l-secondary",
};

const FILTERS: Array<{ label: string; value: ArticleCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Hypertrophy", value: "hypertrophy" },
  { label: "Fat Loss", value: "fat-loss" },
  { label: "Nutrition", value: "nutrition" },
  { label: "Recovery", value: "recovery" },
];

interface ArticlesPageProps {
  onSelectArticle: (id: bigint) => void;
}

export function ArticlesPage({ onSelectArticle }: ArticlesPageProps) {
  const { articles, loading } = useArticles();
  const [filter, setFilter] = useState<ArticleCategory | "all">("all");

  const filtered =
    filter === "all" ? articles : articles.filter((a) => a.category === filter);

  return (
    <div className="min-h-screen bg-background">
      {/* Page hero */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-0.5">
                  Science Library
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                  Evidence-Based Articles
                </h1>
              </div>
            </div>
            <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
              Peer-reviewed research distilled into practical, actionable
              insights on hypertrophy, fat loss, nutrition, and recovery.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters + grid */}
      <div className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter articles by category"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              data-ocid={`articles.filter_${f.value}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-smooth ${
                filter === f.value
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-60 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            data-ocid="articles.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 opacity-40" />
            </div>
            <p className="font-semibold text-foreground text-lg">
              No articles yet
            </p>
            <p className="text-sm mt-1 max-w-xs text-center">
              Science-based content is being added regularly. Check back soon.
            </p>
            {filter !== "all" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-4 text-sm font-medium text-primary hover:underline"
                data-ocid="articles.clear_filter_button"
              >
                Clear filter
              </button>
            )}
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="articles.list"
          >
            {filtered.map((article, i) => (
              <motion.div
                key={article.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
              >
                <Card
                  className={`article-card h-full border-l-4 ${CATEGORY_ACCENT[article.category]} group`}
                  onClick={() => onSelectArticle(article.id)}
                  data-ocid={`articles.item.${i + 1}`}
                >
                  <CardContent className="pt-6 pb-5 flex flex-col gap-3 h-full">
                    {/* Meta row */}
                    <div className="flex items-center justify-between gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs font-semibold ${CATEGORY_COLORS[article.category]}`}
                      >
                        {CATEGORY_LABELS[article.category]}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Clock className="w-3 h-3" />
                        {Number(article.readingMinutes)} min read
                      </div>
                    </div>

                    {/* Title + summary */}
                    <div className="flex-1 flex flex-col gap-2">
                      <h2 className="font-display font-bold text-foreground text-base leading-snug group-hover:text-primary transition-smooth line-clamp-2">
                        {article.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <span className="text-xs text-muted-foreground">
                        {article.publishedDate}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-primary text-xs font-semibold px-2 h-7 group-hover:bg-primary/10 transition-smooth"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        Read more
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

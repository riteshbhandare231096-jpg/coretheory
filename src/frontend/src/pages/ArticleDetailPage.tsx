import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArticle, useArticles } from "@/hooks/useArticles";
import type { ArticleCategory, ScienceArticle } from "@/types";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  ChevronRight,
  Clock,
  FlaskConical,
} from "lucide-react";
import { motion } from "motion/react";

// ── Shared category config ─────────────────────────────────────────────────

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

// ── Content renderer ───────────────────────────────────────────────────────

function ArticleBody({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-5" data-ocid="article.content">
      {blocks.map((block, i) => {
        const blockKey = `block-${i}`;
        const headingMatch = block.match(/^#{1,3}\s+(.+)$/m);

        if (headingMatch) {
          return (
            <h2
              key={blockKey}
              className="font-display text-xl font-bold text-foreground mt-8 mb-1 leading-snug"
            >
              {headingMatch[1]}
            </h2>
          );
        }

        const isList =
          block.trim().startsWith("- ") || block.trim().startsWith("• ");
        if (isList) {
          const items = block
            .split("\n")
            .filter(
              (l) => l.trim().startsWith("-") || l.trim().startsWith("•"),
            );
          return (
            <ul
              key={blockKey}
              className="list-disc list-inside space-y-2 text-foreground/85 pl-1"
            >
              {items.map((item) => (
                <li
                  key={`${blockKey}-${item.slice(0, 30)}`}
                  className="text-base leading-relaxed"
                >
                  {item.replace(/^[-•]\s*/, "")}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={blockKey}
            className="text-base text-foreground/85 leading-[1.85]"
          >
            {block}
          </p>
        );
      })}
    </div>
  );
}

// ── Related article card ───────────────────────────────────────────────────

function RelatedCard({
  article,
  onClick,
  index,
}: {
  article: ScienceArticle;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Card
        className="bg-card border-border hover:shadow-elevated hover:scale-[1.015] transition-smooth cursor-pointer group"
        onClick={onClick}
        data-ocid={`article.related.item.${index + 1}`}
      >
        <CardContent className="pt-5 pb-4 flex flex-col gap-2">
          <Badge
            variant="secondary"
            className={`text-xs font-semibold w-fit ${CATEGORY_COLORS[article.category]}`}
          >
            {CATEGORY_LABELS[article.category]}
          </Badge>
          <h3 className="font-display font-bold text-sm text-foreground leading-snug group-hover:text-primary transition-smooth line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {Number(article.readingMinutes)} min
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-smooth" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────

function ArticleDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
      <Skeleton className="h-8 w-32 rounded-lg" />
      <div className="space-y-3">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-12 w-4/5 rounded-lg" />
        <Skeleton className="h-5 w-1/3 rounded" />
      </div>
      <Skeleton className="h-24 rounded-xl" />
      <div className="space-y-3 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton
            key={i}
            className={`h-4 rounded ${i % 4 === 0 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

interface ArticleDetailPageProps {
  articleId: bigint;
  onBack: () => void;
  onSelectArticle?: (id: bigint) => void;
  onOpenAI?: (prompt: string) => void;
}

export function ArticleDetailPage({
  articleId,
  onBack,
  onSelectArticle,
  onOpenAI,
}: ArticleDetailPageProps) {
  const { data: article, isLoading } = useArticle(articleId);
  const { articles } = useArticles();

  if (isLoading) return <ArticleDetailSkeleton />;

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-3xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-muted-foreground opacity-40" />
        </div>
        <p className="font-semibold text-foreground text-lg">
          Article not found
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          It may have been removed or the link is incorrect.
        </p>
        <Button
          variant="outline"
          onClick={onBack}
          className="mt-6 gap-2"
          data-ocid="article.back_button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Button>
      </div>
    );
  }

  const related = articles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const aiPrompt = `Tell me more about "${article.title}" — specifically the science behind ${CATEGORY_LABELS[article.category].toLowerCase()} and how I can apply it to my training.`;

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav strip */}
      <div className="bg-card border-b border-border sticky top-16 z-10">
        <div className="container mx-auto px-4 py-3 max-w-3xl flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
            data-ocid="article.back_button"
          >
            <ArrowLeft className="w-4 h-4" />
            All Articles
          </Button>
          {onOpenAI && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenAI(aiPrompt)}
              className="gap-2 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 transition-smooth"
              data-ocid="article.ask_ai_button"
            >
              <Bot className="w-3.5 h-3.5" />
              Ask CORE AI
            </Button>
          )}
        </div>
      </div>

      {/* Article */}
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Article header */}
          <div className="space-y-4" data-ocid="article.header">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FlaskConical className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary font-semibold uppercase tracking-wider text-[11px]">
                  Science Library
                </span>
              </div>
              <span className="text-muted-foreground/40">·</span>
              <Badge
                variant="secondary"
                className={`text-xs font-semibold ${CATEGORY_COLORS[article.category]}`}
              >
                {CATEGORY_LABELS[article.category]}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {Number(article.readingMinutes)} min read
              </div>
              <span className="text-xs text-muted-foreground">
                {article.publishedDate}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
              {article.title}
            </h1>

            <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground text-lg leading-relaxed">
              {article.summary}
            </blockquote>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Article body */}
          <ArticleBody content={article.content} />

          {/* AI synergy banner */}
          {onOpenAI && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    Want to go deeper?
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Ask CORE AI to personalise this research to your training
                    goals, diet, and schedule.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => onOpenAI(aiPrompt)}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shrink-0 font-semibold"
                data-ocid="article.ask_ai_banner_button"
              >
                <Bot className="w-3.5 h-3.5" />
                Ask CORE AI
              </Button>
            </motion.div>
          )}

          {/* Footer nav */}
          <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2"
              data-ocid="article.back_to_list_button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Button>
            <p className="text-xs text-muted-foreground">
              Evidence-based content by CORE Theory
            </p>
          </div>
        </motion.div>

        {/* Related articles */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 space-y-4"
            data-ocid="article.related_section"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-display font-bold text-foreground text-base">
                More in {CATEGORY_LABELS[article.category]}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel, i) => (
                <RelatedCard
                  key={rel.id.toString()}
                  article={rel}
                  onClick={() =>
                    onSelectArticle ? onSelectArticle(rel.id) : onBack()
                  }
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

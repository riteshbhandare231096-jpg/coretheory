import { createActor } from "@/backend";
import type { ArticleCategory, ScienceArticle } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

// Map backend ArticleCategory enum strings to our frontend union type
function mapCategory(raw: string): ArticleCategory {
  const map: Record<string, ArticleCategory> = {
    hypertrophy: "hypertrophy",
    fatLoss: "fat-loss",
    nutrition: "nutrition",
    recovery: "recovery",
  };
  return map[raw] ?? "hypertrophy";
}

// ── useArticles ───────────────────────────────────────────────────────────────

export function useArticles() {
  const { actor, isFetching } = useActor(createActor);

  const articlesQuery = useQuery<ScienceArticle[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getArticles();
      return raw.map((a) => ({
        id: a.id,
        title: a.title,
        category: mapCategory(String(a.category)),
        summary: a.summary,
        content: a.content,
        readingMinutes: a.readingMinutes,
        publishedDate: a.publishedDate,
      }));
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000, // articles are relatively static
  });

  const getArticleById = useCallback(
    (id: bigint): ScienceArticle | undefined => {
      return articlesQuery.data?.find((a) => a.id === id);
    },
    [articlesQuery.data],
  );

  return {
    articles: articlesQuery.data ?? [],
    loading: articlesQuery.isLoading,
    error: articlesQuery.error,
    getArticleById,
    refetch: articlesQuery.refetch,
  };
}

// ── useArticle (single article fetch) ────────────────────────────────────────

export function useArticle(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<ScienceArticle | null>({
    queryKey: ["article", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      const raw = await actor.getArticle(id);
      if (!raw) return null;
      return {
        id: raw.id,
        title: raw.title,
        category: mapCategory(String(raw.category)),
        summary: raw.summary,
        content: raw.content,
        readingMinutes: raw.readingMinutes,
        publishedDate: raw.publishedDate,
      };
    },
    enabled: !!actor && !isFetching && id !== null,
    staleTime: 5 * 60 * 1000,
  });
}

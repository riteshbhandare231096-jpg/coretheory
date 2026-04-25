import { createActor } from "@/backend";
import type { MetricEntry, PersonalBest } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

// ── useMetrics ────────────────────────────────────────────────────────────────

export function useMetrics() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const metricsQuery = useQuery<MetricEntry[]>({
    queryKey: ["metrics"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getMyMetrics();
      return raw.map((m) => ({
        weightKg: m.weightKg,
        bodyFatPct: m.bodyFatPct,
        loggedAt: m.loggedAt,
      }));
    },
    enabled: !!actor && !isFetching,
  });

  const personalBestsQuery = useQuery<PersonalBest[]>({
    queryKey: ["personalBests"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getMyPersonalBests();
      return raw.map((pb) => ({
        exerciseName: pb.exerciseName,
        weightKg: pb.weightKg,
        reps: pb.reps,
        loggedAt: pb.loggedAt,
      }));
    },
    enabled: !!actor && !isFetching,
  });

  const logWeightMutation = useMutation({
    mutationFn: async ({
      weightKg,
      bodyFatPct,
    }: {
      weightKg: number;
      bodyFatPct?: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.logMetric(weightKg, bodyFatPct ?? null);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });

  const logPBMutation = useMutation({
    mutationFn: async ({
      exerciseName,
      weightKg,
      reps,
    }: {
      exerciseName: string;
      weightKg: number;
      reps: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.logPersonalBest(
        exerciseName,
        weightKg,
        BigInt(reps),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalBests"] });
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.clearMyMetrics();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });

  const refetch = useCallback(() => {
    metricsQuery.refetch();
    personalBestsQuery.refetch();
  }, [metricsQuery, personalBestsQuery]);

  return {
    metrics: metricsQuery.data ?? [],
    personalBests: personalBestsQuery.data ?? [],
    loading: metricsQuery.isLoading || personalBestsQuery.isLoading,
    logWeight: logWeightMutation.mutateAsync,
    logPB: logPBMutation.mutateAsync,
    clearAll: clearAllMutation.mutateAsync,
    isLoggingWeight: logWeightMutation.isPending,
    isLoggingPB: logPBMutation.isPending,
    refetch,
  };
}

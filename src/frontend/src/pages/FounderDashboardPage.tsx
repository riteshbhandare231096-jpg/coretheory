import { createActor } from "@/backend";
import type { FounderDashboardStats } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/useSubscription";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Clock,
  Crown,
  IndianRupee,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const INR_PRICES: Record<string, number> = {
  months3: 1500,
  months6: 2500,
  months9: 4500,
  months12: 8500,
};

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  accent?: "teal" | "purple" | "amber" | "rose" | "default";
  icon: React.ReactNode;
  delay?: number;
}

function StatCard({
  title,
  value,
  sub,
  accent = "default",
  icon,
  delay = 0,
}: StatCardProps) {
  const accentMap = {
    teal: "from-teal-500/10 to-card border-teal-500/30 [&_.icon-wrap]:bg-teal-500/15 [&_.icon-wrap]:text-teal-400 [&_.stat-val]:text-teal-400",
    purple:
      "from-purple-500/10 to-card border-purple-500/30 [&_.icon-wrap]:bg-purple-500/15 [&_.icon-wrap]:text-purple-400 [&_.stat-val]:text-purple-400",
    amber:
      "from-amber-500/10 to-card border-amber-500/30 [&_.icon-wrap]:bg-amber-500/15 [&_.icon-wrap]:text-amber-400 [&_.stat-val]:text-amber-400",
    rose: "from-rose-500/10 to-card border-rose-500/30 [&_.icon-wrap]:bg-rose-500/15 [&_.icon-wrap]:text-rose-400 [&_.stat-val]:text-rose-400",
    default:
      "from-primary/5 to-card border-border [&_.icon-wrap]:bg-primary/10 [&_.icon-wrap]:text-primary [&_.stat-val]:text-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-gradient-to-b ${accentMap[accent]} border rounded-2xl p-5 flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="icon-wrap w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
      <div>
        <p className="stat-val font-display font-extrabold text-3xl leading-none">
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <div>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function FounderDashboardPage({
  onRedirect,
}: {
  onRedirect: () => void;
}) {
  const { isFounder, loading: subLoading, isLoggedIn } = useSubscription();
  const { actor, isFetching } = useActor(createActor);

  const [stats, setStats] = useState<FounderDashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!actor || isFetching) return;
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await actor.getFounderDashboardStats();
      setStats(data);
      setLastRefreshed(new Date());
    } catch {
      setStatsError("Failed to load dashboard stats. Please try again.");
    } finally {
      setStatsLoading(false);
      setRefreshing(false);
    }
  }, [actor, isFetching]);

  // Redirect non-founders once subscription data is loaded.
  // isFounder === null means "still loading" — never redirect until resolved.
  useEffect(() => {
    if (!subLoading && isLoggedIn && isFounder === false) {
      onRedirect();
    }
    if (!subLoading && !isLoggedIn) {
      onRedirect();
    }
  }, [isFounder, subLoading, isLoggedIn, onRedirect]);

  // Load stats when actor is ready and user is confirmed founder
  useEffect(() => {
    if (actor && !isFetching && isFounder && !stats && !statsLoading) {
      fetchStats();
    }
  }, [actor, isFetching, isFounder, stats, statsLoading, fetchStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
  };

  const fmtINR = (n: bigint) => `₹${Number(n).toLocaleString("en-IN")}`;

  const fmtCount = (n: bigint) => Number(n).toLocaleString("en-IN");

  const revenue3 = stats ? Number(stats.months3Count) * INR_PRICES.months3 : 0;
  const revenue6 = stats ? Number(stats.months6Count) * INR_PRICES.months6 : 0;
  const revenue9 = stats ? Number(stats.months9Count) * INR_PRICES.months9 : 0;
  const revenue12 = stats
    ? Number(stats.months12Count) * INR_PRICES.months12
    : 0;

  const isLoading = subLoading || statsLoading;

  if (subLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="founder_dashboard.loading_state"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">
            Verifying founder access…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="founder_dashboard.page"
    >
      {/* Hero header */}
      <section className="bg-gradient-to-b from-card via-card to-background border-b border-border pb-10 pt-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500/30 to-purple-500/30 border border-teal-500/30 flex items-center justify-center">
                <Crown className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-foreground">
                    Founder Dashboard
                  </h1>
                  <Badge className="bg-teal-500/15 text-teal-400 border-teal-500/30 font-bold text-xs">
                    Private
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm">
                  Real-time client & revenue overview — visible only to you
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {lastRefreshed && (
                <div
                  className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg px-3 py-1.5"
                  data-ocid="founder_dashboard.last_refreshed"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Updated{" "}
                    {lastRefreshed.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading || refreshing}
                data-ocid="founder_dashboard.refresh_button"
                className="gap-2 border-teal-500/40 text-teal-400 hover:bg-teal-500/10 font-semibold"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats grid */}
      <section className="container mx-auto px-4 max-w-6xl py-10">
        {statsError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-destructive text-sm font-medium flex items-center gap-2"
            data-ocid="founder_dashboard.error_state"
          >
            {statsError}
          </motion.div>
        )}

        {/* Overview row */}
        <div className="mb-3">
          <h2 className="font-display font-bold text-lg text-foreground mb-1">
            Client Overview
          </h2>
          <p className="text-muted-foreground text-sm">Total users by tier</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Free Users"
                value={stats ? fmtCount(stats.freeCount) : "—"}
                sub="Using the free tier"
                accent="default"
                icon={<Users className="w-4 h-4" />}
                delay={0}
              />
              <StatCard
                title="Total Paid Clients"
                value={
                  stats
                    ? fmtCount(
                        stats.months3Count +
                          stats.months6Count +
                          stats.months9Count +
                          stats.months12Count,
                      )
                    : "—"
                }
                sub="Across all plans"
                accent="teal"
                icon={<TrendingUp className="w-4 h-4" />}
                delay={0.05}
              />
              <StatCard
                title="Total Revenue"
                value={stats ? fmtINR(stats.totalRevenue) : "—"}
                sub="Lifetime earnings"
                accent="amber"
                icon={<IndianRupee className="w-4 h-4" />}
                delay={0.1}
              />
            </>
          )}
        </div>

        {/* Plan breakdown */}
        <div className="mb-3">
          <h2 className="font-display font-bold text-lg text-foreground mb-1">
            Subscription Breakdown
          </h2>
          <p className="text-muted-foreground text-sm">
            Clients per plan with calculated revenue
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="bg-gradient-to-b from-teal-500/8 to-card border border-teal-500/25 rounded-2xl p-5 relative overflow-hidden"
                data-ocid="founder_dashboard.plan_3mo_card"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-600" />
                <p className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-3">
                  3 Months
                </p>
                <p className="font-display font-extrabold text-3xl text-foreground leading-none mb-1">
                  {stats ? fmtCount(stats.months3Count) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  subscribers
                </p>
                <div className="border-t border-teal-500/20 pt-3">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-teal-400 mt-0.5">
                    {stats ? `₹${revenue3.toLocaleString("en-IN")}` : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ₹1,500 × {stats ? fmtCount(stats.months3Count) : "—"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-gradient-to-b from-purple-500/8 to-card border border-purple-500/25 rounded-2xl p-5 relative overflow-hidden"
                data-ocid="founder_dashboard.plan_6mo_card"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600" />
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3">
                  6 Months
                </p>
                <p className="font-display font-extrabold text-3xl text-foreground leading-none mb-1">
                  {stats ? fmtCount(stats.months6Count) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  subscribers
                </p>
                <div className="border-t border-purple-500/20 pt-3">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-purple-400 mt-0.5">
                    {stats ? `₹${revenue6.toLocaleString("en-IN")}` : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ₹2,500 × {stats ? fmtCount(stats.months6Count) : "—"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-gradient-to-b from-amber-500/8 to-card border border-amber-500/25 rounded-2xl p-5 relative overflow-hidden"
                data-ocid="founder_dashboard.plan_9mo_card"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600" />
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
                  9 Months
                </p>
                <p className="font-display font-extrabold text-3xl text-foreground leading-none mb-1">
                  {stats ? fmtCount(stats.months9Count) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  subscribers
                </p>
                <div className="border-t border-amber-500/20 pt-3">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-amber-400 mt-0.5">
                    {stats ? `₹${revenue9.toLocaleString("en-IN")}` : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ₹4,500 × {stats ? fmtCount(stats.months9Count) : "—"}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-gradient-to-b from-rose-500/8 to-card border border-rose-500/25 rounded-2xl p-5 relative overflow-hidden"
                data-ocid="founder_dashboard.plan_12mo_card"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 to-rose-600" />
                <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3">
                  12 Months
                </p>
                <p className="font-display font-extrabold text-3xl text-foreground leading-none mb-1">
                  {stats ? fmtCount(stats.months12Count) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  subscribers
                </p>
                <div className="border-t border-rose-500/20 pt-3">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-rose-400 mt-0.5">
                    {stats ? `₹${revenue12.toLocaleString("en-IN")}` : "—"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ₹8,500 × {stats ? fmtCount(stats.months12Count) : "—"}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Revenue summary table */}
        {!isLoading && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="bg-card border border-border rounded-2xl overflow-hidden"
            data-ocid="founder_dashboard.revenue_table"
          >
            <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">
                Revenue Summary
              </h3>
            </div>
            <div className="divide-y divide-border">
              {[
                {
                  label: "3-Month Plan",
                  count: stats.months3Count,
                  price: 1500,
                  revenue: revenue3,
                  color: "text-teal-400",
                },
                {
                  label: "6-Month Plan",
                  count: stats.months6Count,
                  price: 2500,
                  revenue: revenue6,
                  color: "text-purple-400",
                },
                {
                  label: "9-Month Plan",
                  count: stats.months9Count,
                  price: 4500,
                  revenue: revenue9,
                  color: "text-amber-400",
                },
                {
                  label: "12-Month Plan",
                  count: stats.months12Count,
                  price: 8500,
                  revenue: revenue12,
                  color: "text-rose-400",
                },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className="px-5 py-3.5 flex items-center justify-between text-sm"
                  data-ocid={`founder_dashboard.revenue_row.${i + 1}`}
                >
                  <span className="font-medium text-foreground">
                    {row.label}
                  </span>
                  <div className="flex items-center gap-8 text-right">
                    <span className="text-muted-foreground hidden sm:block w-20">
                      {fmtCount(row.count)} clients
                    </span>
                    <span className="text-muted-foreground hidden sm:block w-20">
                      ₹{row.price.toLocaleString("en-IN")} / plan
                    </span>
                    <span className={`font-bold w-28 ${row.color}`}>
                      ₹{row.revenue.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
              <div className="px-5 py-4 flex items-center justify-between bg-muted/20">
                <span className="font-bold text-foreground">Total Revenue</span>
                <span className="font-extrabold text-xl text-foreground">
                  {fmtINR(stats.totalRevenue)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}

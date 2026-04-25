import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetrics } from "@/hooks/useMetrics";
import type { MetricEntry, PersonalBest } from "@/types";
import {
  Activity,
  Award,
  Dumbbell,
  Plus,
  Scale,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function fmtShortDate(ts: bigint) {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function compute7DayMovingAvg(sorted: MetricEntry[]): number[] {
  return sorted.map((_, i) => {
    const window = sorted.slice(Math.max(0, i - 6), i + 1);
    return window.reduce((s, m) => s + m.weightKg, 0) / window.length;
  });
}

// ── SVG Weight Chart ──────────────────────────────────────────────────────────

function WeightChart({ sorted }: { sorted: MetricEntry[] }) {
  const display = sorted.slice(-30);
  if (display.length < 2) return null;

  const movingAvg = compute7DayMovingAvg(sorted).slice(-30);
  const weights = display.map((m) => m.weightKg);
  const minW = Math.min(...weights) - 2;
  const maxW = Math.max(...weights) + 2;

  const W = 600;
  const H = 200;
  const PAD = { top: 16, right: 16, bottom: 32, left: 44 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  function px(i: number) {
    return PAD.left + (i / (display.length - 1)) * chartW;
  }
  function py(val: number) {
    return PAD.top + chartH - ((val - minW) / (maxW - minW)) * chartH;
  }

  const dataPath = display
    .map(
      (m, i) =>
        `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(m.weightKg).toFixed(1)}`,
    )
    .join(" ");

  const avgPath = movingAvg
    .map(
      (v, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)},${py(v).toFixed(1)}`,
    )
    .join(" ");

  // Y-axis gridlines
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const val = minW + ((maxW - minW) * i) / ySteps;
    return { val, y: py(val) };
  });

  // X-axis labels: show ~5 evenly spaced dates
  const xLabelIndices = [
    0,
    Math.floor(display.length / 4),
    Math.floor(display.length / 2),
    Math.floor((3 * display.length) / 4),
    display.length - 1,
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ minWidth: 280, height: "auto", maxHeight: 220 }}
        role="img"
        aria-label="Weight progress chart"
      >
        {/* Grid lines */}
        {yLabels.map(({ val, y }) => (
          <g key={`y-${val.toFixed(1)}`}>
            <line
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 6}
              y={y + 4}
              textAnchor="end"
              className="fill-current"
              style={{ fontSize: 10, opacity: 0.5 }}
            >
              {val.toFixed(0)}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {xLabelIndices.map((idx) => {
          if (idx >= display.length) return null;
          return (
            <text
              key={idx}
              x={px(idx)}
              y={H - 4}
              textAnchor="middle"
              className="fill-current"
              style={{ fontSize: 9, opacity: 0.5 }}
            >
              {fmtShortDate(display[idx].loggedAt)}
            </text>
          );
        })}

        {/* Area fill under data line */}
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="oklch(var(--primary))"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="oklch(var(--primary))"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path
          d={`${dataPath} L${px(display.length - 1).toFixed(1)},${(PAD.top + chartH).toFixed(1)} L${PAD.left.toFixed(1)},${(PAD.top + chartH).toFixed(1)} Z`}
          fill="url(#weightGrad)"
        />

        {/* Data line */}
        <path
          d={dataPath}
          fill="none"
          stroke="oklch(var(--primary))"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* 7-day moving average line */}
        <path
          d={avgPath}
          fill="none"
          stroke="oklch(var(--accent))"
          strokeWidth={2}
          strokeDasharray="5 3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {display.map((m, i) => (
          <circle
            key={m.loggedAt.toString()}
            cx={px(i)}
            cy={py(m.weightKg)}
            r={3}
            fill="oklch(var(--primary))"
            stroke="oklch(var(--card))"
            strokeWidth={1.5}
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-6 h-0.5 rounded bg-primary" />
          Daily weight
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block w-6 h-0.5 rounded bg-accent"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, oklch(var(--accent)) 0 4px, transparent 4px 7px)",
            }}
          />
          7-day avg
        </span>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <Card className="bg-card border-border relative overflow-hidden">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1.5 truncate">
              {label}
            </p>
            <p
              className={`font-display text-3xl font-extrabold leading-none ${accent ? "text-primary" : "text-foreground"}`}
            >
              {value}
            </p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent ? "bg-primary/15" : "bg-muted"}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── PB Exercise Group ─────────────────────────────────────────────────────────

function PbGroup({
  exercise,
  entries,
}: { exercise: string; entries: PersonalBest[] }) {
  const sorted = [...entries].sort((a, b) => b.weightKg - a.weightKg);
  const best = sorted[0];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Dumbbell className="w-4 h-4 text-primary shrink-0" />
          <span className="font-semibold text-foreground capitalize truncate">
            {exercise}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="font-bold text-primary text-lg">
              {best.weightKg} kg
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              × {Number(best.reps)} reps
            </span>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 text-xs"
          >
            Best
          </Badge>
        </div>
      </button>

      {expanded && sorted.length > 1 && (
        <div className="divide-y divide-border">
          {sorted.map((pb, i) => (
            <div
              key={`${pb.exerciseName}-${pb.loggedAt.toString()}`}
              className="flex items-center justify-between px-4 py-2.5 text-sm"
              data-ocid={`metrics.pb_history.${i + 1}`}
            >
              <span className="text-muted-foreground">
                {fmtDate(pb.loggedAt)}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">
                  {pb.weightKg} kg
                </span>
                <span className="text-muted-foreground">
                  {Number(pb.reps)} reps
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {expanded && sorted.length === 1 && (
        <p className="px-4 py-3 text-sm text-muted-foreground">
          Only one entry recorded.
        </p>
      )}

      {!expanded && sorted.length > 1 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors"
        >
          Show {sorted.length - 1} more{" "}
          {sorted.length - 1 === 1 ? "entry" : "entries"} ↓
        </button>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function MetricsPage() {
  const {
    metrics,
    personalBests,
    loading,
    logWeight,
    logPB,
    clearAll,
    isLoggingWeight,
    isLoggingPB,
  } = useMetrics();

  const [weightKg, setWeightKg] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [pbExercise, setPbExercise] = useState("");
  const [pbWeight, setPbWeight] = useState("");
  const [pbReps, setPbReps] = useState("");

  const handleLogWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    const kg = Number.parseFloat(weightKg);
    if (!Number.isFinite(kg) || kg <= 0) {
      toast.error("Enter a valid weight");
      return;
    }
    const bf = bodyFat ? Number.parseFloat(bodyFat) : undefined;
    try {
      await logWeight({ weightKg: kg, bodyFatPct: bf });
      toast.success("Weight logged!");
      setWeightKg("");
      setBodyFat("");
    } catch {
      toast.error("Failed to log weight");
    }
  };

  const handleLogPB = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pbExercise.trim()) {
      toast.error("Enter an exercise name");
      return;
    }
    const kg = Number.parseFloat(pbWeight);
    const reps = Number.parseInt(pbReps, 10);
    if (!Number.isFinite(kg) || kg <= 0) {
      toast.error("Enter a valid weight");
      return;
    }
    if (!Number.isFinite(reps) || reps <= 0) {
      toast.error("Enter valid reps");
      return;
    }
    try {
      await logPB({ exerciseName: pbExercise.trim(), weightKg: kg, reps });
      toast.success("Personal best saved!");
      setPbExercise("");
      setPbWeight("");
      setPbReps("");
    } catch {
      toast.error("Failed to save personal best");
    }
  };

  const handleClear = async () => {
    if (
      !window.confirm(
        "Clear all your metrics and personal bests? This cannot be undone.",
      )
    )
      return;
    try {
      await clearAll();
      toast.success("All metrics cleared");
    } catch {
      toast.error("Failed to clear metrics");
    }
  };

  // Derived data
  const sorted = [...metrics].sort((a, b) => Number(a.loggedAt - b.loggedAt));
  const latest = sorted.at(-1);
  const latestBF = sorted.findLast((m) => m.bodyFatPct != null)?.bodyFatPct;
  const avgWeight7 =
    sorted.length > 0
      ? (
          sorted.slice(-7).reduce((s, m) => s + m.weightKg, 0) /
          Math.min(sorted.length, 7)
        ).toFixed(1)
      : null;

  // Grouped PBs by exercise
  const pbByExercise = personalBests.reduce<Record<string, PersonalBest[]>>(
    (acc, pb) => {
      const key = pb.exerciseName.toLowerCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push(pb);
      return acc;
    },
    {},
  );
  const pbExerciseNames = Object.keys(pbByExercise).sort();

  const hasAnyData = sorted.length > 0 || personalBests.length > 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">
              Progress Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Log weight, body fat %, and personal bests. Science-backed progress
            visualization.
          </p>
        </div>
        {hasAnyData && !loading && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 shrink-0"
            data-ocid="metrics.clear_button"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </Button>
        )}
      </div>

      {/* Stat cards */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        data-ocid="metrics.summary_panel"
      >
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="h-24 rounded-xl"
              data-ocid="metrics.loading_state"
            />
          ))
        ) : (
          <>
            <StatCard
              icon={<Scale className="w-4 h-4 text-primary" />}
              label="Current Weight"
              value={latest ? `${latest.weightKg}` : "—"}
              sub={latest ? "kg" : "Not logged yet"}
              accent
            />
            <StatCard
              icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
              label="7-Day Avg"
              value={avgWeight7 ? `${avgWeight7}` : "—"}
              sub={avgWeight7 ? "kg" : "Need more data"}
            />
            <StatCard
              icon={<Activity className="w-4 h-4 text-muted-foreground" />}
              label="Body Fat"
              value={latestBF != null ? `${latestBF.toFixed(1)}%` : "—"}
              sub={latestBF != null ? "latest reading" : "Not tracked"}
            />
            <StatCard
              icon={<Award className="w-4 h-4 text-muted-foreground" />}
              label="PBs Tracked"
              value={`${pbExerciseNames.length}`}
              sub={
                sorted.length > 0
                  ? `${sorted.length} sessions logged`
                  : "No sessions yet"
              }
            />
          </>
        )}
      </div>

      {/* Log forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight form */}
        <Card className="bg-card border-border" data-ocid="metrics.weight_card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Scale className="w-4 h-4 text-primary" />
              Log Today's Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogWeight} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="weightKg">Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  placeholder="e.g. 75.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  data-ocid="metrics.weight_input"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bodyFat">
                  Body Fat %{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  min="3"
                  max="60"
                  placeholder="e.g. 18.5"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  data-ocid="metrics.bodyfat_input"
                />
              </div>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoggingWeight}
                data-ocid="metrics.log_weight_button"
              >
                <Plus className="w-4 h-4" />
                {isLoggingWeight ? "Logging…" : "Log Entry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Personal best form */}
        <Card className="bg-card border-border" data-ocid="metrics.pb_card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-primary" />
              Log Personal Best
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogPB} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pbExercise">Exercise</Label>
                <Input
                  id="pbExercise"
                  placeholder="e.g. Deadlift, Squat, Bench Press"
                  value={pbExercise}
                  onChange={(e) => setPbExercise(e.target.value)}
                  data-ocid="metrics.pb_exercise_input"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pbWeight">Weight (kg)</Label>
                  <Input
                    id="pbWeight"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="100"
                    value={pbWeight}
                    onChange={(e) => setPbWeight(e.target.value)}
                    data-ocid="metrics.pb_weight_input"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pbReps">Reps</Label>
                  <Input
                    id="pbReps"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="5"
                    value={pbReps}
                    onChange={(e) => setPbReps(e.target.value)}
                    data-ocid="metrics.pb_reps_input"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoggingPB}
                data-ocid="metrics.log_pb_button"
              >
                <Plus className="w-4 h-4" />
                {isLoggingPB ? "Saving…" : "Save PB"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Weight Progress Chart */}
      <Card className="bg-card border-border" data-ocid="metrics.chart_card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-primary" />
            Weight Progress
            {sorted.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto text-xs bg-muted text-muted-foreground"
              >
                Last {Math.min(sorted.length, 30)} entries
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton
              className="h-48 rounded-lg"
              data-ocid="metrics.chart_loading_state"
            />
          ) : sorted.length < 2 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              data-ocid="metrics.chart_empty_state"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground mb-1">
                No trend data yet
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Log at least 2 weight entries to see your progress chart with a
                7-day moving average.
              </p>
            </div>
          ) : (
            <WeightChart sorted={sorted} />
          )}
        </CardContent>
      </Card>

      {/* Personal Bests */}
      <Card className="bg-card border-border" data-ocid="metrics.pbs_card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="w-4 h-4 text-primary" />
            Personal Bests
            {pbExerciseNames.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto text-xs bg-muted text-muted-foreground"
              >
                {pbExerciseNames.length} exercise
                {pbExerciseNames.length > 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : pbExerciseNames.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              data-ocid="metrics.pbs_empty_state"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground mb-1">
                No personal bests yet
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Record your first lift — squat, bench, deadlift — and start
                tracking your strength progress.
              </p>
            </div>
          ) : (
            <div className="space-y-3" data-ocid="metrics.pbs_list">
              {pbExerciseNames.map((exercise, i) => (
                <div key={exercise} data-ocid={`metrics.pb.${i + 1}`}>
                  <PbGroup
                    exercise={exercise}
                    entries={pbByExercise[exercise]}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty state for whole page */}
      {!loading && !hasAnyData && (
        <div
          className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center"
          data-ocid="metrics.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Start tracking your progress
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Log your weight daily, track body fat %, and record your personal
            bests in key lifts. Science shows that tracking progress increases
            adherence by up to 40%.
          </p>
          <Button
            onClick={() => document.getElementById("weightKg")?.focus()}
            data-ocid="metrics.start_tracking_button"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Log your first entry
          </Button>
        </div>
      )}
    </div>
  );
}

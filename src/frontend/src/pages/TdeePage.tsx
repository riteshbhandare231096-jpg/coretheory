import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  BookOpen,
  Calculator,
  ChevronRight,
  Flame,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useState } from "react";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very-active";

const ACTIVITY_OPTIONS: {
  value: ActivityLevel;
  label: string;
  detail: string;
  multiplier: number;
}[] = [
  {
    value: "sedentary",
    label: "Sedentary",
    detail: "Desk job, little or no exercise",
    multiplier: 1.2,
  },
  {
    value: "light",
    label: "Lightly Active",
    detail: "Light exercise 1–3 days/week",
    multiplier: 1.375,
  },
  {
    value: "moderate",
    label: "Moderately Active",
    detail: "Moderate exercise 3–5 days/week",
    multiplier: 1.55,
  },
  {
    value: "active",
    label: "Very Active",
    detail: "Hard exercise 6–7 days/week",
    multiplier: 1.725,
  },
  {
    value: "very-active",
    label: "Extremely Active",
    detail: "Physical job + intense daily training",
    multiplier: 1.9,
  },
];

interface TdeeResult {
  bmr: number;
  tdee: number;
  fatLossDeficit: number;
  aggressiveDeficit: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  proteinKcal: number;
  fatKcal: number;
  carbsKcal: number;
  proteinPct: number;
  fatPct: number;
  carbsPct: number;
}

function computeTdee(
  age: number,
  weightKg: number,
  heightCm: number,
  sex: "male" | "female",
  activityMultiplier: number,
): TdeeResult {
  // Mifflin-St Jeor BMR
  const bmr =
    sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * activityMultiplier);
  const fatLossDeficit = tdee - 500;
  const aggressiveDeficit = tdee - 750;

  // Macros for fat loss at standard deficit
  const proteinG = Math.round(weightKg * 2.2); // 2.2g per kg bodyweight
  const proteinKcal = proteinG * 4;
  const fatKcal = Math.round(fatLossDeficit * 0.25); // 25% of deficit calories from fat
  const fatG = Math.round(fatKcal / 9);
  const carbsKcal = Math.max(0, fatLossDeficit - proteinKcal - fatKcal);
  const carbsG = Math.round(carbsKcal / 4);

  const totalKcal = proteinKcal + fatKcal + carbsKcal;
  const proteinPct = Math.round((proteinKcal / totalKcal) * 100);
  const fatPct = Math.round((fatKcal / totalKcal) * 100);
  const carbsPct = 100 - proteinPct - fatPct;

  return {
    bmr: Math.round(bmr),
    tdee,
    fatLossDeficit,
    aggressiveDeficit,
    proteinG,
    fatG,
    carbsG,
    proteinKcal,
    fatKcal,
    carbsKcal,
    proteinPct,
    fatPct,
    carbsPct,
  };
}

const SCIENCE_EXPLANATIONS = [
  {
    icon: Calculator,
    title: "Mifflin-St Jeor Formula",
    body: "The most validated BMR equation for modern populations. It uses your weight, height, age, and sex to estimate the calories your body burns at complete rest — your minimum survival energy.",
  },
  {
    icon: Activity,
    title: "Activity Multipliers",
    body: "Your BMR is multiplied by a validated Harris-Benedict factor (1.2–1.9) based on how much you move daily. This gives your TDEE — the real-world number to hit for weight maintenance.",
  },
  {
    icon: Flame,
    title: "The 500 kcal Deficit",
    body: "A 500 kcal/day deficit creates roughly a 0.5 kg of fat loss per week — the clinically recommended rate to minimise muscle loss. The 750 kcal option (~0.75 kg/wk) is for those who want faster progress and are already resistance training.",
  },
  {
    icon: Zap,
    title: "Protein at 2.2g/kg",
    body: "Research consistently shows 2.2g of protein per kg of bodyweight maximises muscle protein synthesis during a deficit. This is the floor, not the ceiling — especially critical during fat loss.",
  },
  {
    icon: BookOpen,
    title: "Fat at 25% of Deficit Calories",
    body: "Fat supports hormone production, vitamin absorption (A, D, E, K), and neurological function. Dropping below 20% of calories from fat can impair testosterone and thyroid output.",
  },
];

export function TdeePage() {
  const [age, setAge] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [result, setResult] = useState<TdeeResult | null>(null);

  const selectedActivity = ACTIVITY_OPTIONS.find((o) => o.value === activity)!;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const a = Number.parseInt(age, 10);
    const w = Number.parseFloat(weightKg);
    const h = Number.parseFloat(heightCm);
    if (!Number.isFinite(a) || !Number.isFinite(w) || !Number.isFinite(h))
      return;
    setResult(computeTdee(a, w, h, sex, selectedActivity.multiplier));
  };

  const handleReset = () => {
    setAge("");
    setWeightKg("");
    setHeightCm("");
    setSex("male");
    setActivity("moderate");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl hero-gradient flex items-center justify-center shadow-lg">
              <Calculator className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold text-foreground leading-tight">
                TDEE Calculator
              </h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Total Daily Energy Expenditure
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm max-w-xl">
            Powered by the Mifflin-St Jeor equation — the gold standard for
            caloric estimation. Enter your stats to get your maintenance
            calories, fat-loss targets, and science-backed macro splits.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        {/* Input Form */}
        <Card
          className="bg-card border-border"
          data-ocid="tdee.calculator_card"
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                1
              </span>
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCalculate} className="space-y-6">
              {/* Sex toggle */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Biological Sex</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["male", "female"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      data-ocid={`tdee.sex_${s}`}
                      className={`py-3 rounded-lg border text-sm font-semibold capitalize transition-smooth ${
                        sex === s
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-input text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {s === "male" ? "♂ Male" : "♀ Female"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age / Weight / Height row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="age" className="text-sm">
                    Age{" "}
                    <span className="text-muted-foreground font-normal">
                      (years)
                    </span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="10"
                    max="100"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    data-ocid="tdee.age_input"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="weight" className="text-sm">
                    Weight{" "}
                    <span className="text-muted-foreground font-normal">
                      (kg)
                    </span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    placeholder="75"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    data-ocid="tdee.weight_input"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="height" className="text-sm">
                    Height{" "}
                    <span className="text-muted-foreground font-normal">
                      (cm)
                    </span>
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="100"
                    max="250"
                    placeholder="175"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    data-ocid="tdee.height_input"
                    required
                  />
                </div>
              </div>

              {/* Activity level */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Activity Level</Label>
                <div className="space-y-2">
                  {ACTIVITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setActivity(opt.value)}
                      data-ocid={`tdee.activity_${opt.value}`}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-smooth flex items-center justify-between group ${
                        activity === opt.value
                          ? "bg-primary/10 border-primary/50 text-foreground"
                          : "bg-background border-input text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      <div>
                        <span
                          className={`font-semibold block ${activity === opt.value ? "text-foreground" : ""}`}
                        >
                          {opt.label}
                        </span>
                        <span className="text-xs opacity-70">{opt.detail}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span
                          className={`text-xs font-mono ${activity === opt.value ? "text-primary" : "text-muted-foreground"}`}
                        >
                          ×{opt.multiplier}
                        </span>
                        {activity === opt.value && (
                          <ChevronRight className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 gap-2 font-semibold"
                  size="lg"
                  data-ocid="tdee.calculate_button"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate My TDEE
                </Button>
                {result && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    data-ocid="tdee.reset_button"
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div
            className="space-y-6 animate-fade-in"
            data-ocid="tdee.results_panel"
          >
            {/* Step 2 label */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                2
              </span>
              <span className="text-sm font-semibold text-foreground">
                Your Results
              </span>
            </div>

            {/* TDEE hero card */}
            <Card
              className="overflow-hidden border-0 shadow-lg"
              data-ocid="tdee.maintenance_card"
            >
              <div className="hero-gradient p-6 text-center">
                <p className="text-primary-foreground/70 text-xs uppercase tracking-[0.2em] font-semibold mb-2">
                  Maintenance Calories (TDEE)
                </p>
                <p className="font-display text-6xl font-black text-primary-foreground leading-none">
                  {result.tdee.toLocaleString()}
                </p>
                <p className="text-primary-foreground/80 text-sm mt-2">
                  kcal / day
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-black/20 rounded-full px-3 py-1">
                  <span className="text-primary-foreground/70 text-xs">
                    BMR:
                  </span>
                  <span className="text-primary-foreground text-xs font-semibold">
                    {result.bmr.toLocaleString()} kcal
                  </span>
                  <span className="text-primary-foreground/50 text-xs">×</span>
                  <span className="text-primary-foreground text-xs font-semibold">
                    {selectedActivity.multiplier}
                  </span>
                </div>
              </div>
            </Card>

            {/* Calorie Targets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fat Loss */}
              <Card
                className="bg-card border-border"
                data-ocid="tdee.fat_loss_card"
              >
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-0.5">
                        Fat Loss
                      </p>
                      <p className="font-display text-4xl font-black text-foreground">
                        {result.fatLossDeficit.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        kcal / day
                      </p>
                    </div>
                    <Badge className="bg-warning/15 text-warning border-warning/20 text-xs font-semibold">
                      −500 kcal
                    </Badge>
                  </div>
                  {/* Mini gauge */}
                  <CalorieGauge
                    current={result.fatLossDeficit}
                    maintenance={result.tdee}
                    color="orange"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    ~0.5 kg fat loss/week
                  </p>
                </CardContent>
              </Card>

              {/* Aggressive Deficit */}
              <Card
                className="bg-card border-border"
                data-ocid="tdee.aggressive_deficit_card"
              >
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-0.5">
                        Aggressive Deficit
                      </p>
                      <p className="font-display text-4xl font-black text-foreground">
                        {result.aggressiveDeficit.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        kcal / day
                      </p>
                    </div>
                    <Badge className="bg-destructive/15 text-destructive border-destructive/20 text-xs font-semibold">
                      −750 kcal
                    </Badge>
                  </div>
                  <CalorieGauge
                    current={result.aggressiveDeficit}
                    maintenance={result.tdee}
                    color="red"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    ~0.75 kg fat loss/week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Visual calorie balance bar */}
            <Card
              className="bg-card border-border"
              data-ocid="tdee.calorie_balance_card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Calorie Balance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <CalorieBalanceBar
                  maintenance={result.tdee}
                  fatLoss={result.fatLossDeficit}
                  aggressive={result.aggressiveDeficit}
                />
              </CardContent>
            </Card>

            {/* Macros card */}
            <Card
              className="bg-card border-border"
              data-ocid="tdee.macros_card"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Flame className="w-4 h-4 text-primary" />
                  Optimal Macros for Fat Loss
                  <Badge
                    variant="outline"
                    className="ml-auto text-xs font-normal"
                  >
                    at {result.fatLossDeficit.toLocaleString()} kcal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Macro bars */}
                <div className="space-y-3">
                  <MacroRow
                    label="Protein"
                    grams={result.proteinG}
                    kcal={result.proteinKcal}
                    pct={result.proteinPct}
                    color="primary"
                    note="2.2g per kg bodyweight — muscle preservation"
                  />
                  <MacroRow
                    label="Carbohydrates"
                    grams={result.carbsG}
                    kcal={result.carbsKcal}
                    pct={result.carbsPct}
                    color="secondary"
                    note="Remaining calories after protein & fat"
                  />
                  <MacroRow
                    label="Fat"
                    grams={result.fatG}
                    kcal={result.fatKcal}
                    pct={result.fatPct}
                    color="accent"
                    note="25% of deficit calories — hormone support"
                  />
                </div>

                {/* Percentage visual breakdown */}
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium">
                    Macro Split
                  </p>
                  <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
                    <div
                      className="bg-primary transition-smooth rounded-l-full"
                      style={{ width: `${result.proteinPct}%` }}
                      title={`Protein ${result.proteinPct}%`}
                    />
                    <div
                      className="bg-secondary transition-smooth"
                      style={{ width: `${result.carbsPct}%` }}
                      title={`Carbs ${result.carbsPct}%`}
                    />
                    <div
                      className="bg-accent transition-smooth rounded-r-full"
                      style={{ width: `${result.fatPct}%` }}
                      title={`Fat ${result.fatPct}%`}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" />
                      Protein {result.proteinPct}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-secondary inline-block" />
                      Carbs {result.carbsPct}%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" />
                      Fat {result.fatPct}%
                    </span>
                  </div>
                </div>

                <Separator />
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                  <p>
                    Protein is calculated first at 2.2g/kg to protect muscle.
                    Fat is set at 25% for hormonal health. Carbohydrates fill
                    the remaining calorie budget — adjust based on personal
                    preference, keeping protein constant.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Science explanations */}
            <div data-ocid="tdee.science_section">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold">
                  3
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Why These Numbers?
                </span>
              </div>
              <div className="space-y-3">
                {SCIENCE_EXPLANATIONS.map((exp) => (
                  <Card key={exp.title} className="bg-muted/40 border-border">
                    <CardContent className="pt-4 pb-4 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <exp.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          {exp.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {exp.body}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Bottom reset */}
            <div className="flex justify-center pb-4">
              <Button
                variant="outline"
                onClick={handleReset}
                data-ocid="tdee.reset_bottom_button"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Recalculate with New Stats
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function MacroRow({
  label,
  grams,
  kcal,
  pct,
  color,
  note,
}: {
  label: string;
  grams: number;
  kcal: number;
  pct: number;
  color: "primary" | "secondary" | "accent";
  note: string;
}) {
  const barColor = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-accent",
  }[color];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-sm ${barColor} shrink-0`} />
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            — {note}
          </span>
        </div>
        <div className="flex items-center gap-3 text-right">
          <span className="font-display text-lg font-bold text-foreground">
            {grams}g
          </span>
          <span className="text-xs text-muted-foreground w-16">
            {kcal.toLocaleString()} kcal
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-smooth`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground sm:hidden">{note}</p>
    </div>
  );
}

function CalorieGauge({
  current,
  maintenance,
  color,
}: {
  current: number;
  maintenance: number;
  color: "orange" | "red";
}) {
  const pct = Math.round((current / maintenance) * 100);
  const barColor = color === "orange" ? "bg-warning" : "bg-destructive";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>{pct}% of maintenance</span>
        <span>{maintenance.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-smooth`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CalorieBalanceBar({
  maintenance,
  fatLoss,
  aggressive,
}: {
  maintenance: number;
  fatLoss: number;
  aggressive: number;
}) {
  const max = Math.round(maintenance * 1.1);

  const toWidth = (val: number) => `${Math.round((val / max) * 100)}%`;

  const rows = [
    {
      label: "Maintenance",
      value: maintenance,
      barClass: "bg-primary",
      badge: "Balance",
    },
    {
      label: "Fat Loss",
      value: fatLoss,
      barClass: "bg-warning",
      badge: "−500 kcal",
    },
    {
      label: "Aggressive",
      value: aggressive,
      barClass: "bg-destructive",
      badge: "−750 kcal",
    },
  ];

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">{row.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono">
                {row.value.toLocaleString()} kcal
              </span>
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 font-normal"
              >
                {row.badge}
              </Badge>
            </div>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${row.barClass} rounded-full transition-smooth`}
              style={{ width: toWidth(row.value) }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground pt-1 text-center">
        Bars are relative to maintenance ({maintenance.toLocaleString()} kcal)
      </p>
    </div>
  );
}

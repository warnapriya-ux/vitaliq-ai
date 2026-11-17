import { createFileRoute, Link } from "@tanstack/react-router";
import BrandBar from "@/components/vitaliq/dashboard/BrandBar";
import Header from "@/components/vitaliq/dashboard/Header";
import GoalCard from "@/components/vitaliq/dashboard/GoalCard";
import DailyStats from "@/components/vitaliq/dashboard/DailyStats";
import AiAdvice from "@/components/vitaliq/dashboard/AiAdvice";
import PlanCards from "@/components/vitaliq/dashboard/PlanCards";
import ProgressGrid from "@/components/vitaliq/dashboard/ProgressGrid";
import QuickLog from "@/components/vitaliq/dashboard/QuickLog";
import GlassCard from "@/components/vitaliq/GlassCard";
import { useVitaliq } from "@/hooks/useVitaliq";
import { goalPercent, planItems } from "@/lib/health";

export const Route = createFileRoute("/_authed/_app/")({
  head: () => ({ meta: [{ title: "VITALIQ AI — Today" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { loading, profile, today, diet, workout, subscription, measurements, reload } = useVitaliq();

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-24 animate-pulse rounded-[26px] bg-white/5" />
        <div className="h-44 animate-pulse rounded-[26px] bg-white/5" />
        <div className="h-20 animate-pulse rounded-[26px] bg-white/5" />
      </div>
    );
  }

  if (!profile) {
    return (
      <GlassCard className="text-center">
        <p className="font-heading text-lg font-semibold text-white">Let's build your programme</p>
        <p className="mt-1 text-xs text-white/45">Add your measurements and goals so VITALIQ can personalise everything.</p>
        <Link
          to="/onboarding"
          className="mt-4 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950"
        >
          Start health assessment
        </Link>
      </GlassCard>
    );
  }

  const weighed = measurements.filter((m) => typeof m.weight === "number");
  const latest = weighed[weighed.length - 1];
  const current = latest?.weight ?? profile.current_weight ?? 0;
  const target = profile.target_weight ?? current;
  const percent = goalPercent(current, target, weighed[0]?.weight);
  const toGo = Math.max(0, Math.round((current - target) * 10) / 10);

  const stats = [
    { label: "Steps", value: (today?.steps ?? 0).toLocaleString("en-US"), icon: "steps" },
    { label: "Water", value: `${Number(today?.water_l ?? 0).toFixed(1)} L`, icon: "water" },
    { label: "Calories", value: String(today?.calories_burned ?? today?.calories_in ?? 0), icon: "calories" },
    { label: "Sleep", value: `${Number(today?.sleep_hours ?? 0).toFixed(1)} h`, icon: "sleep" },
  ];

  const advice =
    (diet?.summary ? String(diet.summary).split(". ")[0] : null) ||
    (subscription?.status === "pending"
      ? "Your upgrade is being verified. Keep logging today and your new programme unlocks as soon as it is active."
      : "Log your first check-in today and VITALIQ will start tuning your plan.");

  const items = planItems(diet);
  const progress = [
    { label: "Weight", value: `-${Math.max(0, Math.round(((weighed[0]?.weight ?? current) - current) * 10) / 10)} kg`, pct: percent, from: "#4ade80", to: "#22d3ee" },
    { label: "Waist", value: `${latest?.waist ?? "—"} cm`, pct: 62, from: "#38bdf8", to: "#818cf8" },
    { label: "Plan", value: `${today?.diet_adherence ?? 0}%`, pct: today?.diet_adherence ?? 0, from: "#a78bfa", to: "#f472b6" },
    { label: "Workout", value: today?.workout_done ? "Done" : "Open", pct: today?.workout_done ? 100 : 25, from: "#fbbf24", to: "#fb7185" },
  ];

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-12 lg:gap-5 lg:space-y-0">
      <div className="space-y-4 lg:col-span-7">
        <BrandBar />
        <Header name={profile.display_name || "there"} plan={subscription?.plan || "Free"} />
        <GoalCard percent={percent} current={current} target={target} toGo={toGo} />
        <DailyStats stats={stats} />
        <AiAdvice advice={advice} />
        <div className="hidden lg:block">
          <QuickLog profile={profile} today={today} onSaved={reload} />
        </div>
      </div>
      <div className="space-y-4 lg:col-span-5">
        <PlanCards
          workout={{
            title: workout?.title || "No workout yet",
            duration: planItems(workout).length ? `${planItems(workout).length} exercises` : "—",
            detail: workout?.status?.replace("_", " ") || "generate one",
          }}
          diet={items.slice(0, 3).map((item) => `${item.label}: ${item.detail}`)}
        />
        <ProgressGrid items={progress} />
        <div className="lg:hidden">
          <QuickLog profile={profile} today={today} onSaved={reload} />
        </div>
      </div>
    </div>
  );
}
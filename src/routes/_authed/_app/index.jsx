import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import BrandBar from "@/components/vitaliq/dashboard/BrandBar";
import Header from "@/components/vitaliq/dashboard/Header";
import GoalCard from "@/components/vitaliq/dashboard/GoalCard";
import DailyStats from "@/components/vitaliq/dashboard/DailyStats";
import AiAdvice from "@/components/vitaliq/dashboard/AiAdvice";
import TodayPlan from "@/components/vitaliq/dashboard/TodayPlan";
import CatalogCard from "@/components/vitaliq/dashboard/CatalogCard";
import ProgressGrid from "@/components/vitaliq/dashboard/ProgressGrid";
import TrainerCard from "@/components/vitaliq/dashboard/TrainerCard";
import QuickLog from "@/components/vitaliq/dashboard/QuickLog";
import GlassCard from "@/components/vitaliq/GlassCard";
import ServiceModules from "@/components/vitaliq/dashboard/ServiceModules";
import ProPortalLink from "@/components/vitaliq/dashboard/ProPortalLink";
import PullToRefresh from "@/components/vitaliq/PullToRefresh";
import { useVitaliq } from "@/hooks/useVitaliq";
import { ensurePersonalPlans } from "@/lib/server-fns";
import { goalPercent, planItems } from "@/lib/health";

export const Route = createFileRoute("/_authed/_app/")({
  head: () => ({ meta: [{ title: "VITALIQ AI — Today" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { loading, profile, today, diet, workout, subscription, measurements, reload } = useVitaliq();
  const ensurePlans = useServerFn(ensurePersonalPlans);
  const [building, setBuilding] = useState(false);
  const requested = useRef(false);

  // A signed-in member always lands on a plan built from the exercise gallery.
  useEffect(() => {
    if (loading || !profile || requested.current) return;
    requested.current = true;
    setBuilding(true);
    ensurePlans()
      .then((result) => (result?.created?.length ? reload() : null))
      .catch((error) => {
        console.error(error);
        toast.error("Could not build your plan right now.");
      })
      .finally(() => setBuilding(false));
  }, [loading, profile, reload, ensurePlans]);

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
      <div className="space-y-4">
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
        <ProPortalLink />
      </div>
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
    <PullToRefresh onRefresh={reload}>
    <div className="space-y-4">
      <BrandBar />
      <Header name={profile.display_name || "there"} plan={subscription?.plan || "Free"} />
      <ProPortalLink />

      {building && (
        <div className="flex items-center gap-3 rounded-[26px] border border-cyan-400/25 bg-cyan-400/[0.07] px-4 py-3">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan-300" />
          <p className="text-[12px] leading-relaxed text-white/70">
            Your AI assistant is building today's workout and daily plan from the exercise gallery.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <GoalCard percent={percent} current={current} target={target} toGo={toGo} />
        <ServiceModules />
        <DailyStats stats={stats} />
        <TodayPlan
          workout={{ title: workout?.title, exerciseCount: planItems(workout).length }}
          diet={{ title: diet?.title, mealCount: items.length, calories: diet?.calories_target }}
        />
        <CatalogCard />
        <QuickLog profile={profile} today={today} onSaved={reload} />
      </div>

      <div className="space-y-4">
        <AiAdvice advice={advice} />
        <TrainerCard />
        <ProgressGrid items={progress} />
      </div>
    </div>
    </PullToRefresh>
  );
}
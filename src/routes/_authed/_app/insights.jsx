import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2, Sparkles, TrendingDown } from "lucide-react";
import PageTitle from "@/components/vitaliq/PageTitle";
import GlassCard from "@/components/vitaliq/GlassCard";
import { useVitaliq } from "@/hooks/useVitaliq";
import { askCoach as askCoachFn } from "@/lib/server-fns";
import { bmi, bmiLabel, formatDate, profileSummary, recentSummary } from "@/lib/health";

export const Route = createFileRoute("/_authed/_app/insights")({
  head: () => ({ meta: [{ title: "VITALIQ Insights — Progress" }] }),
  component: InsightsPage,
});

const tooltipStyle = {
  background: "#0b1220",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 11,
};

function InsightsPage() {
  const { profile, measurements, logs } = useVitaliq();
  const askCoach = useServerFn(askCoachFn);
  const [insight, setInsight] = useState("");
  const [busy, setBusy] = useState(false);

  const withWeight = measurements.filter((m) => typeof m.weight === "number");
  const latest = withWeight[withWeight.length - 1] ?? null;
  const first = withWeight[0] ?? null;
  const index = bmi(latest?.weight ?? profile?.current_weight, profile?.height_cm);
  const lost = first && latest ? Math.round((first.weight - latest.weight) * 10) / 10 : 0;

  const weightData = withWeight.map((m) => ({ date: String(m.measured_on).slice(5), weight: m.weight }));
  const adherenceData = [...logs].reverse().map((l) => ({ date: String(l.log_date).slice(5), value: l.diet_adherence ?? 0 }));

  async function review() {
    setBusy(true);
    try {
      const res = await askCoach({
        data: {
          question: "Review my progress and tell me what to adjust this week.",
          profileSummary: profileSummary(profile, latest),
          recentSummary: recentSummary(logs),
          mode: "insight",
        },
      });
      setInsight(res.reply);
    } catch (error) {
      console.error(error);
      setInsight("The progress review is unavailable right now. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <PageTitle eyebrow="Vitaliq Insights" title="Your progress" />

      <GlassCard className="p-0">
        <div className="grid grid-cols-3 divide-x divide-white/[0.07]">
          <div className="px-3 py-3">
            <p className="text-[9px] uppercase tracking-[0.1em] text-white/35">Weight change</p>
            <p className="mt-1 font-heading text-base font-semibold text-emerald-300">-{lost} kg</p>
          </div>
          <div className="px-3 py-3">
            <p className="text-[9px] uppercase tracking-[0.1em] text-white/35">BMI</p>
            <p className="mt-1 font-heading text-base font-semibold text-white">{index ?? "—"}</p>
            <p className="text-[9px] leading-tight text-white/35">{bmiLabel(index)}</p>
          </div>
          <div className="px-3 py-3">
            <p className="text-[9px] uppercase tracking-[0.1em] text-white/35">To target</p>
            <p className="mt-1 font-heading text-base font-semibold text-cyan-300">
              {latest && profile?.target_weight ? `${Math.round((latest.weight - profile.target_weight) * 10) / 10} kg` : "—"}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-semibold text-white">Weight trend</p>
          <span className="flex items-center gap-1 text-[10px] text-emerald-300">
            <TrendingDown className="h-3 w-3" /> downward
          </span>
        </div>
        <div className="mt-3 h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" minTickGap={14} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} tickMargin={6} />
              <YAxis width={34} domain={["dataMin - 2", "dataMax + 1"]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="weight" stroke="#00f0ff" strokeWidth={2.5} dot={{ r: 3, fill: "#00f0ff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <p className="font-heading text-sm font-semibold text-white">Diet adherence</p>
        <div className="mt-3 h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={adherenceData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="date" minTickGap={14} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} tickMargin={6} />
              <YAxis width={34} domain={[0, 100]} ticks={[0, 50, 100]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="url(#adherence)" />
              <defs>
                <linearGradient id="adherence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#6d3bff" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-semibold text-white">Body measurements</p>
          <span className="text-[10px] text-white/35">{measurements.length} records</span>
        </div>
        <div className="mt-3 space-y-2">
          {[...measurements].reverse().slice(0, 4).map((m) => (
            <div key={m.id} className="rounded-xl bg-white/[0.03] px-3 py-2">
              <div className="flex items-baseline justify-between gap-2 text-[11px]">
                <span className="text-white/45">{formatDate(m.measured_on)}</span>
                <span className="font-medium text-white/80">{m.weight ?? "—"} kg</span>
              </div>
              <p className="mt-0.5 text-[10px] leading-tight text-white/35">
                Waist {m.waist ?? "—"} cm · Body fat {m.body_fat ?? "—"}%
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="bg-gradient-to-br from-cyan-500/20 via-orange-500/10 to-transparent">
        <div className="flex items-start justify-between gap-3">
          <p className="flex items-center gap-1.5 font-heading text-sm font-semibold leading-snug text-white">
            <Sparkles className="h-3.5 w-3.5 shrink-0" /> AI progress review
          </p>
          <button
            type="button"
            onClick={review}
            disabled={busy}
            className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white ring-1 ring-white/20 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Analyse"}
          </button>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/65">
          {insight || "Let VITALIQ Health analyse your trend and suggest this week's adjustment."}
        </p>
      </GlassCard>
    </div>
  );
}
import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { formatDate } from "@/lib/health";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import GlassCard from "@/components/vitaliq/GlassCard";
import ProStatGrid from "@/components/pro/ProStatGrid";

function DietProgress({ user }) {
  const [logs, setLogs] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [logPage, feedbackPage] = await Promise.all([
      base44.entities.DailyDietLog.filter({ client_user_id: user.id }, { sort: "log_date", limit: 60 }),
      base44.entities.DietitianFeedback.filter({ client_user_id: user.id }, { sort: "-created_date", limit: 10 }),
    ]);
    setLogs(logPage.items ?? []);
    setFeedback(feedbackPage.items ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  const weighed = logs.filter((log) => typeof log.weight === "number");
  const first = weighed[0]?.weight;
  const latest = weighed[weighed.length - 1]?.weight;
  const change = first && latest ? Math.round((latest - first) * 10) / 10 : 0;
  const average =
    logs.length === 0
      ? 0
      : Math.round(
          logs.reduce((sum, log) => sum + ((log.meals_completed ?? 0) / Math.max(1, log.meals_planned ?? 5)) * 100, 0) / logs.length,
        );

  const chart = weighed.slice(-14).map((log) => ({
    date: log.log_date?.slice(5) ?? "",
    weight: log.weight,
  }));

  return (
    <div className="space-y-4">
      <SubPageHeader title="Diet progress" subtitle="Weight & compliance" />
      <ProStatGrid
        stats={[
          { label: "Current weight", value: latest ? `${latest} kg` : "—" },
          { label: "Change", value: `${change > 0 ? "+" : ""}${change} kg`, accent: change <= 0 ? "text-emerald-300" : "text-amber-300" },
          { label: "Meal compliance", value: `${average}%`, accent: "text-cyan-300" },
          { label: "Days logged", value: logs.length },
        ]}
      />

      {loading ? (
        <div className="h-48 animate-pulse rounded-[26px] bg-white/5" />
      ) : chart.length > 1 ? (
        <GlassCard className="p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Weight trend</p>
          <div className="mt-2 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11 }} />
                <Line type="monotone" dataKey="weight" stroke="#34d399" strokeWidth={2.5} dot={{ r: 2.5, fill: "#34d399" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="text-center">
          <p className="font-heading text-sm font-semibold text-white">Log your weight to see the trend</p>
          <p className="mt-1 text-xs text-white/40">Two entries are enough to draw your progress line.</p>
        </GlassCard>
      )}

      {feedback.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">Dietitian recommendations</p>
          {feedback.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] uppercase tracking-wider text-white/30">{item.kind.replace("_", " ")} · {formatDate(item.created_date)}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/60">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const Route = createFileRoute("/_authed/_app/diet/progress")({
  head: () => ({ meta: [{ title: "Diet progress — VITALIQ AI" }] }),
  component: Page,
});

function Page() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth || !user) return <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />;
  return <DietProgress user={user} />;
}
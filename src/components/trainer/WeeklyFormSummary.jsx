import { useEffect, useState } from "react";
import { Loader2, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import GlassCard from "@/components/vitaliq/GlassCard";

const DAY_MS = 86400000;

const localKey = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export default function WeeklyFormSummary() {
  const [sessions, setSessions] = useState(null);

  useEffect(() => {
    let alive = true;
    const since = new Date(Date.now() - 13 * DAY_MS);
    base44.entities.TrainerSession.filter(
      { created_date: { $gte: since.toISOString() } },
      { sort: "created_date", limit: 100 },
    )
      .then((page) => alive && setSessions(page.items ?? []))
      .catch((error) => {
        console.error(error);
        if (alive) setSessions([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfToday.getTime() - (6 - index) * DAY_MS);
    return { key: localKey(date), label: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1) };
  });

  const week = new Map(days.map((day) => [day.key, { total: 0, count: 0 }]));
  const previous = { total: 0, count: 0 };
  let reps = 0;

  (sessions ?? []).forEach((session) => {
    const score = Number(session.form_score) || 0;
    if (!score) return;
    reps += Number(session.reps) || 0;
    const bucket = week.get(localKey(session.created_date));
    if (bucket) {
      bucket.total += score;
      bucket.count += 1;
    } else {
      previous.total += score;
      previous.count += 1;
    }
  });

  const scored = [...week.values()].filter((bucket) => bucket.count > 0);
  const average = scored.length
    ? Math.round(scored.reduce((sum, bucket) => sum + bucket.total / bucket.count, 0) / scored.length)
    : null;
  const previousAverage = previous.count ? Math.round(previous.total / previous.count) : null;
  const delta = average != null && previousAverage != null ? average - previousAverage : null;

  const trend =
    delta == null
      ? { icon: Minus, className: "text-white/40", text: "First week tracked" }
      : delta > 0
        ? { icon: TrendingUp, className: "text-emerald-300", text: `+${delta} vs last week` }
        : delta < 0
          ? { icon: TrendingDown, className: "text-rose-300", text: `${delta} vs last week` }
          : { icon: Minus, className: "text-white/40", text: "Level with last week" };

  if (sessions === null) {
    return (
      <GlassCard>
        <div className="flex items-center gap-2 py-4 text-[11px] text-white/40">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your week
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">This week</p>
          <p className="mt-1 font-heading text-2xl font-semibold text-white">
            {average ?? "—"}
            <span className="text-[12px] font-normal text-white/35"> / 100 form</span>
          </p>
        </div>
        <span className={`flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] ${trend.className}`}>
          <trend.icon className="h-3 w-3" /> {trend.text}
        </span>
      </div>

      <div className="mt-4 flex h-16 items-end gap-2">
        {days.map((day) => {
          const bucket = week.get(day.key);
          const dayScore = bucket.count ? Math.round(bucket.total / bucket.count) : 0;
          return (
            <div key={day.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div className="flex h-full w-full items-end rounded-md bg-white/[0.04]">
                <div
                  className="w-full rounded-md bg-gradient-to-t from-cyan-400/70 to-orange-400/80"
                  style={{ height: `${dayScore ? Math.max(10, dayScore) : 0}%` }}
                />
              </div>
              <span className="text-[9px] text-white/30">{day.label}</span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-white/40">
        {scored.length
          ? `${scored.reduce((sum, bucket) => sum + bucket.count, 0)} sessions scored · ${reps} reps logged`
          : "No form scores yet this week. Run a live check or analyse a video to start the trend."}
      </p>
    </GlassCard>
  );
}
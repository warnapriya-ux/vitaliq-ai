import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GlassCard from "@/components/vitaliq/GlassCard";
import { formatDate } from "@/lib/health";

const tooltipStyle = {
  background: "#0b1220",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 11,
};

function LegendDot({ color, label, unit }) {
  return (
    <span className="flex items-center gap-1.5 text-[10px] text-white/45">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label} <span className="text-white/25">({unit})</span>
    </span>
  );
}

export default function WeightBodyFatChart({ measurements }) {
  const data = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 3);
    const from = cutoff.toISOString().slice(0, 10);
    return measurements
      .filter((m) => m.measured_on && String(m.measured_on) >= from)
      .sort((a, b) => String(a.measured_on).localeCompare(String(b.measured_on)))
      .map((m) => ({
        date: String(m.measured_on).slice(5),
        full: m.measured_on,
        weight: typeof m.weight === "number" ? m.weight : null,
        bodyFat: typeof m.body_fat === "number" ? m.body_fat : null,
      }));
  }, [measurements]);

  const hasWeight = data.some((d) => d.weight !== null);
  const hasFat = data.some((d) => d.bodyFat !== null);

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <p className="font-heading text-sm font-semibold text-white">Weight &amp; body fat</p>
        <span className="text-[10px] uppercase tracking-[0.1em] text-white/35">Last 3 months</span>
      </div>

      <div className="mt-2 flex items-center gap-4">
        <LegendDot color="#00f0ff" label="Weight" unit="kg" />
        <LegendDot color="#ff7a00" label="Body fat" unit="%" />
      </div>

      {data.length < 2 || (!hasWeight && !hasFat) ? (
        <p className="mt-6 pb-6 text-center text-[11px] leading-relaxed text-white/35">
          Add at least two measurements in the last three months to see this trend.
        </p>
      ) : (
        <div className="mt-3 h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 0, left: -14, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                minTickGap={14}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickMargin={6}
              />
              <YAxis
                yAxisId="weight"
                width={34}
                domain={["dataMin - 2", "dataMax + 2"]}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="fat"
                orientation="right"
                width={30}
                domain={["dataMin - 1", "dataMax + 1"]}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelFormatter={(label, payload) => formatDate(payload?.[0]?.payload?.full ?? label)}
                formatter={(value, name) => [name === "Weight" ? `${value} kg` : `${value}%`, name]}
              />
              <Line
                yAxisId="weight"
                type="monotone"
                dataKey="weight"
                name="Weight"
                stroke="#00f0ff"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#00f0ff" }}
                connectNulls
              />
              <Line
                yAxisId="fat"
                type="monotone"
                dataKey="bodyFat"
                name="Body fat"
                stroke="#ff7a00"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#ff7a00" }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
export default function TrainerHud({ live, exercise }) {
  const isStatic = Boolean(exercise?.static);
  const phaseLabel = isStatic
    ? live.hold > 0
      ? "Holding"
      : "Find your line"
    : live.phase === "down"
      ? "Bottom"
      : live.phase === "up"
        ? "Top"
        : "Get set";

  const stats = [
    { label: isStatic ? "Hold" : "Reps", value: isStatic ? `${live.hold ?? 0}s` : live.reps ?? 0, accent: "text-cyan-300" },
    { label: "Form", value: `${live.score ?? 100}`, accent: live.score >= 80 ? "text-emerald-300" : live.score >= 65 ? "text-amber-300" : "text-rose-300" },
    { label: isStatic ? "Line" : "Angle", value: live.angle == null ? "—" : `${live.angle}°`, accent: "text-white" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center backdrop-blur">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">{stat.label}</p>
            <p className={`mt-1 font-heading text-2xl font-semibold ${stat.accent}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
        <p className="text-[11px] text-white/60">
          {phaseLabel}
          <span className="text-white/30"> · {exercise?.name}</span>
        </p>
      </div>

      {live.warnings?.length > 0 && (
        <ul className="space-y-1.5">
          {live.warnings.slice(0, 2).map((warning) => (
            <li
              key={warning.code}
              className={`rounded-2xl border px-3 py-2 text-[11px] leading-relaxed ${
                warning.severity === "high"
                  ? "border-rose-400/30 bg-rose-500/10 text-rose-100"
                  : "border-amber-300/25 bg-amber-400/10 text-amber-100"
              }`}
            >
              {warning.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
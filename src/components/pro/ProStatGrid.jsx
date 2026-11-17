export default function ProStatGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">{stat.label}</p>
          <p className={`mt-1.5 font-heading text-xl font-semibold ${stat.accent || "text-white"}`}>{stat.value}</p>
          {stat.hint && <p className="mt-0.5 truncate text-[10px] text-white/35">{stat.hint}</p>}
        </div>
      ))}
    </div>
  );
}
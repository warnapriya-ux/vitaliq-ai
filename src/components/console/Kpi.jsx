export default function Kpi({ label, value, hint, accent = "text-white" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[12px] uppercase tracking-[0.16em] text-white/60">{label}</p>
      <p className={`mt-1.5 font-heading text-2xl font-semibold ${accent}`}>{value}</p>
      {hint && <p className="mt-0.5 text-[12px] text-white/60">{hint}</p>}
    </div>
  );
}
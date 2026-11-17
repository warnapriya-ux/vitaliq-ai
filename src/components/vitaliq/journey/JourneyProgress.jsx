import GlassCard from "@/components/vitaliq/GlassCard";

export default function JourneyProgress({ done, total }) {
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <GlassCard className="border-cyan-300/20 bg-gradient-to-br from-[#131B2E] via-[#12233a] to-[#0B132B]">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Your progress</p>
          <p className="mt-1 font-heading text-[22px] font-semibold text-white">
            {done} <span className="text-white/35">of {total} stages</span>
          </p>
        </div>
        <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
          {pct}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-orange-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-white/45">
        Every stage unlocks the next: the more you log, the sharper your AI plans and coaching become.
      </p>
    </GlassCard>
  );
}
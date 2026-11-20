import { Play } from "lucide-react";

export default function VideoRow({ video, active, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group flex w-full items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 active:scale-[0.995] ${
        active
          ? "border-cyan-300/50 bg-white/[0.07]"
          : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]"
      }`}
    >
      <span
        className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${
          active ? "bg-cyan-400/15 text-cyan-300 ring-cyan-400/30" : "bg-white/[0.05] text-white/50 ring-white/10"
        }`}
      >
        <Play className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-[13px] font-semibold leading-snug text-white">
          {video.number}. {video.title}
        </span>
        <span className="mt-0.5 block text-[11.5px] leading-relaxed text-white/55">
          {video.description}
        </span>
        <span className="mt-1 block text-[10.5px] uppercase tracking-[0.14em] text-white/35">
          {video.track} · {video.duration}
        </span>
      </span>
    </button>
  );
}
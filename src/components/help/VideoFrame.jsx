import { Play } from "lucide-react";

/** The real video surface for a tutorial clip, with captions, chapter label and tap-to-play. */
export default function VideoFrame({ video, scene, playing, captions, onToggle, videoRef }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black">
      <div className="relative aspect-[16/9] w-full">
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/45" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm">
          <span
            className={`h-1.5 w-1.5 rounded-full ${playing ? "animate-pulse bg-cyan-300" : "bg-white/50"}`}
          />
          {playing ? "Playing" : "Paused"}
        </span>
        <span className="absolute right-3 top-3 max-w-[55%] truncate rounded-full bg-black/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-white/70 backdrop-blur-sm">
          {scene?.title}
        </span>

        {captions && scene && (
          <div key={scene.id} className="absolute inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-5">
            <p className="animate-in fade-in slide-in-from-bottom-1 rounded-xl bg-black/70 px-3 py-2 text-center text-[11.5px] leading-snug text-white/90 backdrop-blur-sm duration-500 sm:text-[13px]">
              {scene.caption}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
          className="group absolute inset-0 grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/60"
        >
          {!playing && (
            <span className="grid h-14 w-14 place-items-center rounded-full bg-cyan-400/95 text-slate-950 shadow-[0_18px_50px_-12px_rgba(34,211,238,0.7)] transition group-hover:scale-105">
              <Play className="h-6 w-6 translate-x-[1px]" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
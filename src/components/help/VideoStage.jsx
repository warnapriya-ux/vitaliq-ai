import { Play } from "lucide-react";
import AppScreen from "@/components/help/AppScreen";
import { screenForVideo } from "@/lib/tutorialScreens";

/**
 * The walkthrough stage: the real VITALIQ mobile screen for the current chapter,
 * with the chapter it belongs to beside it. Tapping the stage plays or pauses.
 */
export default function VideoStage({ video, scenes, scene, activeIndex, playing, captions, onToggle }) {
  const screen = screenForVideo(video.id);

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-[#060b14]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_20%_0%,rgba(34,211,238,0.16),transparent_58%)]" />

      <div className="relative flex items-center justify-between gap-2 border-b border-white/[0.07] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
        </div>
        <p className="truncate text-[10.5px] uppercase tracking-[0.18em] text-white/35">
          VITALIQ AI · app walkthrough
        </p>
        <span
          className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
            playing ? "text-cyan-300" : "text-white/30"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${playing ? "animate-pulse bg-cyan-300" : "bg-white/30"}`}
          />
          {playing ? "Playing" : "Paused"}
        </span>
      </div>

      <div className="relative aspect-[16/9] w-full">
        <div className="absolute inset-0 flex items-center justify-center gap-5 px-4 py-3 sm:gap-8 sm:px-6">
          <AppScreen screen={screen} activeIndex={activeIndex} playing={playing} />

          <div className="hidden min-w-0 flex-1 flex-col justify-center gap-2.5 sm:flex">
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-cyan-300/70">
              Chapter {activeIndex + 1} of {scenes.length}
            </p>
            <h3 className="font-heading text-[15px] font-semibold leading-snug text-white">
              {scene?.title}
            </h3>
            <p className="flex items-start gap-1.5 text-[12px] leading-relaxed text-white/60">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/80" />
              {scene?.action}
            </p>
            {captions && scene && (
              <p
                key={scene.id}
                className="animate-in fade-in slide-in-from-bottom-1 rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-2 text-[11.5px] leading-relaxed text-white/85 duration-500"
              >
                {scene.caption}
              </p>
            )}
            <div className="flex items-center gap-1 pt-0.5">
              {scenes.map((item, index) => (
                <span
                  key={item.id}
                  className={`h-1 rounded-full transition-all ${
                    index === activeIndex ? "w-6 bg-cyan-400" : "w-2.5 bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {captions && scene && (
          <div className="absolute inset-x-3 bottom-2 sm:hidden">
            <p className="rounded-xl bg-black/70 px-3 py-1.5 text-center text-[11px] leading-snug text-white/90 backdrop-blur-sm">
              {scene.caption}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
          className="absolute inset-0 grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-400/60"
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
import { Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import { BRAND_LOGO } from "@/lib/brand";
import VideoFrame from "@/components/help/VideoFrame";

const PIN_POSITIONS = [
  { top: "24%", left: "20%" },
  { top: "46%", left: "56%" },
  { top: "64%", left: "32%" },
  { top: "34%", left: "76%" },
];

/**
 * The visual stage for a tutorial scene: a schematic of the VITALIQ app with
 * numbered callouts, so each scene shows where the action happens. Tapping the
 * stage starts or pauses the walkthrough, like any video player.
 */
export default function VideoStage({ video, scene, playing, captions, onToggle, videoRef }) {
  if (video.videoUrl) {
    return (
      <VideoFrame
        video={video}
        scene={scene}
        playing={playing}
        captions={captions}
        onToggle={onToggle}
        videoRef={videoRef}
      />
    );
  }

  const activeIndex = Math.max(
    0,
    video.scenes.findIndex((item) => item.id === scene?.id),
  );

  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-[#060b14]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_15%_0%,rgba(34,211,238,0.16),transparent_58%)]" />

      <div className="relative flex items-center justify-between gap-2 border-b border-white/[0.07] px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
        </div>
        <p className="truncate text-[10.5px] uppercase tracking-[0.18em] text-white/35">
          vitaliqai.net · walkthrough
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
        <div className="absolute inset-0 flex flex-col gap-2.5 p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <Image
              src={BRAND_LOGO}
              alt=""
              className="h-6 w-6 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
              VITALIQ AI
            </span>
            <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[9.5px] uppercase tracking-[0.12em] text-white/35">
              {scene?.title}
            </span>
          </div>

          <div className="grid flex-1 grid-cols-3 gap-2">
            <div className="col-span-2 space-y-2">
              <div className="h-2/5 rounded-xl border border-white/10 bg-white/[0.05]" />
              <div className="grid grid-cols-3 gap-2">
                <div
                  className={`h-full rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] ${
                    playing ? "animate-pulse" : ""
                  }`}
                />
                <div className="h-full rounded-xl border border-white/10 bg-white/[0.04]" />
                <div className="h-full rounded-xl border border-white/10 bg-white/[0.04]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-1/3 rounded-xl border border-white/10 bg-white/[0.04]" />
              <div className="h-1/3 rounded-xl border border-white/10 bg-white/[0.04]" />
              <div className="h-1/4 rounded-xl border border-white/10 bg-white/[0.03]" />
            </div>
          </div>
        </div>

        {video.scenes.map((item, index) => {
          const active = index === activeIndex;
          const position = PIN_POSITIONS[index % PIN_POSITIONS.length];
          return (
            <div key={item.id} className="absolute" style={position}>
              <span className="relative grid h-6 w-6 place-items-center">
                {active && playing && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/40" />
                )}
                <span
                  className={`relative grid h-6 w-6 place-items-center rounded-full text-[10.5px] font-bold transition ${
                    active
                      ? "scale-110 bg-cyan-400 text-slate-950 shadow-[0_0_0_4px_rgba(34,211,238,0.25)]"
                      : "bg-white/10 text-white/45 ring-1 ring-white/15"
                  }`}
                >
                  {index + 1}
                </span>
              </span>
              {active && (
                <span className="absolute left-7 top-0 hidden whitespace-nowrap rounded-full border border-cyan-400/30 bg-[#061019]/95 px-2 py-1 text-[10px] font-medium text-cyan-200 sm:block">
                  {item.action}
                </span>
              )}
            </div>
          );
        })}

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
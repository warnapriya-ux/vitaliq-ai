import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Captions, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import VideoStage from "@/components/help/VideoStage";
import { voiceForScene } from "@/lib/tutorialVoices";
import { clockLabel, sceneAt, timedVideo } from "@/lib/tutorialTiming";

const SPEEDS = [1, 1.25, 1.5];

/**
 * A narrated walkthrough player. The timeline is built from the narration itself,
 * so the chapter, the transcript line and the spoken sentence always match.
 */
export default function VideoPlayer({ video, article }) {
  const timed = useMemo(() => timedVideo(video), [video]);
  const scenes = timed.scenes;
  const total = timed.total;

  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [captions, setCaptions] = useState(true);

  const audioRef = useRef(null);
  const loadedRef = useRef(0);

  const speed = SPEEDS[speedIndex];
  const activeIndex = useMemo(() => sceneAt(scenes, elapsed), [scenes, elapsed]);
  const scene = scenes[activeIndex];

  const loadScene = useCallback(
    (index, offset = 0) => {
      const audio = audioRef.current;
      const position = Math.max(0, Math.min(scenes.length - 1, index));
      const next = scenes[position];
      if (!audio || !next) return;
      const url = voiceForScene(next.id);
      if (audio.dataset.scene !== next.id) {
        audio.src = url;
        audio.dataset.scene = next.id;
      }
      try {
        audio.currentTime = Math.max(0, offset);
      } catch {
        // metadata still loading: the clip simply starts at zero
      }
      loadedRef.current = position;
      setElapsed(next.start + Math.max(0, offset));
    },
    [scenes],
  );

  useEffect(() => {
    const audio = audioRef.current;
    setPlaying(false);
    setElapsed(0);
    loadedRef.current = 0;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      delete audio.dataset.scene;
    }
  }, [video.id]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.playbackRate = speed;
  }, [speed, video.id]);

  const start = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (elapsed >= total - 0.1) loadScene(0, 0);
    else loadScene(activeIndex, Math.max(0, elapsed - scene.start));
    audio.play().catch(() => setPlaying(false));
    setPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const toggle = () => (playing ? pause() : start());

  const jump = (index) => {
    loadScene(index, 0);
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {});
    setPlaying(true);
  };

  const seek = (value) => {
    const next = Math.max(0, Math.min(total, value));
    const index = sceneAt(scenes, next);
    loadScene(index, next - scenes[index].start);
    if (playing) audioRef.current?.play().catch(() => {});
  };

  const handleTimeUpdate = (event) => {
    const audio = event.currentTarget;
    setElapsed(scenes[loadedRef.current].start + audio.currentTime);
  };

  const handleEnded = () => {
    const next = loadedRef.current + 1;
    if (next < scenes.length) {
      loadScene(next, 0);
      audioRef.current?.play().catch(() => setPlaying(false));
      return;
    }
    setPlaying(false);
    setElapsed(total);
  };

  return (
    <div className="space-y-3">
      <audio ref={audioRef} preload="auto" onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">
            Video {video.number} · {video.track} · {clockLabel(total)}
          </p>
          <h2 className="mt-1 font-heading text-[19px] font-semibold leading-tight text-white lg:text-[22px]">
            {video.title}
          </h2>
          <p className="mt-1 max-w-[620px] text-[12.5px] leading-relaxed text-white/60">
            {video.description}
          </p>
        </div>
        {article && (
          <Link
            to="/help/$articleId"
            params={{ articleId: article.id }}
            className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 text-[11.5px] font-semibold text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            <BookOpen className="h-3.5 w-3.5" /> Read the guide
          </Link>
        )}
      </div>

      <VideoStage
        video={video}
        scenes={scenes}
        scene={scene}
        activeIndex={activeIndex}
        playing={playing}
        captions={captions}
        onToggle={toggle}
      />

      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-400"
          style={{ width: `${Math.min(100, (elapsed / total) * 100)}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-2.5 py-2">
        <button
          type="button"
          onClick={() => jump(activeIndex - 1)}
          aria-label="Previous chapter"
          className="grid h-9 w-9 place-items-center rounded-full text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-10 w-10 place-items-center rounded-full bg-cyan-400 text-slate-950 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => jump(activeIndex + 1)}
          aria-label="Next chapter"
          className="grid h-9 w-9 place-items-center rounded-full text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <SkipForward className="h-4 w-4" />
        </button>
        <span className="text-[11px] tabular-nums text-white/50">
          {clockLabel(elapsed)} / {clockLabel(total)}
        </span>
        <input
          type="range"
          min={0}
          max={total}
          step={0.1}
          value={Math.min(elapsed, total)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Seek"
          className="h-1.5 min-w-[90px] flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-cyan-400"
        />
        <button
          type="button"
          onClick={() => setSpeedIndex((index) => (index + 1) % SPEEDS.length)}
          className="min-h-[32px] rounded-full border border-white/10 px-2.5 text-[11px] font-semibold tabular-nums text-white/65 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          {speed}×
        </button>
        <button
          type="button"
          onClick={() => setCaptions((value) => !value)}
          aria-pressed={captions}
          aria-label="Toggle captions"
          className={`grid h-8 w-8 place-items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
            captions ? "bg-cyan-400/15 text-cyan-300" : "text-white/45 hover:text-white"
          }`}
        >
          <Captions className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            pause();
            loadScene(0, 0);
          }}
          aria-label="Restart"
          className="grid h-8 w-8 place-items-center rounded-full text-white/45 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-2 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Chapters</p>
          <div className="mt-2 space-y-1">
            {scenes.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => jump(index)}
                className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                  index === activeIndex ? "bg-cyan-400/10 text-white" : "text-white/60 hover:bg-white/[0.05]"
                }`}
              >
                <span className="w-8 shrink-0 text-[10.5px] tabular-nums text-white/40">
                  {clockLabel(item.start)}
                </span>
                <span className="truncate text-[12px] font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Transcript</p>
          <div className="mt-2 space-y-2">
            {scenes.map((item, index) => (
              <p
                key={item.id}
                className={`text-[12px] leading-relaxed ${
                  index === activeIndex ? "text-white/85" : "text-white/45"
                }`}
              >
                <span className="mr-1.5 text-[10.5px] tabular-nums text-cyan-300/70">
                  {clockLabel(item.start)}
                </span>
                {item.transcript}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
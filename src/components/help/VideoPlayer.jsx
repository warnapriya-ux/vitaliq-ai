import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, Captions, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import VideoStage from "@/components/help/VideoStage";

const SPEEDS = [1, 1.25, 1.5];

function formatTime(value) {
  const total = Math.max(0, Math.floor(value));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** A captioned walkthrough player: scenes, callouts, chapters and a transcript. */
export default function VideoPlayer({ video, article }) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [captions, setCaptions] = useState(true);

  useEffect(() => {
    setPlaying(false);
    setTime(0);
  }, [video.id]);

  const speed = SPEEDS[speedIndex];
  const videoRef = useRef(null);

  const seekVideo = (next) => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    el.currentTime = next % el.duration;
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) el.play().catch(() => {});
    else el.pause();
  }, [playing, video.id]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.playbackRate = speed;
  }, [speed, video.id]);

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      setTime((previous) => {
        const next = previous + 0.25 * speed;
        if (next >= video.seconds) {
          setPlaying(false);
          return video.seconds;
        }
        return next;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [playing, speed, video.seconds]);

  const activeIndex = useMemo(() => {
    const index = video.scenes.findIndex((scene) => time >= scene.start && time < scene.end);
    return index === -1 ? video.scenes.length - 1 : index;
  }, [video.scenes, time]);

  const scene = video.scenes[activeIndex];

  const toggle = () => {
    if (time >= video.seconds) {
      setTime(0);
      seekVideo(0);
      setPlaying(true);
      return;
    }
    setPlaying((value) => !value);
  };

  const jump = (index) => {
    const clamped = Math.max(0, Math.min(video.scenes.length - 1, index));
    setTime(video.scenes[clamped].start);
    seekVideo(video.scenes[clamped].start);
    setPlaying(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">
            Video {video.number} · {video.track} · {video.duration}
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
        scene={scene}
        playing={playing}
        captions={captions}
        onToggle={toggle}
        videoRef={videoRef}
      />

      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-400"
          style={{ width: `${Math.min(100, (time / video.seconds) * 100)}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-2.5 py-2">
        <button
          type="button"
          onClick={() => jump(activeIndex - 1)}
          aria-label="Previous scene"
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
          aria-label="Next scene"
          className="grid h-9 w-9 place-items-center rounded-full text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <SkipForward className="h-4 w-4" />
        </button>
        <span className="text-[11px] tabular-nums text-white/50">
          {formatTime(time)} / {video.duration}
        </span>
        <input
          type="range"
          min={0}
          max={video.seconds}
          step={0.5}
          value={Math.min(time, video.seconds)}
          onChange={(event) => {
            const next = Number(event.target.value);
            setTime(next);
            seekVideo(next);
          }}
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
            setTime(0);
            seekVideo(0);
            setPlaying(false);
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
            {video.scenes.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => jump(index)}
                className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                  index === activeIndex ? "bg-cyan-400/10 text-white" : "text-white/60 hover:bg-white/[0.05]"
                }`}
              >
                <span className="w-8 shrink-0 text-[10.5px] tabular-nums text-white/40">
                  {formatTime(item.start)}
                </span>
                <span className="truncate text-[12px] font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Transcript</p>
          <div className="mt-2 space-y-2">
            {video.scenes.map((item, index) => (
              <p
                key={item.id}
                className={`text-[12px] leading-relaxed ${
                  index === activeIndex ? "text-white/85" : "text-white/45"
                }`}
              >
                <span className="mr-1.5 text-[10.5px] tabular-nums text-cyan-300/70">
                  {formatTime(item.start)}
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
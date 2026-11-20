import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Captions, Film, ShieldCheck, Smartphone } from "lucide-react";
import HelpLayout from "@/components/help/HelpLayout";
import VideoPlayer from "@/components/help/VideoPlayer";
import VideoRow from "@/components/help/VideoRow";
import { TUTORIAL_VIDEOS, articleById, videoById } from "@/lib/helpCenter";

const TRACKS = ["All", "Getting Started", "Core Modules", "Tracking & Security"];

const STANDARDS = [
  { icon: ShieldCheck, text: "Synthetic accounts only, never real member data." },
  { icon: Captions, text: "Synchronised captions with a written transcript." },
  { icon: Smartphone, text: "Readable on a phone as well as a desktop." },
];

export const Route = createFileRoute("/help/videos")({
  validateSearch: (search) => ({ v: typeof search.v === "string" ? search.v : undefined }),
  head: () => ({
    meta: [
      { title: "Video tutorials — VITALIQ AI Help Centre" },
      {
        name: "description",
        content:
          "Nine short VITALIQ AI walkthroughs with captions, chapters and transcripts: registration, profile, dashboard, coach, workouts, nutrition, progress and security.",
      },
    ],
  }),
  component: VideoLibrary,
});

function VideoLibrary() {
  const { v } = Route.useSearch();
  const navigate = useNavigate();
  const [track, setTrack] = useState("All");

  const active = videoById(v) ?? TUTORIAL_VIDEOS[0];
  const article = articleById(active.articleId);
  const listed = track === "All" ? TUTORIAL_VIDEOS : TUTORIAL_VIDEOS.filter((item) => item.track === track);

  return (
    <HelpLayout>
      <div className="space-y-4">
        <Link
          to="/help"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-[12px] font-medium text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <ArrowLeft className="h-4 w-4" /> Help Centre
        </Link>

        <header className="rounded-[26px] border border-white/10 bg-gradient-to-br from-sky-500/12 via-white/[0.04] to-transparent p-5">
          <p className="text-[12px] uppercase tracking-[0.22em] text-sky-300/80">
            Instructional video library
          </p>
          <h1 className="mt-2 font-heading text-[24px] font-semibold leading-tight text-white lg:text-[30px]">
            Guided walkthroughs, 60 to 90 seconds
          </h1>
          <p className="mt-2 max-w-[620px] text-[13px] leading-relaxed text-white/65">
            Each tutorial covers one task with screen callouts, chapters, captions and a transcript.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/65">
              <Film className="h-3 w-3 text-sky-300" /> {TUTORIAL_VIDEOS.length} tutorials
            </span>
            {STANDARDS.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/55"
                >
                  <Icon className="h-3 w-3 text-white/40" /> {item.text}
                </span>
              );
            })}
          </div>
        </header>

        <VideoPlayer video={active} article={article} />

        <section className="space-y-2.5 border-t border-white/[0.07] pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="text-[12px] uppercase tracking-[0.16em] text-white/50">All tutorials</p>
            <div className="flex flex-wrap gap-1">
              {TRACKS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTrack(item)}
                  aria-pressed={track === item}
                  className={`min-h-[32px] rounded-full px-2.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
                    track === item
                      ? "bg-white/[0.10] text-white"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 lg:grid-cols-2">
            {listed.map((video) => (
              <VideoRow
                key={video.id}
                video={video}
                active={video.id === active.id}
                onSelect={() => navigate({ to: "/help/videos", search: { v: video.id } })}
              />
            ))}
          </div>
        </section>
      </div>
    </HelpLayout>
  );
}
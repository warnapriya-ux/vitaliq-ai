import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Play } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { signUri } from "@/lib/files";
import { WORKOUT_CATEGORIES, LEVELS } from "@/lib/professional";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import GlassCard from "@/components/vitaliq/GlassCard";

function Chip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
        active ? "bg-cyan-400 text-slate-950" : "border border-white/10 bg-white/[0.03] text-white/55"
      }`}
    >
      {children}
    </button>
  );
}

export default function VirtualGym({ user }) {
  const [videos, setVideos] = useState([]);
  const [link, setLink] = useState(null);
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [videoPage, linkPage] = await Promise.all([
      base44.entities.VirtualGymVideo.list({ sort: "-created_date", limit: 100 }),
      base44.entities.GymClient.filter({ client_user_id: user.id }, { limit: 20 }),
    ]);
    const activeLink = (linkPage.items ?? []).find((l) => l.status === "active") ?? null;
    const all = videoPage.items ?? [];
    // A connected member sees their instructor's library first, then the shared catalogue.
    setLink(activeLink);
    setVideos(activeLink ? all.filter((v) => v.instructor_id === activeLink.instructor_id) : all);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function play(video) {
    const url = await signUri(video.video_url);
    if (url) setPlaying({ ...video, url });
  }

  const filtered = videos.filter(
    (video) => (!category || video.category === category) && (!level || video.level === level),
  );

  return (
    <div className="space-y-4">
      <SubPageHeader title="Virtual gym" subtitle={link ? link.instructor_name : "Exercise library"} />

      {!link && (
        <p className="text-[11px] leading-relaxed text-white/40">
          Connect a gym instructor to unlock their private programme library.
        </p>
      )}

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 no-scrollbar">
        <Chip active={!category} onClick={() => setCategory("")}>All categories</Chip>
        {WORKOUT_CATEGORIES.map((item) => (
          <Chip key={item} active={category === item} onClick={() => setCategory(item)}>{item}</Chip>
        ))}
      </div>
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 no-scrollbar">
        <Chip active={!level} onClick={() => setLevel("")}>Any level</Chip>
        {LEVELS.map((item) => (
          <Chip key={item} active={level === item} onClick={() => setLevel(item)}>{item}</Chip>
        ))}
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />
      ) : filtered.length === 0 ? (
        <GlassCard className="text-center">
          <p className="font-heading text-sm font-semibold text-white">No videos here yet</p>
          <p className="mt-1 text-xs text-white/40">Your instructor's uploads appear in this library.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((video) => (
            <button
              key={video.id}
              onClick={() => play(video)}
              className="rounded-[22px] border border-white/10 bg-white/[0.035] p-3.5 text-left transition hover:border-white/20"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/12 text-cyan-300">
                  <Play className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-medium text-white/85">{video.title}</p>
                  <p className="text-[10px] text-white/35">
                    {video.category} · {video.level} · {video.instructor_name}
                  </p>
                </div>
              </div>
              {video.description && <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/45">{video.description}</p>}
            </button>
          ))}
        </div>
      )}

      {playing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setPlaying(null)}>
          <div className="w-full max-w-lg">
            <video src={playing.url} controls autoPlay className="w-full rounded-2xl border border-white/10" />
            <p className="mt-2 text-center text-xs text-white/50">{playing.title} · tap outside to close</p>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Play, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { signUri } from "@/lib/files";

export default function ProfessionalCard({ pro, track, onRequest, requestState }) {
  const [video, setVideo] = useState("");

  async function openIntro() {
    const url = await signUri(pro.intro_video_url);
    if (url) setVideo(url);
  }

  const isGym = track === "gym";

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start gap-3">
        <Image
          src={pro.photo_url}
          alt={pro.name}
          className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-heading text-[15px] font-semibold text-white">{pro.name}</p>
              <p className="truncate text-[11px] text-white/40">
                {isGym ? pro.gym_location || pro.city : pro.city || "Online consultations"}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-400/10 px-2 py-1 text-[10px] font-semibold text-amber-300">
              <Star className="h-3 w-3 fill-amber-300" />
              {pro.rating ? pro.rating.toFixed(1) : "New"}
            </span>
          </div>

          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-white/50">{pro.bio || "Verified professional on VITALIQ AI."}</p>

          <div className="mt-2 flex flex-wrap gap-1">
            {(pro.specialisations || []).slice(0, 3).map((s) => (
              <span key={s} className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-white/55">{s}</span>
            ))}
          </div>

          <p className="mt-2 text-[10px] text-white/35">
            {pro.years_experience ? `${pro.years_experience} yrs experience` : "Experienced"} ·{" "}
            {(pro.languages || []).slice(0, 3).join(", ") || "English"}
          </p>
        </div>
      </div>

      {video && (
        <video src={video} controls className="mt-3 w-full rounded-2xl border border-white/10" />
      )}

      <div className="mt-3 flex gap-2">
        {pro.intro_video_url && (
          <Button variant="outline" className="h-11 flex-1 rounded-xl border-white/15 bg-transparent text-xs text-white/70" onClick={openIntro}>
            <Play className="mr-1.5 h-3.5 w-3.5" /> Introduction
          </Button>
        )}
        <Button
          className="h-11 flex-1 rounded-xl bg-cyan-400 text-xs font-semibold text-slate-950 hover:bg-cyan-300"
          onClick={() => onRequest(pro)}
          disabled={requestState?.status === "requested" || requestState?.status === "active"}
        >
          {requestState?.status === "active"
            ? "Connected"
            : requestState?.status === "requested"
              ? "Request sent"
              : "Request service"}
        </Button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ThumbsDown, ThumbsUp } from "lucide-react";

const ACTION =
  "inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3.5 text-[12px] font-semibold text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60";

export default function HelpfulVote() {
  const [vote, setVote] = useState(null);

  if (vote) {
    return (
      <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
        <p className="font-heading text-[13px] font-semibold text-white">
          {vote === "yes" ? "Glad it helped." : "Thanks, that is useful to know."}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/60">
          {vote === "yes"
            ? "Everything else is a tap away in the Help Centre."
            : "If this did not solve it, work through the troubleshooting guide or ask the team for a review from your profile."}
        </p>
        {vote === "no" && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/help/$articleId" params={{ articleId: "troubleshooting" }} className={ACTION}>
              Troubleshooting
            </Link>
            <Link to="/profile" className={ACTION}>
              Professional support
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
      <p className="font-heading text-[13px] font-semibold text-white">Was this helpful?</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setVote("yes")} className={ACTION}>
          <ThumbsUp className="h-3.5 w-3.5 text-emerald-300" /> Yes
        </button>
        <button type="button" onClick={() => setVote("no")} className={ACTION}>
          <ThumbsDown className="h-3.5 w-3.5 text-rose-300" /> Not really
        </button>
      </div>
    </div>
  );
}
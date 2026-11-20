import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

/** One search hit, linked to the article, video, fix or FAQ it came from. */
export default function SearchResultRow({ result }) {
  const className =
    "group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3.5 py-3 transition hover:border-cyan-400/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60";

  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-[13.5px] font-semibold leading-snug text-white">
          {result.title}
        </span>
        <span className="mt-1 block text-[12px] leading-relaxed text-white/60">{result.summary}</span>
        <span className="mt-1.5 block text-[11px] uppercase tracking-[0.14em] text-white/40">
          {result.meta}
        </span>
      </span>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-white/30 transition group-hover:text-cyan-300" />
    </>
  );

  if (result.kind === "video") {
    return (
      <Link to="/help/videos" search={{ v: result.id }} className={className}>
        {body}
      </Link>
    );
  }

  if (result.kind === "fix" || result.kind === "faq") {
    return (
      <Link to="/help/troubleshooting" hash={result.id} className={className}>
        {body}
      </Link>
    );
  }

  return (
    <Link to="/help/$articleId" params={{ articleId: result.id }} className={className}>
      {body}
    </Link>
  );
}
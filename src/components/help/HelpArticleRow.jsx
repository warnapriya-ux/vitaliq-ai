import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { categoryById } from "@/lib/helpCenter";

export default function HelpArticleRow({ article }) {
  const category = categoryById(article.category);

  return (
    <Link
      to="/help/$articleId"
      params={{ articleId: article.id }}
      className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3.5 py-3 transition hover:border-cyan-400/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 active:scale-[0.995]"
    >
      <div className="min-w-0 flex-1">
        <p className="font-heading text-[13.5px] font-semibold leading-snug text-white">
          {article.title}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/60">{article.summary}</p>
        <p className="mt-1.5 text-[11px] uppercase tracking-[0.14em] text-white/40">
          {category?.label} · {article.minutes} min read
        </p>
      </div>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-white/30 transition group-hover:text-cyan-300" />
    </Link>
  );
}
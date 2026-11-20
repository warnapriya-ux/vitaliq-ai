import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, PlayCircle, RefreshCw } from "lucide-react";
import HelpLayout from "@/components/help/HelpLayout";
import GlassCard from "@/components/vitaliq/GlassCard";
import HelpfulVote from "@/components/help/HelpfulVote";
import ArticleBody from "@/components/help/ArticleBody";
import { HELP_UPDATED, articleById, categoryById, videoForArticle } from "@/lib/helpCenter";

export const Route = createFileRoute("/help/$articleId")({
  head: ({ params }) => {
    const article = articleById(params.articleId);
    return {
      meta: [
        { title: `${article?.title ?? "Help"} — VITALIQ AI Help Centre` },
        {
          name: "description",
          content: article?.summary ?? "Guides and answers for the VITALIQ AI health platform.",
        },
      ],
    };
  },
  component: HelpArticle,
});

function HelpArticle() {
  const { articleId } = Route.useParams();
  const article = articleById(articleId);

  if (!article) {
    return (
      <HelpLayout>
        <GlassCard className="mx-auto max-w-[560px] text-center">
          <p className="font-heading text-[15px] font-semibold text-white">Guide not found</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">
            That guide has moved. Everything is listed in the Help Centre.
          </p>
          <Link
            to="/help"
            className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-cyan-400 px-4 text-[12px] font-semibold text-slate-950"
          >
            Back to the Help Centre
          </Link>
        </GlassCard>
      </HelpLayout>
    );
  }

  const category = categoryById(article.category);
  const video = article.videoId ? videoForArticle(article.id) : null;
  const related = (article.related ?? []).map(articleById).filter(Boolean);

  return (
    <HelpLayout>
      <article className="mx-auto w-full max-w-[760px] space-y-4">
        <Link
          to="/help"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-[12px] font-medium text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <ArrowLeft className="h-4 w-4" /> Help Centre
        </Link>

        <header>
          <p className="text-[12px] uppercase tracking-[0.2em] text-cyan-300/80">
            {category?.label} · Section {article.section}
          </p>
          <h1 className="mt-1.5 font-heading text-[24px] font-semibold leading-tight text-white lg:text-[30px]">
            {article.title}
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-white/65">{article.summary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/65">
              <Clock className="h-3 w-3 text-cyan-300" /> {article.minutes} min read
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/65">
              <RefreshCw className="h-3 w-3 text-emerald-300" /> Reviewed {HELP_UPDATED}
            </span>
            {video && (
              <Link
                to="/help/videos"
                search={{ v: video.id }}
                className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200 transition hover:border-cyan-300/50"
              >
                <PlayCircle className="h-3 w-3" /> Watch the walkthrough
              </Link>
            )}
          </div>
        </header>

        <ArticleBody article={article} />

        <HelpfulVote />

        {related.length > 0 && (
          <section className="space-y-2">
            <p className="px-1 text-[12px] uppercase tracking-[0.16em] text-white/50">
              Related guides
            </p>
            {related.map((item) => (
              <Link
                key={item.id}
                to="/help/$articleId"
                params={{ articleId: item.id }}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-3.5 py-3 transition hover:border-cyan-400/30 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <span className="font-heading text-[13px] font-semibold text-white/90">
                  {item.title}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:text-cyan-300" />
              </Link>
            ))}
          </section>
        )}

        <Link
          to="/help"
          className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-semibold text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          Back to the Help Centre
        </Link>
      </article>
    </HelpLayout>
  );
}
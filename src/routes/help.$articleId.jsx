import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clock, RefreshCw } from "lucide-react";
import HelpLayout from "@/components/help/HelpLayout";
import GlassCard from "@/components/vitaliq/GlassCard";
import HelpfulVote from "@/components/help/HelpfulVote";
import { articleById, categoryById } from "@/lib/helpCenter";

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
            {category?.label}
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
              <RefreshCw className="h-3 w-3 text-emerald-300" /> Reviewed {article.updated}
            </span>
          </div>
        </header>

        <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">Step by step</p>
          <ol className="mt-3 space-y-4">
            {article.steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-cyan-400/15 text-[11.5px] font-semibold text-cyan-300 ring-1 ring-cyan-400/30">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[13.5px] font-semibold leading-snug text-white">
                    {step.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/65">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {article.note && (
          <section className="rounded-[26px] border border-amber-300/25 bg-amber-300/[0.06] p-4 lg:p-5">
            <p className="flex items-center gap-1.5 font-heading text-[12.5px] font-semibold text-amber-200">
              <AlertTriangle className="h-3.5 w-3.5" /> Important
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/70">{article.note}</p>
          </section>
        )}

        {article.tips?.length > 0 && (
          <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
            <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">Good to know</p>
            <ul className="mt-2.5 space-y-2">
              {article.tips.map((tip) => (
                <li key={tip} className="flex gap-2 text-[13px] leading-relaxed text-white/65">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" /> {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {article.issues?.length > 0 && (
          <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
            <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">
              If something goes wrong
            </p>
            <div className="mt-2.5 space-y-3">
              {article.issues.map((issue) => (
                <div key={issue.problem}>
                  <p className="font-heading text-[13px] font-semibold text-white">{issue.problem}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-white/65">{issue.fix}</p>
                </div>
              ))}
            </div>
          </section>
        )}

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
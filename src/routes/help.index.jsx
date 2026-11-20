import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, Search, X } from "lucide-react";
import HelpLayout from "@/components/help/HelpLayout";
import GlassCard from "@/components/vitaliq/GlassCard";
import HelpCategoryCard from "@/components/help/HelpCategoryCard";
import HelpArticleRow from "@/components/help/HelpArticleRow";
import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  articlesIn,
  categoryById,
  searchHelpArticles,
} from "@/lib/helpCenter";

export const Route = createFileRoute("/help/")({
  head: () => ({
    meta: [
      { title: "Help Centre — VITALIQ AI user guide" },
      {
        name: "description",
        content:
          "Step-by-step guides for VITALIQ AI: create an account, build your health profile, use the AI coach, workout, nutrition and progress tools.",
      },
    ],
  }),
  component: HelpCentre,
});

function HelpCentre() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);

  const searching = query.trim().length > 0;
  const results = useMemo(() => searchHelpArticles(query), [query]);
  const listed = category ? articlesIn(category) : HELP_ARTICLES;
  const activeCategory = categoryById(category);

  return (
    <HelpLayout>
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-[26px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-white/[0.04] to-transparent p-5 lg:p-7">
          <p className="text-[12px] uppercase tracking-[0.24em] text-cyan-300/80">User guide</p>
          <h1 className="mt-2 font-heading text-[26px] font-semibold leading-tight text-white lg:text-[34px]">
            Everything VITALIQ can do
          </h1>
          <p className="mt-2 max-w-[620px] text-[13px] leading-relaxed text-white/65">
            Short guides written from the real screens. Search for a task, or start from a category
            below. Every article works on a phone.
          </p>
          <div className="relative mt-4 max-w-[560px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the guide…"
              aria-label="Search help articles"
              className="h-12 w-full rounded-2xl border border-white/10 bg-[#080d16]/75 pl-10 pr-11 text-[14px] text-white placeholder:text-white/45 focus:border-cyan-400/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-white/50 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>

        {searching ? (
          <section className="space-y-2">
            <p className="px-1 text-[12px] uppercase tracking-[0.16em] text-white/50">
              {results.length} {results.length === 1 ? "result" : "results"} for “{query.trim()}”
            </p>
            {results.length === 0 ? (
              <GlassCard className="text-center">
                <p className="font-heading text-[14px] font-semibold text-white">
                  No guide matches that yet
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">
                  Try a shorter phrase such as “password”, “workout” or “plan”, or start from the
                  troubleshooting guide.
                </p>
                <Link
                  to="/help/$articleId"
                  params={{ articleId: "troubleshooting" }}
                  className="mt-3 inline-flex min-h-[44px] items-center rounded-full bg-cyan-400 px-4 text-[12px] font-semibold text-slate-950"
                >
                  Open troubleshooting
                </Link>
              </GlassCard>
            ) : (
              results.map((article) => <HelpArticleRow key={article.id} article={article} />)
            )}
          </section>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
              {HELP_CATEGORIES.map((item) => (
                <HelpCategoryCard
                  key={item.id}
                  category={item}
                  count={articlesIn(item.id).length}
                  active={category === item.id}
                  onSelect={() => setCategory((current) => (current === item.id ? null : item.id))}
                />
              ))}
            </section>

            <section className="space-y-2">
              <div className="flex items-center justify-between gap-3 px-1">
                <p className="text-[12px] uppercase tracking-[0.16em] text-white/50">
                  {activeCategory ? activeCategory.label : "All guides"}
                </p>
                {activeCategory && (
                  <button
                    type="button"
                    onClick={() => setCategory(null)}
                    className="min-h-[36px] text-[12px] font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    Show all
                  </button>
                )}
              </div>
              <div className="grid gap-2 lg:grid-cols-2">
                {listed.map((article) => (
                  <HelpArticleRow key={article.id} article={article} />
                ))}
              </div>
            </section>

            <GlassCard className="border-white/10">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-rose-300 ring-1 ring-rose-400/25">
                  <LifeBuoy className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[13.5px] font-semibold text-white">Still stuck?</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/60">
                    Work through the troubleshooting guide first. If it is still not right, open your
                    profile inside the app and request a review from the professional team, telling
                    them what you already tried.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to="/help/$articleId"
                      params={{ articleId: "troubleshooting" }}
                      className="inline-flex min-h-[44px] items-center rounded-full bg-cyan-400 px-4 text-[12px] font-semibold text-slate-950"
                    >
                      Troubleshooting guide
                    </Link>
                    <Link
                      to="/"
                      className="inline-flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.05] px-4 text-[12px] font-semibold text-white/75"
                    >
                      Open my app
                    </Link>
                  </div>
                </div>
              </div>
            </GlassCard>
          </>
        )}
      </div>
    </HelpLayout>
  );
}
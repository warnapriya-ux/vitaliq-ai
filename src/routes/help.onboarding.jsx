import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, PlayCircle } from "lucide-react";
import HelpLayout from "@/components/help/HelpLayout";
import { ONBOARDING_STAGES, articleById, videoById } from "@/lib/helpCenter";

export const Route = createFileRoute("/help/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding path — VITALIQ AI Help Centre" },
      {
        name: "description",
        content:
          "The eight stage VITALIQ AI onboarding path, from registration and profile setup to workouts, nutrition, progress reports and a privacy review.",
      },
    ],
  }),
  component: OnboardingPath,
});

function OnboardingPath() {
  return (
    <HelpLayout>
      <div className="space-y-5">
        <Link
          to="/help"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-[12px] font-medium text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <ArrowLeft className="h-4 w-4" /> Help Centre
        </Link>

        <header className="rounded-[26px] border border-white/10 bg-gradient-to-br from-emerald-500/12 via-white/[0.04] to-transparent p-5">
          <p className="text-[12px] uppercase tracking-[0.22em] text-emerald-300/80">
            Onboarding & support
          </p>
          <h1 className="mt-2 font-heading text-[24px] font-semibold leading-tight text-white lg:text-[30px]">
            Your first eight steps
          </h1>
          <p className="mt-2 max-w-[620px] text-[13px] leading-relaxed text-white/65">
            Work down the path in order. Each stage has a written guide and a short walkthrough, so
            you can read or watch whichever suits you.
          </p>
        </header>

        <ol className="space-y-2.5">
          {ONBOARDING_STAGES.map((stage) => {
            const article = articleById(stage.articleId);
            const video = videoById(stage.videoId);
            return (
              <li
                key={stage.stage}
                className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4"
              >
                <div className="flex gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-400/15 text-[12px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                    {stage.stage}
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-[14px] font-semibold leading-snug text-white">
                      {stage.activity}
                    </p>
                    <p className="mt-0.5 text-[11.5px] uppercase tracking-[0.14em] text-white/40">
                      {stage.response}
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">
                      {stage.description}
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {article && (
                        <Link
                          to="/help/$articleId"
                          params={{ articleId: article.id }}
                          className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3 text-[11.5px] font-semibold text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        >
                          Read the guide <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                      {video && (
                        <Link
                          to="/help/videos"
                          search={{ v: video.id }}
                          className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 text-[11.5px] font-semibold text-cyan-200 transition hover:border-cyan-300/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        >
                          <PlayCircle className="h-3 w-3" /> Watch
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/help/troubleshooting"
            className="inline-flex min-h-[44px] items-center rounded-full bg-cyan-400 px-4 text-[12px] font-semibold text-slate-950"
          >
            Troubleshooting hub
          </Link>
          <Link
            to="/help"
            className="inline-flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.05] px-4 text-[12px] font-semibold text-white/75"
          >
            All guides
          </Link>
        </div>
      </div>
    </HelpLayout>
  );
}
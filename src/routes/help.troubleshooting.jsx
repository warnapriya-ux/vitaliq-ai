import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import HelpLayout from "@/components/help/HelpLayout";
import TroubleshootingList from "@/components/help/TroubleshootingList";
import FaqAccordion from "@/components/help/FaqAccordion";
import { FAQ_ITEMS, HEALTH_DISCLAIMER, TROUBLESHOOTING_ITEMS } from "@/lib/helpCenter";

export const Route = createFileRoute("/help/troubleshooting")({
  head: () => ({
    meta: [
      { title: "Troubleshooting & FAQs — VITALIQ AI Help Centre" },
      {
        name: "description",
        content:
          "Fix sign-in errors, missing verification codes, playback problems and profile issues in VITALIQ AI, and read the answers to common questions.",
      },
    ],
  }),
  component: TroubleshootingHub,
});

function TroubleshootingHub() {
  return (
    <HelpLayout>
      <div className="space-y-5">
        <Link
          to="/help"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-[12px] font-medium text-white/55 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
        >
          <ArrowLeft className="h-4 w-4" /> Help Centre
        </Link>

        <header className="rounded-[26px] border border-white/10 bg-gradient-to-br from-rose-500/12 via-white/[0.04] to-transparent p-5">
          <p className="text-[12px] uppercase tracking-[0.22em] text-rose-300/80">
            Troubleshooting hub
          </p>
          <h1 className="mt-2 font-heading text-[24px] font-semibold leading-tight text-white lg:text-[30px]">
            Fix the usual problems, then ask
          </h1>
          <p className="mt-2 max-w-[620px] text-[13px] leading-relaxed text-white/65">
            Work through the fix that matches your symptom. If nothing works, send a support request
            from your profile and tell the team what you already tried.
          </p>
        </header>

        <section className="space-y-2">
          <p className="px-1 text-[12px] uppercase tracking-[0.16em] text-white/50">
            Known issues
          </p>
          <TroubleshootingList items={TROUBLESHOOTING_ITEMS} />
        </section>

        <section className="space-y-2">
          <p className="flex items-center gap-1.5 px-1 text-[12px] uppercase tracking-[0.16em] text-white/50">
            <MessageCircleQuestion className="h-3.5 w-3.5 text-cyan-300" /> Frequently asked
          </p>
          <FaqAccordion items={FAQ_ITEMS} />
        </section>

        <section className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4 lg:p-5">
          <p className="text-[12px] uppercase tracking-[0.2em] text-white/50">
            Health and safety notice
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-white/65">{HEALTH_DISCLAIMER}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/help/videos"
              search={{ v: "vid-09" }}
              className="inline-flex min-h-[44px] items-center rounded-full bg-cyan-400 px-4 text-[12px] font-semibold text-slate-950"
            >
              Watch the security tutorial
            </Link>
            <Link
              to="/help/onboarding"
              className="inline-flex min-h-[44px] items-center rounded-full border border-white/10 bg-white/[0.05] px-4 text-[12px] font-semibold text-white/75"
            >
              Onboarding path
            </Link>
          </div>
        </section>
      </div>
    </HelpLayout>
  );
}
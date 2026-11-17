import { createFileRoute, Link } from "@tanstack/react-router";
import { Dumbbell, Salad } from "lucide-react";
import { useProfessional } from "@/components/pro/useProfessional";
import ProShell from "@/components/pro/ProShell";

export const Route = createFileRoute("/_authed/pro/")({
  head: () => ({ meta: [{ title: "Professional portal — VITALIQ AI" }] }),
  component: ProHome,
});

function ProHome() {
  const gym = useProfessional("gym");
  const diet = useProfessional("diet");

  return (
    <ProShell track="gym">
      <div className="space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Professional portal</p>
          <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">Work with clients on VITALIQ AI</h1>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/40">
            Instructors and dietitians run separate practices here: their own registration, subscription, clients and
            programmes. Choose the practice that fits your qualification.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <PracticeCard
            icon={Dumbbell}
            tone="cyan"
            title="Gym instructor"
            text="Register with your certifications, pick a package from 5 to 25 clients, and deliver workout programmes with video and voice instructions."
            status={gym.profile ? `${gym.profile.plan} · ${gym.profile.status}` : "Not registered"}
            register="/pro/instructor/register"
            dashboard="/pro/instructor"
            hasAccount={!!gym.profile}
          />
          <PracticeCard
            icon={Salad}
            tone="emerald"
            title="Dietitian"
            text="Register with your licence and qualifications, manage meal plans, daily food logs and nutrition compliance for each customer."
            status={diet.profile ? `${diet.profile.plan} · ${diet.profile.status}` : "Not registered"}
            register="/pro/dietitian/register"
            dashboard="/pro/dietitian"
            hasAccount={!!diet.profile}
          />
        </div>

        <p className="text-[10px] leading-relaxed text-white/30">
          Registration is reviewed by the VITALIQ AI team. Your account is activated once your qualifications and payment
          are verified.
        </p>
      </div>
    </ProShell>
  );
}

function PracticeCard({ icon: Icon, tone, title, text, status, register, dashboard, hasAccount }) {
  const accent = tone === "emerald" ? "text-emerald-300 bg-emerald-400/12" : "text-cyan-300 bg-cyan-400/12";
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
      <span className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </span>
      <h2 className="mt-3 font-heading text-base font-semibold text-white">{title}</h2>
      <p className="mt-1 text-[11px] leading-relaxed text-white/45">{text}</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/30">{status}</p>
      <Link
        to={hasAccount ? dashboard : register}
        className={`mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl text-[12px] font-semibold ${
          tone === "emerald" ? "bg-emerald-400 text-slate-950" : "bg-cyan-400 text-slate-950"
        }`}
      >
        {hasAccount ? "Open dashboard" : "Start registration"}
      </Link>
    </div>
  );
}
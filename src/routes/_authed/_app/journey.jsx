import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  ClipboardList,
  CreditCard,
  Dumbbell,
  Sparkles,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import PageTitle from "@/components/vitaliq/PageTitle";
import JourneyProgress from "@/components/vitaliq/journey/JourneyProgress";
import JourneyStep from "@/components/vitaliq/journey/JourneyStep";
import { useVitaliq } from "@/hooks/useVitaliq";

export const Route = createFileRoute("/_authed/_app/journey")({
  head: () => ({ meta: [{ title: "Your journey — VITALIQ AI" }] }),
  component: JourneyPage,
});

function buildStages({ profile, subscription, diet, workout, today, logs, measurements }) {
  const tracking = Boolean(today || logs.length || measurements.length);
  const hasPlans = Boolean(diet || workout);

  return [
    {
      icon: UserPlus,
      title: "Create your account",
      detail: "Your private space in VITALIQ AI. Health data is only visible to you and your assigned professionals.",
      done: true,
    },
    {
      icon: ClipboardList,
      title: "Complete your health profile",
      detail: "Body metrics, activity level, food preference and any conditions shape everything that follows.",
      done: Boolean(profile),
      to: "/onboarding",
    },
    {
      icon: CreditCard,
      title: "Choose your plan",
      detail: "Unlock AI plans, form coaching and expert reviews on the tier that fits your goal.",
      done: subscription?.status === "active",
      to: "/plans",
    },
    {
      icon: Sparkles,
      title: "Get your AI diet and workout plans",
      detail: "Personalised meals and sessions generated from your profile, ready to review with an expert.",
      done: hasPlans,
      to: "/nutrition",
    },
    {
      icon: Activity,
      title: "Log your days and measurements",
      detail: "Steps, sleep, water, weight and body measurements feed your progress charts and AI advice.",
      done: tracking,
      to: "/insights",
    },
    {
      icon: Dumbbell,
      title: "Train with VITALIQ Coach",
      detail: "Camera form checks count your reps and speak corrections, or upload a recorded set for review.",
      done: Boolean(today?.workout_done),
      to: "/trainer",
    },
    {
      icon: Bot,
      title: "Ask VITALIQ Coach anything",
      detail: "Your coach reads your recent logs and answers questions on training, nutrition and recovery.",
      done: false,
      to: "/coach",
    },
    {
      icon: Stethoscope,
      title: "Expert review and follow-up",
      detail: "A dietitian or trainer reviews AI drafts, approves them and schedules consultations when needed.",
      done: hasPlans && subscription?.status === "active",
      to: "/console",
    },
  ];
}

function JourneyPage() {
  const vitaliq = useVitaliq();
  const stages = buildStages(vitaliq);
  const done = stages.filter((s) => s.done).length;
  const nextIndex = stages.findIndex((s) => !s.done);

  return (
    <div className="space-y-4">
      <PageTitle eyebrow="How VITALIQ works" title="Your journey" />
      <JourneyProgress done={done} total={stages.length} />

      <div className="space-y-2">
        <p className="px-1 text-[10px] uppercase tracking-[0.24em] text-white/35">From first check-in to real results</p>
        <ol className="space-y-2.5">
          {stages.map((stage, i) => (
            <JourneyStep
              key={stage.title}
              index={i + 1}
              icon={stage.icon}
              title={stage.title}
              detail={stage.detail}
              to={stage.to}
              state={stage.done ? "done" : i === nextIndex ? "next" : "todo"}
              last={i === stages.length - 1}
            />
          ))}
        </ol>
      </div>

      <p className="px-1 text-[10px] leading-relaxed text-white/30">
        VITALIQ AI offers general wellness guidance, not medical advice. Consult a clinician for any health condition.
      </p>
    </div>
  );
}
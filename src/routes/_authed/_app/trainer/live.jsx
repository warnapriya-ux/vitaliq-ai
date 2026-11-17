import { createFileRoute } from "@tanstack/react-router";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import LiveTrainer from "@/components/trainer/LiveTrainer";

export const Route = createFileRoute("/_authed/_app/trainer/live")({
  head: () => ({ meta: [{ title: "Live form check — VITALIQ AI" }] }),
  component: LiveTrainerPage,
});

function LiveTrainerPage() {
  return (
    <div className="space-y-4">
      <SubPageHeader subtitle="AI personal trainer" title="Live form check" />
      <LiveTrainer />
    </div>
  );
}
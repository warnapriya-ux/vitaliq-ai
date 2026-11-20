import { createFileRoute } from "@tanstack/react-router";
import ProfessionalAdmin from "@/components/console/ProfessionalAdmin";

export const Route = createFileRoute("/_authed/_console/command/instructors")({
  head: () => ({ meta: [{ title: "VITALIQ Command — Gym instructors" }] }),
  component: () => <ProfessionalAdmin track="gym" />,
});
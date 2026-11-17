import { createFileRoute } from "@tanstack/react-router";
import ProfessionalAdmin from "@/components/console/ProfessionalAdmin";

export const Route = createFileRoute("/_authed/_console/command/dietitians")({
  head: () => ({ meta: [{ title: "VITALIQ Command — Dietitians" }] }),
  component: () => <ProfessionalAdmin track="diet" />,
});
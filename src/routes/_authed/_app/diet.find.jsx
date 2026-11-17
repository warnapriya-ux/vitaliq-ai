import { createFileRoute } from "@tanstack/react-router";
import FinderScreen from "@/components/pro/FinderScreen";

export const Route = createFileRoute("/_authed/_app/diet/find")({
  head: () => ({ meta: [{ title: "Find a dietitian — VITALIQ AI" }] }),
  component: () => <FinderScreen track="diet" />,
});
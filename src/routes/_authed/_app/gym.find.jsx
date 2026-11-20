import { createFileRoute } from "@tanstack/react-router";
import FinderScreen from "@/components/pro/FinderScreen";

export const Route = createFileRoute("/_authed/_app/gym/find")({
  head: () => ({ meta: [{ title: "Find a gym instructor — VITALIQ AI" }] }),
  component: () => <FinderScreen track="gym" />,
});
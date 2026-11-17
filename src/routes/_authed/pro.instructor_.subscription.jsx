import { createFileRoute } from "@tanstack/react-router";
import ProShell from "@/components/pro/ProShell";
import SubscriptionRenewal from "@/components/pro/SubscriptionRenewal";

export const Route = createFileRoute("/_authed/pro/instructor_/subscription")({
  head: () => ({ meta: [{ title: "Instructor subscription — VITALIQ AI" }] }),
  component: Page,
});

function Page() {
  return (
    <ProShell track="gym">
      <SubscriptionRenewal track="gym" />
    </ProShell>
  );
}
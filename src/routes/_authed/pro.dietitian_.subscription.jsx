import { createFileRoute } from "@tanstack/react-router";
import ProShell from "@/components/pro/ProShell";
import SubscriptionRenewal from "@/components/pro/SubscriptionRenewal";

export const Route = createFileRoute("/_authed/pro/dietitian_/subscription")({
  head: () => ({ meta: [{ title: "Dietitian subscription — VITALIQ AI" }] }),
  component: Page,
});

function Page() {
  return (
    <ProShell track="diet">
      <SubscriptionRenewal track="diet" />
    </ProShell>
  );
}
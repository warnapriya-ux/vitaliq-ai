import { createFileRoute } from "@tanstack/react-router";
import ProShell from "@/components/pro/ProShell";
import ProRegisterForm from "@/components/pro/ProRegisterForm";

export const Route = createFileRoute("/_authed/pro/dietitian_/register")({
  head: () => ({ meta: [{ title: "Dietitian registration — VITALIQ AI" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <ProShell track="diet">
      <ProRegisterForm track="diet" />
    </ProShell>
  );
}
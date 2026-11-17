import { createFileRoute } from "@tanstack/react-router";
import ProShell from "@/components/pro/ProShell";
import ProRegisterForm from "@/components/pro/ProRegisterForm";

export const Route = createFileRoute("/_authed/pro/instructor_/register")({
  head: () => ({ meta: [{ title: "Instructor registration — VITALIQ AI" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <ProShell track="gym">
      <ProRegisterForm track="gym" />
    </ProShell>
  );
}
import { createFileRoute, Outlet } from "@tanstack/react-router";
import DesktopShell from "@/components/console/DesktopShell";

export const Route = createFileRoute("/_authed/_console")({
  ssr: false,
  component: ConsoleLayout,
});

function ConsoleLayout() {
  return (
    <DesktopShell>
      <Outlet />
    </DesktopShell>
  );
}
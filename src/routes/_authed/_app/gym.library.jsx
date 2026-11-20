import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/AuthContext";
import VirtualGym from "@/components/pro/VirtualGym";

export const Route = createFileRoute("/_authed/_app/gym/library")({
  head: () => ({ meta: [{ title: "Virtual gym — VITALIQ AI" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const { user, isLoadingAuth } = useAuth();
  if (isLoadingAuth || !user) return <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />;
  return <VirtualGym user={user} />;
}
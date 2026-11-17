import { Link } from "@tanstack/react-router";
import { ChevronRight, UserRound } from "lucide-react";
import { formatDate } from "@/lib/health";

export default function ClientList({ track, links, actionLabel = "Open plan" }) {
  if (!links.length) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/35">
        No active clients yet. Accepted requests appear here.
      </p>
    );
  }

  const planRoute = track === "diet" ? "/pro/dietitian/plans" : "/pro/instructor/plans";

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <div key={link.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/50">
            <UserRound className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-white/85">{link.client_name}</p>
            <p className="truncate text-[10px] text-white/35">
              {link.goal || "General programme"} · since {formatDate(link.started_on)}
            </p>
          </div>
          <Link to={planRoute} className="flex shrink-0 items-center gap-1 rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-[10px] font-medium text-white/65">
            {actionLabel} <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      ))}
    </div>
  );
}
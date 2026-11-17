import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authed/_console/command/professionals")({
  head: () => ({ meta: [{ title: "VITALIQ Command — Professionals" }] }),
  component: ProfessionalsPage,
});

function ProfessionalsPage() {
  const [pros, setPros] = useState([]);

  const load = useCallback(async () => {
    const page = await base44.entities.Professional.list({ sort: "-created_date", limit: 100 });
    setPros(page.items ?? []);
  }, []);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function setStatus(pro, status) {
    try {
      await base44.entities.Professional.update(pro.id, { status });
      await load();
      toast.success(`${pro.name} is now ${status}`);
    } catch (error) {
      console.error(error);
      toast.error("Could not update this professional.");
    }
  }

  const pending = pros.filter((p) => p.status === "pending");

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Super admin</p>
        <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">Professionals</h1>
        <p className="mt-1 text-xs text-white/40">
          Verify dietitians and trainers before they can review client plans. {pending.length} awaiting verification.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2">
        {pros.map((pro) => (
          <Panel key={pro.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-heading text-sm font-semibold text-white">{pro.name}</p>
                  <StatusPill tone={pro.specialization === "dietitian" ? "green" : "blue"}>{pro.specialization}</StatusPill>
                </div>
                <p className="mt-0.5 text-[11px] text-white/35">{pro.credentials}</p>
              </div>
              <StatusPill tone={statusTone(pro.status)}>{pro.status}</StatusPill>
            </div>
            {pro.bio && <p className="mt-2 text-[11px] leading-relaxed text-white/45">{pro.bio}</p>}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[10px] text-white/30">
                {pro.email} · {pro.country} · {pro.client_count ?? 0} clients{pro.rating ? ` · ★ ${pro.rating}` : ""}
              </p>
              <div className="flex gap-2">
                {pro.status !== "approved" && (
                  <Button size="sm" onClick={() => setStatus(pro, "approved")} className="h-8 rounded-full bg-emerald-400 px-3 text-[11px] font-semibold text-slate-950 hover:bg-emerald-300">
                    Approve
                  </Button>
                )}
                {pro.status !== "suspended" && (
                  <Button size="sm" variant="ghost" onClick={() => setStatus(pro, "suspended")} className="h-8 rounded-full text-[11px] text-rose-300 hover:bg-rose-500/10">
                    Suspend
                  </Button>
                )}
              </div>
            </div>
          </Panel>
        ))}
        {pros.length === 0 && <Panel>No professionals registered yet.</Panel>}
      </div>
    </div>
  );
}
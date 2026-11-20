import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/console/Panel";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import SubPageHeader from "@/components/vitaliq/SubPageHeader";
import StatusPill, { statusTone } from "@/components/console/StatusPill";
import { formatDate } from "@/lib/health";

export const Route = createFileRoute("/_authed/_console/console/consultations")({
  head: () => ({ meta: [{ title: "VITALIQ Professional — Consultations" }] }),
  component: ConsultationsPage,
});

const OPTIONS = ["requested", "scheduled", "completed", "cancelled"];

function ConsultationsPage() {
  const [rows, setRows] = useState([]);

  const load = useCallback(async () => {
    const page = await base44.entities.Consultation.list({ sort: "-created_date", limit: 50 });
    setRows(page.items ?? []);
  }, []);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function update(row, patch) {
    try {
      await base44.entities.Consultation.update(row.id, patch);
      await load();
      toast.success("Consultation updated");
    } catch (error) {
      console.error(error);
      toast.error("Could not update the consultation.");
    }
  }

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <SubPageHeader subtitle="Professional portal" title="Consultations" to="/console" />
      </div>
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Professional portal</p>
        <h1 className="mt-1.5 font-heading text-2xl font-semibold text-white">Consultations</h1>
        <p className="mt-1 text-xs text-white/40">Requests from clients, scheduled sessions and follow-ups.</p>
      </header>

      <Panel>
        <div className="space-y-2">
          {rows.length === 0 && <p className="text-xs text-white/35">No consultations yet.</p>}
          {rows.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
              <div className="min-w-[180px] flex-1">
                <p className="text-[12px] font-semibold text-white">{row.client_name || row.client_email}</p>
                <p className="text-[12px] text-white/60">
                  {row.topic} · {row.professional_name || "unassigned"}
                  {row.scheduled_for ? ` · ${formatDate(row.scheduled_for)}` : ""}
                </p>
              </div>
              <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
              <div className="w-[150px]">
                <SelectSheet
                  label="Consultation status"
                  value={row.status}
                  options={OPTIONS.map((option) => ({ value: option, label: option }))}
                  onChange={(value) => update(row, { status: value })}
                />
              </div>
              <input
                type="datetime-local"
                value={row.scheduled_for?.slice(0, 16) ?? ""}
                onChange={(event) => update(row, { scheduled_for: event.target.value })}
                className="h-11 rounded-lg border border-white/10 bg-[#0b1220] px-2 text-[12px] text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
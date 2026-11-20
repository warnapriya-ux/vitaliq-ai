import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { LayoutTemplate, Pencil, Plus, Send, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import TemplateEditDialog from "@/components/pro/TemplateEditDialog";
import AssignTemplateDialog from "@/components/pro/AssignTemplateDialog";
import { Button } from "@/components/ui/button";

export default function WorkoutTemplateLibrary({ profile, links }) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [assigning, setAssigning] = useState(null);

  const active = links.filter((link) => link.status === "active");

  const load = useCallback(async () => {
    if (!user) return;
    const page = await base44.entities.WorkoutTemplate.filter(
      { instructor_user_id: user.id },
      { sort: "-created_date", limit: 100 },
    );
    setTemplates(page.items ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load().catch((error) => console.error(error));
  }, [load]);

  async function remove(template) {
    try {
      await base44.entities.WorkoutTemplate.delete(template.id);
      toast.success("Template deleted.");
      await load();
    } catch (error) {
      toast.error("Could not delete this template.");
    }
  }

  function openNew() {
    setEditing(null);
    setEditOpen(true);
  }

  function openEdit(template) {
    setEditing(template);
    setEditOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-heading text-sm font-semibold text-white">Workout template library</p>
          <p className="text-[11px] text-white/35">Reuse a proven programme instead of rebuilding it for every client.</p>
        </div>
        <Button onClick={openNew} className="h-10 shrink-0 rounded-xl bg-cyan-400 text-[12px] font-semibold text-slate-950 hover:bg-cyan-300">
          <Plus className="mr-1.5 h-4 w-4" /> New template
        </Button>
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-[26px] bg-white/5" />
      ) : templates.length === 0 ? (
        <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-6 text-center">
          <LayoutTemplate className="mx-auto h-6 w-6 text-white/25" />
          <p className="mt-2 text-[12px] text-white/55">No templates yet</p>
          <p className="mt-1 text-[11px] text-white/30">
            Build one here, or save any plan from the plan builder as a template.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((template) => (
            <div key={template.id} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-white/90">{template.title}</p>
                  <p className="mt-0.5 text-[10px] text-white/35">
                    {template.level} · {template.days?.length ?? 0} days
                    {template.goal ? ` · ${template.goal}` : ""}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/25">
                    {template.use_count ? `Used ${template.use_count}×` : "Not used yet"}
                    {template.last_used_on ? ` · last ${template.last_used_on}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(template)} className="grid h-8 w-8 place-items-center rounded-lg text-white/35 hover:text-cyan-300">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(template)} className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:text-rose-300">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {template.summary && <p className="mt-2 line-clamp-2 text-[11px] text-white/45">{template.summary}</p>}

              <div className="mt-3 flex flex-wrap gap-1">
                {(template.days ?? []).slice(0, 4).map((day, index) => (
                  <span key={index} className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[9px] text-white/45">
                    {day.day}{day.focus ? ` · ${day.focus}` : ""}
                  </span>
                ))}
              </div>

              <Button
                onClick={() => setAssigning(template)}
                disabled={!active.length}
                className="mt-3 h-10 w-full rounded-xl bg-white/[0.07] text-[12px] font-semibold text-white hover:bg-white/[0.12] disabled:opacity-40"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {active.length ? "Assign to a client" : "No active clients yet"}
              </Button>
            </div>
          ))}
        </div>
      )}

      <TemplateEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        template={editing}
        profile={profile}
        onSaved={load}
      />
      <AssignTemplateDialog
        open={Boolean(assigning)}
        onOpenChange={(value) => !value && setAssigning(null)}
        template={assigning}
        links={active}
        onAssigned={load}
      />
    </div>
  );
}
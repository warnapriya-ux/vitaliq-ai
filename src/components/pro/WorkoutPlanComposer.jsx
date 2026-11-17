import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Mic, Sparkles, Square, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { generateWorkoutPlan } from "@/lib/professional-fns";
import { LEVELS } from "@/lib/professional";
import { useVoiceInput } from "@/components/pro/useVoiceInput";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const inputClass = "h-9 border-white/10 bg-[#0b1220] text-[12px] text-white";

const blankDraft = () => ({
  title: "Custom programme",
  goal: "",
  level: "beginner",
  summary: "",
  days: [{ day: "Day 1", focus: "", exercises: [{ name: "", sets: "3", reps: "10", rest: "60s", notes: "" }] }],
});

export default function WorkoutPlanComposer({ links, onSaved }) {
  const [linkId, setLinkId] = useState(links[0]?.id ?? "");
  const [mode, setMode] = useState("ai");
  const [transcript, setTranscript] = useState("");
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const generate = useServerFn(generateWorkoutPlan);

  const { listening, supported, toggle } = useVoiceInput((text) =>
    setTranscript((current) => `${current} ${text}`.trim()),
  );

  const client = useMemo(() => links.find((link) => link.id === linkId), [links, linkId]);

  async function run() {
    if (!linkId) return toast.error("Select a client first.");
    if (mode === "manual") {
      setDraft(blankDraft());
      return;
    }
    setBusy(true);
    try {
      const plan = await generate({ data: { linkId, transcript: transcript.trim() || undefined, mode } });
      setDraft({ ...plan, level: LEVELS.includes(plan.level) ? plan.level : "beginner" });
    } catch (error) {
      toast.error(error?.message || "Could not generate the plan.");
    } finally {
      setBusy(false);
    }
  }

  function setDay(index, patch) {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, i) => (i === index ? { ...day, ...patch } : day)),
    }));
  }

  function setExercise(dayIndex, exIndex, patch) {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, i) =>
        i === dayIndex
          ? { ...day, exercises: day.exercises.map((ex, j) => (j === exIndex ? { ...ex, ...patch } : ex)) }
          : day,
      ),
    }));
  }

  async function save(status) {
    if (!draft || !client) return;
    setSaving(true);
    try {
      await base44.entities.WorkoutPlan.create({
        instructor_id: client.instructor_id,
        instructor_user_id: client.instructor_user_id,
        instructor_name: client.instructor_name,
        client_user_id: client.client_user_id,
        client_name: client.client_name,
        title: draft.title || "Workout programme",
        goal: draft.goal,
        level: draft.level,
        summary: draft.summary,
        source: mode,
        status,
        approved_at: status === "approved" ? new Date().toISOString() : undefined,
        days: draft.days.map((day) => ({
          day: day.day,
          focus: day.focus,
          exercises: (day.exercises || []).map((ex) => ({ ...ex, ai_generated: mode !== "manual" })),
        })),
      });
      toast.success(status === "approved" ? "Plan sent to your client." : "Draft saved.");
      setDraft(null);
      setTranscript("");
      await onSaved();
    } catch (error) {
      toast.error("Could not save the plan.");
    } finally {
      setSaving(false);
    }
  }

  if (!links.length) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/40">
        Accept a client request first, then you can build their programme.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Create a workout plan</p>
      <SelectSheet
        label="Client"
        value={linkId}
        onChange={setLinkId}
        options={links.map((link) => ({ value: link.id, label: `${link.client_name}${link.goal ? ` · ${link.goal}` : ""}` }))}
      />
      <div className="flex gap-2">
        {[
          { id: "ai", label: "AI assisted", icon: Sparkles },
          { id: "voice", label: "Voice", icon: Mic },
          { id: "manual", label: "Manual", icon: null },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setMode(option.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-[11px] transition ${
              mode === option.id ? "border-cyan-400/50 bg-cyan-400/[0.08] text-white" : "border-white/10 text-white/50"
            }`}
          >
            {option.icon && <option.icon className="h-3.5 w-3.5" />}
            {option.label}
          </button>
        ))}
      </div>

      {mode !== "manual" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] text-white/50">
              {mode === "voice" ? "Speak your instructions" : "Anything specific for this plan?"}
            </Label>
            {supported && (
              <button
                type="button"
                onClick={toggle}
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
                  listening ? "bg-rose-400/15 text-rose-300" : "bg-white/[0.06] text-white/55"
                }`}
              >
                {listening ? <Square className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                {listening ? "Stop" : "Speak"}
              </button>
            )}
          </div>
          <Textarea
            rows={3}
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Five day programme for this client. Monday chest and triceps, Tuesday back and biceps, Wednesday cardio, Thursday shoulders, Friday legs. Beginner fat-loss focus."
            className="border-white/10 bg-[#0b1220] text-[12px] text-white"
          />
          <Button onClick={run} disabled={busy} className="h-11 w-full rounded-xl bg-cyan-400 text-sm font-semibold text-slate-950 hover:bg-cyan-300">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {busy ? "Building programme…" : "Generate plan"}
          </Button>
        </div>
      )}

      {mode === "manual" && !draft && (
        <Button onClick={run} className="h-11 w-full rounded-xl bg-white/[0.07] text-sm font-semibold text-white hover:bg-white/[0.1]">
          Start a blank programme
        </Button>
      )}

      {draft && (
        <div className="space-y-3 border-t border-white/10 pt-3">
          <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={inputClass} placeholder="Plan title" />
          <Textarea rows={2} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} className="border-white/10 bg-[#0b1220] text-[12px] text-white" placeholder="Coach summary" />
          <SelectSheet label="Level" value={draft.level} onChange={(value) => setDraft({ ...draft, level: value })} options={LEVELS.map((l) => ({ value: l, label: l }))} />

          {draft.days.map((day, dayIndex) => (
            <div key={`${day.day}-${dayIndex}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="grid grid-cols-2 gap-2">
                <Input value={day.day} onChange={(event) => setDay(dayIndex, { day: event.target.value })} className={inputClass} placeholder="Day" />
                <Input value={day.focus} onChange={(event) => setDay(dayIndex, { focus: event.target.value })} className={inputClass} placeholder="Focus" />
              </div>
              <div className="mt-2 space-y-2">
                {(day.exercises || []).map((ex, exIndex) => (
                  <div key={exIndex} className="space-y-1.5 rounded-xl bg-white/[0.03] p-2">
                    <div className="flex gap-1.5">
                      <Input value={ex.name} onChange={(event) => setExercise(dayIndex, exIndex, { name: event.target.value })} className={inputClass} placeholder="Exercise" />
                      <button
                        type="button"
                        onClick={() =>
                          setDay(dayIndex, { exercises: day.exercises.filter((_, i) => i !== exIndex) })
                        }
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/30 hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <Input value={ex.sets} onChange={(event) => setExercise(dayIndex, exIndex, { sets: event.target.value })} className={inputClass} placeholder="Sets" />
                      <Input value={ex.reps} onChange={(event) => setExercise(dayIndex, exIndex, { reps: event.target.value })} className={inputClass} placeholder="Reps" />
                      <Input value={ex.rest} onChange={(event) => setExercise(dayIndex, exIndex, { rest: event.target.value })} className={inputClass} placeholder="Rest" />
                    </div>
                    <Input value={ex.notes} onChange={(event) => setExercise(dayIndex, exIndex, { notes: event.target.value })} className={inputClass} placeholder="Coaching note" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setDay(dayIndex, { exercises: [...(day.exercises || []), { name: "", sets: "3", reps: "10", rest: "60s", notes: "" }] })
                  }
                  className="w-full rounded-lg border border-dashed border-white/15 py-1.5 text-[10px] text-white/40"
                >
                  + Add exercise
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setDraft({
                ...draft,
                days: [...draft.days, { day: `Day ${draft.days.length + 1}`, focus: "", exercises: [] }],
              })
            }
            className="w-full rounded-xl border border-dashed border-white/15 py-2 text-[11px] text-white/45"
          >
            + Add training day
          </button>

          <div className="flex gap-2">
            <Button onClick={() => save("draft")} disabled={saving} variant="outline" className="h-11 flex-1 rounded-xl border-white/15 bg-transparent text-xs text-white/70">
              Save draft
            </Button>
            <Button onClick={() => save("approved")} disabled={saving} className="h-11 flex-1 rounded-xl bg-cyan-400 text-xs font-semibold text-slate-950 hover:bg-cyan-300">
              Approve & send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
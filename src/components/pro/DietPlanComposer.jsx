import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Mic, Sparkles, Square, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { generateDietPlan } from "@/lib/professional-fns";
import { useVoiceInput } from "@/components/pro/useVoiceInput";
import SelectSheet from "@/components/vitaliq/SelectSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const inputClass = "h-9 border-white/10 bg-[#0b1220] text-[12px] text-white";

const blankMeal = (meal, time) => ({
  time,
  meal,
  detail: "",
  portion: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  prep: "",
  alternatives: "",
});

const blankDraft = () => ({
  title: "Custom meal plan",
  goal: "",
  summary: "",
  target_calories: 1800,
  days: [
    {
      day: "Day 1",
      meals: [
        blankMeal("Breakfast", "7:00 AM"),
        blankMeal("Morning snack", "10:00 AM"),
        blankMeal("Lunch", "1:00 PM"),
        blankMeal("Evening snack", "4:00 PM"),
        blankMeal("Dinner", "7:00 PM"),
      ],
    },
  ],
});

export default function DietPlanComposer({ links, onSaved }) {
  const [linkId, setLinkId] = useState(links[0]?.id ?? "");
  const [mode, setMode] = useState("ai");
  const [transcript, setTranscript] = useState("");
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const generate = useServerFn(generateDietPlan);
  const { listening, supported, toggle } = useVoiceInput((text) =>
    setTranscript((current) => `${current} ${text}`.trim()),
  );

  const client = useMemo(() => links.find((link) => link.id === linkId), [links, linkId]);

  async function run() {
    if (!linkId) return toast.error("Select a customer first.");
    if (mode === "manual") {
      setDraft(blankDraft());
      return;
    }
    setBusy(true);
    try {
      const plan = await generate({ data: { linkId, transcript: transcript.trim() || undefined, days: 7 } });
      setDraft(plan);
    } catch (error) {
      toast.error(error?.message || "Could not generate the plan.");
    } finally {
      setBusy(false);
    }
  }

  function setMeal(dayIndex, mealIndex, patch) {
    setDraft((current) => ({
      ...current,
      days: current.days.map((day, i) =>
        i === dayIndex ? { ...day, meals: day.meals.map((meal, j) => (j === mealIndex ? { ...meal, ...patch } : meal)) } : day,
      ),
    }));
  }

  async function save(status) {
    if (!draft || !client) return;
    setSaving(true);
    try {
      await base44.entities.DietPlan.create({
        dietitian_id: client.dietitian_id,
        dietitian_user_id: client.dietitian_user_id,
        dietitian_name: client.dietitian_name,
        client_user_id: client.client_user_id,
        client_name: client.client_name,
        title: draft.title || "Meal plan",
        goal: draft.goal,
        summary: draft.summary,
        target_calories: Number(draft.target_calories) || undefined,
        source: mode,
        status,
        approved_at: status === "approved" ? new Date().toISOString() : undefined,
        days: draft.days,
      });
      toast.success(status === "approved" ? "Meal plan sent to your customer." : "Draft saved.");
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
        Accept a customer request first, then you can build their meal plan.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-[26px] border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Create a diet plan</p>
      <SelectSheet
        label="Customer"
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
              mode === option.id ? "border-emerald-400/50 bg-emerald-400/[0.08] text-white" : "border-white/10 text-white/50"
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
              {mode === "voice" ? "Speak your instructions" : "Focus for this plan?"}
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
            placeholder="Seven day balanced meal plan for gradual weight reduction. Breakfast, lunch, dinner and two snacks. Prefers rice and fish, no beef."
            className="border-white/10 bg-[#0b1220] text-[12px] text-white"
          />
          <Button onClick={run} disabled={busy} className="h-11 w-full rounded-xl bg-emerald-400 text-sm font-semibold text-slate-950 hover:bg-emerald-300">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {busy ? "Building meal plan…" : "Generate 7-day plan"}
          </Button>
        </div>
      )}

      {mode === "manual" && !draft && (
        <Button onClick={run} className="h-11 w-full rounded-xl bg-white/[0.07] text-sm font-semibold text-white hover:bg-white/[0.1]">
          Start a blank day
        </Button>
      )}

      {draft && (
        <div className="space-y-3 border-t border-white/10 pt-3">
          <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={inputClass} placeholder="Plan title" />
          <Textarea rows={2} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} className="border-white/10 bg-[#0b1220] text-[12px] text-white" placeholder="Guidance summary" />
          <div className="grid grid-cols-2 gap-2">
            <Input
              inputMode="numeric"
              value={draft.target_calories ?? ""}
              onChange={(event) => setDraft({ ...draft, target_calories: event.target.value })}
              className={inputClass}
              placeholder="Daily calories"
            />
            <Input value={draft.goal ?? ""} onChange={(event) => setDraft({ ...draft, goal: event.target.value })} className={inputClass} placeholder="Goal" />
          </div>

          {draft.days.map((day, dayIndex) => (
            <div key={`${day.day}-${dayIndex}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <Input
                value={day.day}
                onChange={(event) =>
                  setDraft({ ...draft, days: draft.days.map((d, i) => (i === dayIndex ? { ...d, day: event.target.value } : d)) })
                }
                className={inputClass}
                placeholder="Day label"
              />
              <div className="mt-2 space-y-2">
                {day.meals.map((meal, mealIndex) => (
                  <div key={`${meal.meal}-${mealIndex}`} className="space-y-1.5 rounded-xl bg-white/[0.03] p-2">
                    <div className="flex gap-1.5">
                      <Input value={meal.time} onChange={(event) => setMeal(dayIndex, mealIndex, { time: event.target.value })} className={inputClass} placeholder="Time" />
                      <Input value={meal.meal} onChange={(event) => setMeal(dayIndex, mealIndex, { meal: event.target.value })} className={inputClass} placeholder="Meal" />
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            days: draft.days.map((d, i) => (i === dayIndex ? { ...d, meals: d.meals.filter((_, j) => j !== mealIndex) } : d)),
                          })
                        }
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/30 hover:text-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Input value={meal.detail} onChange={(event) => setMeal(dayIndex, mealIndex, { detail: event.target.value })} className={inputClass} placeholder="Foods" />
                    <div className="grid grid-cols-3 gap-1.5">
                      <Input value={meal.portion} onChange={(event) => setMeal(dayIndex, mealIndex, { portion: event.target.value })} className={inputClass} placeholder="Portion" />
                      <Input inputMode="numeric" value={meal.calories} onChange={(event) => setMeal(dayIndex, mealIndex, { calories: Number(event.target.value) || 0 })} className={inputClass} placeholder="kcal" />
                      <Input value={meal.alternatives} onChange={(event) => setMeal(dayIndex, mealIndex, { alternatives: event.target.value })} className={inputClass} placeholder="Swap" />
                    </div>
                    <Input value={meal.prep} onChange={(event) => setMeal(dayIndex, mealIndex, { prep: event.target.value })} className={inputClass} placeholder="Preparation" />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      days: draft.days.map((d, i) => (i === dayIndex ? { ...d, meals: [...d.meals, blankMeal("Snack", "4:00 PM")] } : d)),
                    })
                  }
                  className="w-full rounded-lg border border-dashed border-white/15 py-1.5 text-[10px] text-white/40"
                >
                  + Add meal
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setDraft({ ...draft, days: [...draft.days, { day: `Day ${draft.days.length + 1}`, meals: [blankMeal("Breakfast", "7:00 AM")] }] })}
            className="w-full rounded-xl border border-dashed border-white/15 py-2 text-[11px] text-white/45"
          >
            + Add day
          </button>

          <div className="flex gap-2">
            <Button onClick={() => save("draft")} disabled={saving} variant="outline" className="h-11 flex-1 rounded-xl border-white/15 bg-transparent text-xs text-white/70">
              Save draft
            </Button>
            <Button onClick={() => save("approved")} disabled={saving} className="h-11 flex-1 rounded-xl bg-emerald-400 text-xs font-semibold text-slate-950 hover:bg-emerald-300">
              Approve & send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
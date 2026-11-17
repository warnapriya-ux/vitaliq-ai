import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</Label>
      {children}
    </div>
  );
}

const SELECT = "h-10 w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 text-sm text-white focus:border-cyan-400/60 focus:outline-none";

export default function ProfileForm({ initial = {}, onSubmit, saving, submitLabel = "Save profile" }) {
  const [form, setForm] = useState({
    display_name: "",
    gender: "female",
    birth_date: "",
    height_cm: "",
    current_weight: "",
    target_weight: "",
    body_type: "average",
    activity_level: "medium",
    lifestyle: "office",
    food_preference: "non_vegetarian",
    experience: "beginner",
    program: "women",
    country: "",
    city: "",
    conditions: "",
    consent: true,
    ...initial,
  });

  const set = (key) => (event) => setForm((f) => ({ ...f, [key]: event.target.value }));

  function submit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      height_cm: Number(form.height_cm) || null,
      current_weight: Number(form.current_weight) || null,
      target_weight: Number(form.target_weight) || null,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full name">
          <Input required value={form.display_name} onChange={set("display_name")} placeholder="Your name" />
        </Field>
        <Field label="Date of birth">
          <Input type="date" value={form.birth_date?.slice(0, 10) || ""} onChange={set("birth_date")} />
        </Field>
        <Field label="Programme">
          <select className={SELECT} value={form.program} onChange={set("program")}>
            <option value="women">Women's health & fitness</option>
            <option value="men">Men's health & fitness</option>
            <option value="general">General wellness</option>
          </select>
        </Field>
        <Field label="Gender">
          <select className={SELECT} value={form.gender} onChange={set("gender")}>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Height (cm)">
          <Input type="number" step="0.1" value={form.height_cm ?? ""} onChange={set("height_cm")} placeholder="165" />
        </Field>
        <Field label="Current weight (kg)">
          <Input type="number" step="0.1" value={form.current_weight ?? ""} onChange={set("current_weight")} placeholder="72.4" />
        </Field>
        <Field label="Target weight (kg)">
          <Input type="number" step="0.1" value={form.target_weight ?? ""} onChange={set("target_weight")} placeholder="65" />
        </Field>
        <Field label="Body type">
          <select className={SELECT} value={form.body_type} onChange={set("body_type")}>
            <option value="slim">Slim</option>
            <option value="average">Average</option>
            <option value="overweight">Overweight</option>
            <option value="obese">Obese</option>
          </select>
        </Field>
        <Field label="Activity level">
          <select className={SELECT} value={form.activity_level} onChange={set("activity_level")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </Field>
        <Field label="Lifestyle">
          <select className={SELECT} value={form.lifestyle} onChange={set("lifestyle")}>
            <option value="office">Office</option>
            <option value="active">Active</option>
            <option value="physical">Physical work</option>
          </select>
        </Field>
        <Field label="Food preference">
          <select className={SELECT} value={form.food_preference} onChange={set("food_preference")}>
            <option value="vegetarian">Vegetarian</option>
            <option value="non_vegetarian">Non-vegetarian</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Fitness experience">
          <select className={SELECT} value={form.experience} onChange={set("experience")}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>
        <Field label="City">
          <Input value={form.city ?? ""} onChange={set("city")} placeholder="Colombo" />
        </Field>
        <Field label="Country">
          <Input value={form.country ?? ""} onChange={set("country")} placeholder="Sri Lanka" />
        </Field>
      </div>
      <Field label="Health considerations">
        <textarea
          rows={3}
          value={form.conditions ?? ""}
          onChange={set("conditions")}
          placeholder="Injuries, medical conditions, allergies, pregnancy…"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-cyan-400/60 focus:outline-none"
        />
      </Field>
      <Button
        type="submit"
        disabled={saving}
        className="w-full rounded-full bg-gradient-to-r from-cyan-300 to-cyan-500 py-5 text-sm font-semibold text-slate-950 hover:opacity-90"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
      </Button>
    </form>
  );
}
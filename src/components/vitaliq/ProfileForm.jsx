import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SelectSheet from "@/components/vitaliq/SelectSheet";

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</Label>
      {children}
    </div>
  );
}

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
  const setValue = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

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
          <SelectSheet
            label="Programme"
            value={form.program}
            onChange={setValue("program")}
            options={[
              { value: "women", label: "Women's health & fitness" },
              { value: "men", label: "Men's health & fitness" },
              { value: "general", label: "General wellness" },
            ]}
          />
        </Field>
        <Field label="Gender">
          <SelectSheet
            label="Gender"
            value={form.gender}
            onChange={setValue("gender")}
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
              { value: "other", label: "Other" },
            ]}
          />
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
          <SelectSheet
            label="Body type"
            value={form.body_type}
            onChange={setValue("body_type")}
            options={[
              { value: "slim", label: "Slim" },
              { value: "average", label: "Average" },
              { value: "overweight", label: "Overweight" },
              { value: "obese", label: "Obese" },
            ]}
          />
        </Field>
        <Field label="Activity level">
          <SelectSheet
            label="Activity level"
            value={form.activity_level}
            onChange={setValue("activity_level")}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />
        </Field>
        <Field label="Lifestyle">
          <SelectSheet
            label="Lifestyle"
            value={form.lifestyle}
            onChange={setValue("lifestyle")}
            options={[
              { value: "office", label: "Office" },
              { value: "active", label: "Active" },
              { value: "physical", label: "Physical work" },
            ]}
          />
        </Field>
        <Field label="Food preference">
          <SelectSheet
            label="Food preference"
            value={form.food_preference}
            onChange={setValue("food_preference")}
            options={[
              { value: "vegetarian", label: "Vegetarian" },
              { value: "non_vegetarian", label: "Non-vegetarian" },
              { value: "other", label: "Other" },
            ]}
          />
        </Field>
        <Field label="Fitness experience">
          <SelectSheet
            label="Fitness experience"
            value={form.experience}
            onChange={setValue("experience")}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
            ]}
          />
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
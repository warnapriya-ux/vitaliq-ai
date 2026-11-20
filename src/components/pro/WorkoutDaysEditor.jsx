import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const inputClass = "h-9 border-white/10 bg-[#0b1220] text-[12px] text-white";
const blankExercise = { name: "", sets: "3", reps: "10", rest: "60s", notes: "" };

export default function WorkoutDaysEditor({ days = [], onChange }) {
  function setDay(index, patch) {
    onChange(days.map((day, i) => (i === index ? { ...day, ...patch } : day)));
  }

  function setExercise(dayIndex, exIndex, patch) {
    onChange(
      days.map((day, i) =>
        i === dayIndex
          ? { ...day, exercises: (day.exercises ?? []).map((ex, j) => (j === exIndex ? { ...ex, ...patch } : ex)) }
          : day,
      ),
    );
  }

  return (
    <div className="space-y-2">
      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="rounded-2xl border border-white/10 bg-white/[0.03] p-2.5">
          <div className="flex gap-1.5">
            <Input value={day.day} onChange={(event) => setDay(dayIndex, { day: event.target.value })} className={inputClass} placeholder="Day" />
            <Input value={day.focus} onChange={(event) => setDay(dayIndex, { focus: event.target.value })} className={inputClass} placeholder="Focus" />
            <button
              type="button"
              onClick={() => onChange(days.filter((_, i) => i !== dayIndex))}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/25 hover:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 space-y-1.5">
            {(day.exercises ?? []).map((ex, exIndex) => (
              <div key={exIndex} className="space-y-1.5 rounded-xl bg-white/[0.03] p-2">
                <div className="flex gap-1.5">
                  <Input value={ex.name} onChange={(event) => setExercise(dayIndex, exIndex, { name: event.target.value })} className={inputClass} placeholder="Exercise" />
                  <button
                    type="button"
                    onClick={() => setDay(dayIndex, { exercises: (day.exercises ?? []).filter((_, i) => i !== exIndex) })}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/25 hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <Input value={ex.sets} onChange={(event) => setExercise(dayIndex, exIndex, { sets: event.target.value })} className={inputClass} placeholder="Sets" />
                  <Input value={ex.reps} onChange={(event) => setExercise(dayIndex, exIndex, { reps: event.target.value })} className={inputClass} placeholder="Reps" />
                  <Input value={ex.rest} onChange={(event) => setExercise(dayIndex, exIndex, { rest: event.target.value })} className={inputClass} placeholder="Rest" />
                </div>
                <Input value={ex.notes ?? ""} onChange={(event) => setExercise(dayIndex, exIndex, { notes: event.target.value })} className={inputClass} placeholder="Coaching note" />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setDay(dayIndex, { exercises: [...(day.exercises ?? []), { ...blankExercise }] })}
              className="w-full rounded-lg border border-dashed border-white/15 py-1.5 text-[10px] text-white/40"
            >
              + Add exercise
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...days, { day: `Day ${days.length + 1}`, focus: "", exercises: [{ ...blankExercise }] }])}
        className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 py-2 text-[11px] text-white/45"
      >
        <Plus className="h-3 w-3" /> Add training day
      </button>
    </div>
  );
}
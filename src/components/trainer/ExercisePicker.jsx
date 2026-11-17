import { EXERCISES } from "@/lib/exercises";

export default function ExercisePicker({ value, onChange, disabled }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {EXERCISES.map((exercise) => {
        const active = exercise.id === value;
        return (
          <button
            key={exercise.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(exercise.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition ${
              active
                ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white"
            } disabled:opacity-40`}
          >
            {exercise.name}
          </button>
        );
      })}
    </div>
  );
}
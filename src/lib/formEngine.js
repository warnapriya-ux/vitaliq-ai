import { angleAt, midpoint, tiltFromVertical } from "@/lib/poseMetrics";
import { exerciseById } from "@/lib/exercises";

const PENALTY = { high: 7, medium: 4, low: 2 };

function workingAngle(landmarks, exercise) {
  const values = exercise.chain
    .map(([a, b, c]) => angleAt(landmarks[a], landmarks[b], landmarks[c]))
    .filter((value) => value != null);
  if (!values.length) return null;
  if (exercise.aggregate === "min") return Math.min(...values);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function bodyTilt(landmarks) {
  const shoulders = midpoint(landmarks[11], landmarks[12]);
  const hips = midpoint(landmarks[23], landmarks[24]);
  return shoulders && hips ? tiltFromVertical(hips, shoulders) : 0;
}

function bodyLine(landmarks) {
  const values = [angleAt(landmarks[11], landmarks[23], landmarks[27]), angleAt(landmarks[12], landmarks[24], landmarks[28])].filter(
    (value) => value != null,
  );
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function formWarnings(landmarks, exercise) {
  const found = [];
  const checks = exercise.checks ?? [];

  if (checks.includes("kneesIn") && landmarks[25] && landmarks[26] && landmarks[27] && landmarks[28]) {
    const knees = Math.abs(landmarks[25].x - landmarks[26].x);
    const ankles = Math.abs(landmarks[27].x - landmarks[28].x);
    if (ankles > 0.04 && knees < ankles * 0.62) {
      found.push({ code: "kneesIn", severity: "high", text: "Knees are caving inward. Push them out over your toes." });
    }
  }
  if (checks.includes("trunkLean") && bodyTilt(landmarks) > 42) {
    found.push({ code: "trunkLean", severity: "medium", text: "You are folding forward. Chest up and brace your core." });
  }
  if (checks.includes("bodySwing") && bodyTilt(landmarks) > 14) {
    found.push({ code: "bodySwing", severity: "medium", text: "You are swinging the weight. Keep your torso still." });
  }
  if (checks.includes("hipSag")) {
    const line = bodyLine(landmarks);
    if (line != null && line < 150) {
      found.push({ code: "hipSag", severity: "medium", text: "Hips are sagging or piking. Build one straight line." });
    }
  }
  return found;
}

// One engine per session: feed it landmarks, read back reps, score and spoken cues.
export function createFormEngine(id) {
  const exercise = exerciseById(id);
  const state = {
    reps: 0,
    phase: "ready",
    min: 180,
    hold: 0,
    penalties: 0,
    warnings: [],
    cueAt: {},
    warnCount: {},
    lastRep: 0,
    lastFrame: 0,
  };

  const score = () => Math.max(40, Math.round(100 - state.penalties));

  function cue(key, text, out, now, cooldown) {
    if ((state.cueAt[key] ?? -1e9) + cooldown > now) return;
    state.cueAt[key] = now;
    out.speak.push(text);
  }

  function addWarning(warning, out, now) {
    if (!state.warnings.some((item) => item.code === warning.code)) {
      state.warnings = [...state.warnings, { code: warning.code, text: warning.text, severity: warning.severity }];
    }
    const seen = state.warnCount[warning.code] ?? 0;
    if (seen < 3) {
      state.warnCount[warning.code] = seen + 1;
      state.penalties += PENALTY[warning.severity] ?? 3;
    }
    cue(`warn-${warning.code}`, warning.text, out, now, 7000);
  }

  function completeRep(out, now) {
    const gap = state.lastRep ? now - state.lastRep : 0;
    state.lastRep = now;
    if (state.min > exercise.flexed + 25 && (state.warnCount.range ?? 0) < 3) {
      state.warnCount.range = (state.warnCount.range ?? 0) + 1;
      state.penalties += 5;
      addWarning({ code: "range", severity: "medium", text: "Short range of motion. Own the full rep." }, out, now);
    }
    state.min = 180;
    out.reps = state.reps;
    out.score = score();
    if (gap && gap < 700) cue("tempo", "A little slower. Control the movement.", out, now, 6000);
    else if (state.reps % 5 === 0) cue("milestone", `${state.reps} reps. Keep your form tight.`, out, now, 3000);
    else cue("top", exercise.cues.top, out, now, 4500);
  }

  return {
    exercise,
    update(landmarks, now) {
      const out = {
        angle: null,
        phase: state.phase,
        reps: state.reps,
        score: score(),
        hold: Math.round(state.hold),
        warnings: state.warnings,
        speak: [],
      };
      if (!landmarks) {
        state.lastFrame = now;
        return out;
      }
      const value = workingAngle(landmarks, exercise);
      if (value == null) {
        state.lastFrame = now;
        return out;
      }
      out.angle = Math.round(value);
      const delta = state.lastFrame ? Math.min(300, now - state.lastFrame) : 0;
      state.lastFrame = now;

      if (exercise.static) {
        if (value >= exercise.target) {
          state.hold += delta / 1000;
          cue("hold", `${Math.round(state.hold)} seconds. Keep breathing.`, out, now, 10000);
        } else {
          addWarning({ code: "lineBroken", severity: "medium", text: "Hips drifted. Squeeze your glutes and rebuild the line." }, out, now);
          state.penalties += 0.05;
        }
        out.hold = Math.round(state.hold);
        out.score = score();
        return out;
      }

      if (value > exercise.extended - 15) {
        if (state.phase === "down") {
          state.phase = "up";
          state.reps += 1;
          completeRep(out, now);
        } else {
          state.phase = "up";
        }
      } else if (value < exercise.flexed + 20) {
        if (state.phase !== "down") {
          state.phase = "down";
          cue("bottom", exercise.cues.bottom, out, now, 6000);
        }
        state.min = Math.min(state.min, value);
      }

      for (const warning of formWarnings(landmarks, exercise)) addWarning(warning, out, now);

      out.phase = state.phase;
      out.reps = state.reps;
      out.score = score();
      out.warnings = state.warnings;
      return out;
    },
    snapshot(seconds) {
      return { reps: state.reps, score: score(), hold: Math.round(state.hold), seconds, warnings: state.warnings };
    },
  };
}
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function shiftISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function bmi(weight, heightCm) {
  if (!weight || !heightCm) return null;
  const m = heightCm / 100;
  return Math.round((weight / (m * m)) * 10) / 10;
}

export function bmiLabel(value) {
  if (value == null) return "—";
  if (value < 18.5) return "Underweight";
  if (value < 25) return "Healthy";
  if (value < 30) return "Overweight";
  return "Obese";
}

export function goalPercent(current, target, start) {
  const from = start ?? current;
  if (!current || !target) return 0;
  if (from === target) return current === target ? 100 : 0;
  const pct = ((from - current) / (from - target)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function ageFrom(birthDate) {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export function planItems(plan) {
  return Array.isArray(plan?.items) ? plan.items : [];
}

export const PLAN_TIERS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    tagline: "Start with a basic health assessment",
    features: ["Health profile & BMI", "Body measurement log", "Basic daily dashboard"],
  },
  {
    id: "basic",
    name: "Basic",
    price: 12,
    tagline: "Nutrition and fitness foundations",
    features: ["Everything in Free", "AI workout of the day", "Daily calorie and macro targets", "Daily activity tracking"],
  },
  {
    id: "premium",
    name: "Premium",
    price: 24,
    tagline: "Full AI nutrition and fitness programmes",
    features: ["Everything in Basic", "Personalised AI diet plan", "Personalised AI workout plan", "Body analysis and progress insights"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 49,
    tagline: "AI plus a real dietitian and coach",
    features: ["Everything in Premium", "Dietitian plan review", "Trainer consultations", "Priority support"],
  },
  {
    id: "family",
    name: "Family",
    price: 69,
    tagline: "Up to five family profiles",
    features: ["Everything in Professional", "5 member profiles", "Shared progress reports"],
  },
];

export function profileSummary(profile, latest) {
  if (!profile) return "No profile yet.";
  const parts = [
    `Name: ${profile.display_name || "Client"}`,
    profile.gender && `Gender: ${profile.gender}`,
    profile.birth_date && `Age: ${ageFrom(profile.birth_date) ?? "unknown"}`,
    profile.height_cm && `Height: ${profile.height_cm} cm`,
    `Current weight: ${latest?.weight ?? profile.current_weight ?? "unknown"} kg`,
    `Target weight: ${profile.target_weight ?? "unknown"} kg`,
    profile.body_type && `Body type: ${profile.body_type}`,
    profile.activity_level && `Activity level: ${profile.activity_level}`,
    profile.lifestyle && `Lifestyle: ${profile.lifestyle}`,
    profile.food_preference && `Food preference: ${profile.food_preference}`,
    profile.experience && `Fitness experience: ${profile.experience}`,
    profile.program && `Programme: ${profile.program}`,
    profile.conditions && `Health considerations: ${profile.conditions}`,
  ];
  return parts.filter(Boolean).join(". ");
}

export function recentSummary(logs = []) {
  return logs
    .slice(0, 7)
    .map(
      (l) =>
        `${l.log_date}: ${l.steps ?? 0} steps, ${l.water_l ?? 0}L water, ${l.calories_in ?? 0} kcal in, ${l.calories_burned ?? 0} kcal burned, sleep ${l.sleep_hours ?? 0}h, workout ${l.workout_done ? "done" : "not done"}, diet adherence ${l.diet_adherence ?? 0}%`,
    )
    .join("\n");
}
// Local sample data for the first render. Replaced by real records in the next step.
export const demo = {
  name: "Sarah",
  plan: "Premium",
  percent: 78,
  current: 72.4,
  target: 65,
  toGo: 7.4,
  stats: [
    { label: "Steps", value: "7,850", icon: "steps" },
    { label: "Water", value: "2.0 L", icon: "water" },
    { label: "Calories", value: "420", icon: "calories" },
    { label: "Sleep", value: "7.5 h", icon: "sleep" },
  ],
  advice: "Great progress! Keep up your workout and follow your diet plan.",
  workout: { title: "Lower Body Strength", duration: "20 min", detail: "3 Sets × 15 Reps" },
  diet: ["Breakfast · Oats + Fruits", "Lunch · Grilled Chicken Salad", "Dinner · Veggie Bowl"],
  progress: [
    { label: "Weight", value: "-7.4 kg", pct: 74, from: "#4ade80", to: "#22d3ee" },
    { label: "Waist", value: "92 cm", pct: 62, from: "#38bdf8", to: "#818cf8" },
    { label: "Plan", value: "88%", pct: 88, from: "#a78bfa", to: "#f472b6" },
    { label: "Workout", value: "95%", pct: 95, from: "#fbbf24", to: "#fb7185" },
  ],
};
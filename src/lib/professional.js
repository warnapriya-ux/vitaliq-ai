import { base44 } from "@/api/base44Client";

export const PRO_PLANS = [
  { id: "basic", name: "Basic", clients: 5, reports: "Basic" },
  { id: "medium", name: "Medium", clients: 10, reports: "Advanced" },
  { id: "ultra", name: "Ultra", clients: 25, reports: "Advanced" },
];

export const DEFAULT_PRICES = {
  gym_instructor: {
    basic: { monthly: 29, annual: 290 },
    medium: { monthly: 59, annual: 590 },
    ultra: { monthly: 99, annual: 990 },
  },
  dietitian: {
    basic: { monthly: 39, annual: 390 },
    medium: { monthly: 69, annual: 690 },
    ultra: { monthly: 119, annual: 1190 },
  },
};

export const TRACKS = {
  gym: {
    id: "gym",
    label: "Gym instructor",
    short: "Instructor",
    plural: "Instructors",
    entity: "GymInstructor",
    subscription: "GymSubscription",
    link: "GymClient",
    plan: "WorkoutPlan",
    priceTrack: "gym_instructor",
    route: "/pro/instructor",
    register: "/pro/instructor/register",
    find: "/gym/find",
    accent: "cyan",
    features: [
      "Client profiles",
      "Workout plans",
      "Video instructions",
      "Voice instructions",
      "Client progress",
      "Virtual gym",
      "AI assistance",
    ],
  },
  diet: {
    id: "diet",
    label: "Dietitian",
    short: "Dietitian",
    plural: "Dietitians",
    entity: "Dietitian",
    subscription: "DietitianSubscription",
    link: "DietitianClient",
    plan: "DietPlan",
    priceTrack: "dietitian",
    route: "/pro/dietitian",
    register: "/pro/dietitian/register",
    find: "/diet/find",
    accent: "emerald",
    features: [
      "Client profiles",
      "Personalised diet plans",
      "Daily meal schedules",
      "Voice instructions",
      "AI diet assistance",
      "Progress monitoring",
      "Food library",
      "Reports",
    ],
  },
};

// Stable handles: the same object every call, so effects do not re-run on render.
const STORES = {
  gym: {
    profile: base44.entities.GymInstructor,
    subscription: base44.entities.GymSubscription,
    link: base44.entities.GymClient,
    plan: base44.entities.WorkoutPlan,
  },
  diet: {
    profile: base44.entities.Dietitian,
    subscription: base44.entities.DietitianSubscription,
    link: base44.entities.DietitianClient,
    plan: base44.entities.DietPlan,
  },
};

export function trackApi(track) {
  return track === "diet" ? STORES.diet : STORES.gym;
}

export function planConfig(planId) {
  return PRO_PLANS.find((plan) => plan.id === planId) ?? PRO_PLANS[0];
}

export function priceFor(prices, trackPriceKey, planId, cycle) {
  const found = (prices ?? []).find((p) => p.track === trackPriceKey && p.plan === planId);
  const fallback = DEFAULT_PRICES[trackPriceKey]?.[planId] ?? DEFAULT_PRICES.gym_instructor.basic;
  const monthly = found?.monthly ?? fallback.monthly;
  const annual = found?.annual ?? fallback.annual;
  return cycle === "annual" ? annual : monthly;
}

export function subscriptionLive(sub) {
  if (!sub || sub.status !== "active") return false;
  if (!sub.renews_on) return true;
  return sub.renews_on >= new Date().toISOString().slice(0, 10);
}

export const GYM_SPECIALISATIONS = [
  "Strength training",
  "Fat loss",
  "Muscle building",
  "Functional training",
  "Mobility",
  "Powerlifting",
  "HIIT",
  "Home workouts",
  "Pre & postnatal",
  "Senior fitness",
];

export const DIET_SPECIALISATIONS = [
  "Weight management",
  "Sports nutrition",
  "Diabetes care",
  "Heart health",
  "Gut health",
  "Plant based",
  "Pregnancy nutrition",
  "Paediatric nutrition",
  "Sri Lankan cuisine",
];

export const WORKOUT_CATEGORIES = ["Strength", "Cardio", "Core", "Mobility", "HIIT", "Full body"];
export const WORKOUT_PROGRAMMES = ["Weight loss", "Muscle building", "Beginner", "Intermediate", "Advanced", "Home workout"];
export const LEVELS = ["beginner", "intermediate", "advanced"];
export const LANGUAGES = ["English", "Sinhala", "Tamil", "Hindi", "Arabic", "French", "German", "Mandarin"];
export const MEAL_SLOTS = ["Breakfast", "Morning snack", "Lunch", "Evening snack", "Dinner"];
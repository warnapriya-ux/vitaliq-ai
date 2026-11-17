import { base44 } from "@/api/base44Client";
import { shiftISO, todayISO } from "@/lib/health";

const DEMO_CLIENTS = [
  { name: "Amara Fernando", email: "amara.f@example.com", program: "women", weight: 68.2, target: 60, plan: "professional", status: "active" },
  { name: "Daniel Perera", email: "daniel.p@example.com", program: "men", weight: 88.6, target: 78, plan: "premium", status: "active" },
  { name: "Nadia Silva", email: "nadia.s@example.com", program: "women", weight: 74.1, target: 64, plan: "premium", status: "pending" },
  { name: "Ruwan Jay", email: "ruwan.j@example.com", program: "men", weight: 81.5, target: 74, plan: "basic", status: "cancelled" },
];

const PROS = [
  { name: "Dr. Ishara Weerasinghe", email: "ishara@vitaliq.ai", specialization: "dietitian", credentials: "MBBS, MSc Clinical Nutrition", bio: "12 years of clinical nutrition practice with a focus on metabolic health.", status: "approved", rating: 4.9, client_count: 24, country: "Sri Lanka" },
  { name: "Tharindu Fonseka", email: "tharindu@vitaliq.ai", specialization: "trainer", credentials: "NASM-CPT, Strength & Conditioning", bio: "Strength coach for beginners and body recomposition.", status: "approved", rating: 4.7, client_count: 18, country: "Sri Lanka" },
  { name: "Hannah Muller", email: "hannah@vitaliq.ai", specialization: "dietitian", credentials: "RD, Sports Nutrition", bio: "Plant-forward nutrition for endurance athletes.", status: "pending", rating: 0, client_count: 0, country: "Germany" },
  { name: "Kevin Raj", email: "kevin@vitaliq.ai", specialization: "trainer", credentials: "ACSM-CPT", bio: "Home-workout specialist and postpartum return-to-training.", status: "pending", rating: 0, client_count: 0, country: "India" },
];

export async function ensureStarterData(user) {
  const existing = await base44.entities.HealthProfile.filter({ email: user?.email }, { sort: "-created_date", limit: 1 });
  if (user?.role === "admin") await seedPlatformDemo();
  if (existing.items?.length) return existing.items[0];

  const name = (user?.full_name || "Sarah").split(" ")[0];
  const profile = await base44.entities.HealthProfile.create({
    display_name: name,
    email: user?.email,
    gender: "female",
    birth_date: "1994-04-18",
    height_cm: 165,
    current_weight: 72.4,
    target_weight: 65,
    body_type: "average",
    activity_level: "medium",
    lifestyle: "office",
    food_preference: "non_vegetarian",
    experience: "intermediate",
    program: "women",
    country: "Sri Lanka",
    city: "Colombo",
    conditions: "Mild lower back tightness after long desk days.",
    consent: true,
  });

  await base44.entities.Measurement.bulkCreate([
    { profile_id: profile.id, measured_on: shiftISO(-42), weight: 79.8, body_fat: 33.1, waist: 96, hip: 104, chest: 94, water_pct: 48, muscle_mass: 26.4 },
    { profile_id: profile.id, measured_on: shiftISO(-28), weight: 77.1, body_fat: 32.2, waist: 94.5, hip: 103, chest: 93.5, water_pct: 49, muscle_mass: 26.8 },
    { profile_id: profile.id, measured_on: shiftISO(-14), weight: 74.6, body_fat: 31.4, waist: 93, hip: 102, chest: 93, water_pct: 50, muscle_mass: 27.1 },
    { profile_id: profile.id, measured_on: todayISO(), weight: 72.4, body_fat: 30.6, waist: 92, hip: 101, chest: 92, water_pct: 51, muscle_mass: 27.5 },
  ]);

  await base44.entities.DailyLog.bulkCreate(
    [0, 1, 2, 3, 4, 5, 6].map((back) => ({
      profile_id: profile.id,
      log_date: shiftISO(-back),
      steps: [7850, 9120, 6420, 10350, 7180, 5890, 8760][back],
      water_l: [2, 2.25, 1.5, 2.5, 2, 1.75, 2][back],
      calories_in: [1840, 1920, 2050, 1780, 1890, 2100, 1810][back],
      calories_burned: [420, 510, 300, 640, 380, 260, 470][back],
      sleep_hours: [7.5, 7.2, 6.4, 8, 7.1, 6.8, 7.6][back],
      workout_done: back !== 2 && back !== 5,
      diet_adherence: [100, 90, 70, 100, 85, 65, 95][back],
      mood: ["great", "good", "okay", "great", "good", "tired", "good"][back],
    })),
  );

  await base44.entities.Plan.bulkCreate([
    {
      kind: "diet",
      title: "Balanced 1,850 kcal day",
      summary:
        "Your intake is trending well below maintenance while protein stays high, so keep the current rhythm. Prioritise hydration around your afternoon slump instead of extra coffee.",
      status: "approved",
      client_id: user?.id,
      client_name: user?.full_name || name,
      client_email: user?.email,
      program: "women",
      calories_target: 1850,
      items: [
        { label: "Breakfast", detail: "Oats with berries, 2 boiled eggs and black coffee", meta: "8:00 AM · 420 kcal" },
        { label: "Morning snack", detail: "Greek yoghurt with a handful of almonds", meta: "10:30 AM · 180 kcal" },
        { label: "Lunch", detail: "Grilled chicken salad, olive oil dressing, wholemeal roll", meta: "1:00 PM · 520 kcal" },
        { label: "Evening snack", detail: "Apple with peanut butter", meta: "4:30 PM · 210 kcal" },
        { label: "Dinner", detail: "Veggie and lentil bowl with grilled paneer", meta: "7:30 PM · 520 kcal" },
      ],
      reviewed_by: "Dr. Ishara Weerasinghe",
      reviewed_at: shiftISO(-5),
      review_note: "Approved. Add 500 ml water before lunch and keep dinner before 8 PM.",
    },
    {
      kind: "workout",
      title: "Lower body strength & core",
      summary:
        "Strength is holding up well across the week. Keep the same load today and focus on controlled tempo rather than added weight.",
      status: "approved",
      client_id: user?.id,
      client_name: user?.full_name || name,
      client_email: user?.email,
      program: "women",
      items: [
        { label: "Warm-up", detail: "5 min brisk walk plus hip circles and leg swings", meta: "5 min · Easy" },
        { label: "Bodyweight squat", detail: "3 sets × 15 reps, chest tall, knees tracking over toes", meta: "12 min · Beginner" },
        { label: "Romanian deadlift", detail: "3 sets × 12 reps with light dumbbells, hinge from the hips", meta: "10 min · Beginner" },
        { label: "Reverse lunge", detail: "3 sets × 10 reps per leg, hold a chair for balance if needed", meta: "10 min · Beginner" },
        { label: "Glute bridge", detail: "3 sets × 15 reps, pause for 1 second at the top", meta: "8 min · Easy" },
        { label: "Core finisher", detail: "3 rounds of 30 s plank and 20 dead bugs", meta: "6 min · Beginner" },
      ],
    },
  ]);

  await base44.entities.Subscription.create({
    user_name: user?.full_name || name,
    user_email: user?.email,
    plan: "premium",
    status: "active",
    billing_cycle: "monthly",
    amount: 19,
    currency: "USD",
    started_on: shiftISO(-20),
    renews_on: shiftISO(10),
    auto_renew: true,
  });

  await base44.entities.Payment.bulkCreate([
    { user_name: user?.full_name || name, user_email: user?.email, plan: "premium", amount: 19, currency: "USD", status: "paid", method: "Card", paid_on: shiftISO(-20), reference: "VQ-2481" },
    { user_name: user?.full_name || name, user_email: user?.email, plan: "premium", amount: 19, currency: "USD", status: "paid", method: "Card", paid_on: shiftISO(-50), reference: "VQ-1926" },
  ]);

  return profile;
}

let seedPromise = null;

export function seedPlatformDemo() {
  if (!seedPromise) {
    seedPromise = runPlatformSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}

async function runPlatformSeed() {
  const pros = await base44.entities.Professional.list({ limit: 1 });
  if (!pros.items?.length) {
    await base44.entities.Professional.bulkCreate(PROS);
  }

  const clientProfiles = await base44.entities.HealthProfile.list({ limit: 100 });
  const knownNames = new Set((clientProfiles.items ?? []).map((p) => p.display_name));
  const missingProfiles = DEMO_CLIENTS.filter((c) => !knownNames.has(c.name));
  if (missingProfiles.length) {
    await base44.entities.HealthProfile.bulkCreate(
      missingProfiles.map((c) => ({
        display_name: c.name,
        email: c.email,
        gender: c.program === "men" ? "male" : "female",
        birth_date: "1990-06-12",
        height_cm: c.program === "men" ? 176 : 163,
        current_weight: c.weight,
        target_weight: c.target,
        body_type: "average",
        activity_level: "medium",
        lifestyle: "office",
        food_preference: "non_vegetarian",
        experience: "beginner",
        program: c.program,
        city: "Colombo",
        country: "Sri Lanka",
        consent: true,
      })),
    );
  }

  const existingPlans = await base44.entities.Plan.list({ limit: 100 });
  if (!(existingPlans.items ?? []).some((p) => p.status === "pending_review")) {
    await base44.entities.Plan.bulkCreate([
      {
        kind: "diet",
        title: "Vegetarian 1,700 kcal day",
        summary: "Lower-carb vegetarian day built around her strength sessions, with a protein-forward breakfast to reduce evening cravings.",
        status: "pending_review",
        client_name: DEMO_CLIENTS[0].name,
        client_email: DEMO_CLIENTS[0].email,
        program: "women",
        calories_target: 1700,
        items: [
          { label: "Breakfast", detail: "Tofu scramble with spinach and one slice of wholegrain toast", meta: "7:30 AM · 380 kcal" },
          { label: "Morning snack", detail: "Handful of cashews and a small banana", meta: "10:30 AM · 180 kcal" },
          { label: "Lunch", detail: "Chickpea and quinoa bowl with yogurt dressing", meta: "1:00 PM · 480 kcal" },
          { label: "Evening snack", detail: "Carrot sticks with hummus", meta: "4:30 PM · 140 kcal" },
          { label: "Dinner", detail: "Paneer stir-fry with brown rice", meta: "7:30 PM · 520 kcal" },
        ],
      },
      {
        kind: "workout",
        title: "Upper body push & pull",
        summary: "Second strength session of the week. Keep two reps in reserve on every set while sleep is below seven hours.",
        status: "pending_review",
        client_name: DEMO_CLIENTS[1].name,
        client_email: DEMO_CLIENTS[1].email,
        program: "men",
        items: [
          { label: "Warm-up", detail: "6 min rowing machine and band pull-aparts", meta: "6 min · Easy" },
          { label: "Incline press", detail: "4 sets × 8 reps at a controlled tempo", meta: "14 min · Intermediate" },
          { label: "Chest-supported row", detail: "4 sets × 10 reps, squeeze at the top", meta: "12 min · Intermediate" },
          { label: "Overhead press", detail: "3 sets × 8 reps, ribs down", meta: "10 min · Intermediate" },
          { label: "Face pull", detail: "3 sets × 15 reps", meta: "8 min · Easy" },
          { label: "Farmer carry", detail: "3 × 40 m with heavy dumbbells", meta: "8 min · Intermediate" },
        ],
      },
    ]);
  }

  const subs = await base44.entities.Subscription.list({ limit: 50 });
  const existingEmails = new Set((subs.items ?? []).map((s) => s.user_email));
  const missing = DEMO_CLIENTS.filter((c) => !existingEmails.has(c.email));
  if (missing.length) {
    await base44.entities.Subscription.bulkCreate(
      missing.map((c) => ({
        user_name: c.name,
        user_email: c.email,
        plan: c.plan,
        status: c.status,
        billing_cycle: "monthly",
        amount: PLAN_PRICE[c.plan],
        currency: "USD",
        started_on: shiftISO(-30),
        renews_on: shiftISO(0),
        auto_renew: true,
      })),
    );
    await base44.entities.Payment.bulkCreate(
      missing.map((c, i) => ({
        user_name: c.name,
        user_email: c.email,
        plan: c.plan,
        amount: PLAN_PRICE[c.plan],
        currency: "USD",
        status: c.status === "cancelled" ? "refunded" : c.status === "pending" ? "pending" : "paid",
        method: i % 2 ? "Card" : "Bank transfer",
        paid_on: shiftISO(-30 + i),
        reference: `VQ-30${i}1`,
      })),
    );
  }

  const consultations = await base44.entities.Consultation.list({ limit: 1 });
  if (!consultations.items?.length) {
    await base44.entities.Consultation.bulkCreate([
      { client_name: "Amara Fernando", client_email: "amara.f@example.com", professional_name: "Dr. Ishara Weerasinghe", topic: "Diet plan review", scheduled_for: `${shiftISO(1)}T10:30`, status: "scheduled", notes: "Wants vegetarian swaps for lunch." },
      { client_name: "Daniel Perera", client_email: "daniel.p@example.com", professional_name: "Tharindu Fonseka", topic: "Strength progression", scheduled_for: `${shiftISO(2)}T17:00`, status: "requested" },
      { client_name: "Nadia Silva", client_email: "nadia.s@example.com", professional_name: "Dr. Ishara Weerasinghe", topic: "Postpartum return to training", scheduled_for: `${shiftISO(-3)}T09:00`, status: "completed", notes: "Cleared for low impact work." },
    ]);
  }
}

const PLAN_PRICE = { free: 0, basic: 9, premium: 19, professional: 39, family: 49 };
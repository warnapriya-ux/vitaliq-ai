/**
 * What the phone on screen shows during each tutorial: the real VITALIQ module
 * being taught, with the sample values the narration talks about.
 */
export const TUTORIAL_SCREENS = {
  "vid-01": {
    tab: "Today",
    eyebrow: "VITALIQ AI",
    hero: { label: "Daily readiness", value: "82", unit: "/100" },
    rows: [
      { title: "AI wellness coach", meta: "Ask about habits, sleep, activity" },
      { title: "Workout library", meta: "Home, cardio, core and yoga" },
      { title: "Nutrition plan", meta: "1,850 kcal target today" },
      { title: "Progress reports", meta: "Daily, weekly, monthly" },
    ],
  },
  "vid-02": {
    tab: "Account",
    eyebrow: "Create your account",
    hero: { label: "Step", value: "1", unit: "of 2" },
    rows: [
      { title: "Full name", meta: "Nadia Perera" },
      { title: "Email address", meta: "you@example.com" },
      { title: "Password", meta: "12+ characters, unique" },
      { title: "Verify email", meta: "6-digit code we send you" },
    ],
  },
  "vid-03": {
    tab: "Profile",
    eyebrow: "Health profile",
    hero: { label: "Current weight", value: "72.4", unit: "kg" },
    rows: [
      { title: "Height", meta: "168 cm" },
      { title: "Target weight", meta: "65.0 kg" },
      { title: "Activity level", meta: "Medium · 3 sessions a week" },
      { title: "Food preference", meta: "Vegetarian, no shellfish" },
    ],
  },
  "vid-04": {
    tab: "Today",
    eyebrow: "Today",
    hero: { label: "Steps", value: "6,240", unit: "/ 8,000" },
    rows: [
      { title: "Water", meta: "1.6 L of 2.4 L" },
      { title: "Calories", meta: "1,420 kcal logged" },
      { title: "Sleep", meta: "7 h 10 m last night" },
      { title: "Workout", meta: "Full body · 28 min" },
    ],
  },
  "vid-05": {
    tab: "Coach",
    eyebrow: "VITALIQ Coach",
    hero: { label: "General wellness guidance", value: "Ask", unit: "" },
    rows: [
      { title: "You", meta: "How do I add walking to a desk job?" },
      { title: "Coach", meta: "Two 10-minute walks, one after lunch…" },
      { title: "Safety note", meta: "Education only, not medical advice" },
      { title: "Next step", meta: "Log today's walk" },
    ],
  },
  "vid-06": {
    tab: "Workout",
    eyebrow: "Workout library",
    hero: { label: "Today's session", value: "28", unit: "min" },
    rows: [
      { title: "Bodyweight squat", meta: "3 × 12 · Beginner" },
      { title: "Modified push-up", meta: "3 × 10 · Beginner" },
      { title: "Plank hold", meta: "3 × 30 sec" },
      { title: "Cool-down stretch", meta: "5 min" },
    ],
  },
  "vid-07": {
    tab: "Diet",
    eyebrow: "Diet plan",
    hero: { label: "Calories", value: "1,850", unit: "kcal" },
    rows: [
      { title: "Breakfast", meta: "Oats, yoghurt, berries · 420 kcal" },
      { title: "Lunch", meta: "Rice, vegetables, grilled fish · 610 kcal" },
      { title: "Snack", meta: "Fruit and nuts · 180 kcal" },
      { title: "Dinner", meta: "Lentil curry and salad · 640 kcal" },
    ],
  },
  "vid-08": {
    tab: "Progress",
    eyebrow: "Progress",
    hero: { label: "Weight", value: "72.4", unit: "kg" },
    rows: [
      { title: "Last 30 days", meta: "−1.8 kg trend" },
      { title: "Body fat", meta: "24.1 %" },
      { title: "BMI", meta: "25.6 · screening only" },
      { title: "Weekly report", meta: "Ready to review" },
    ],
  },
  "vid-09": {
    tab: "Profile",
    eyebrow: "Privacy & security",
    hero: { label: "Signed-in devices", value: "1", unit: "" },
    rows: [
      { title: "Password", meta: "Updated 3 weeks ago" },
      { title: "Reminders", meta: "Hydration and workout only" },
      { title: "Health data consent", meta: "Review retention and rights" },
      { title: "Sign out", meta: "Use on shared devices" },
    ],
  },
};

export const screenForVideo = (videoId) => TUTORIAL_SCREENS[videoId] ?? TUTORIAL_SCREENS["vid-01"];
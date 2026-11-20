import { LifeBuoy, Rocket, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

/**
 * Help Centre content. Every article is written from the live screens of the app:
 * labels in the steps match what a member actually taps, so nothing here describes
 * a feature that does not exist.
 */
export const HELP_CATEGORIES = [
  {
    id: "start",
    label: "Getting started",
    blurb: "Your account, health profile and the Today screen.",
    icon: Rocket,
    ring: "ring-cyan-400/25",
    glow: "from-cyan-400/20 to-sky-500/[0.03]",
    text: "text-cyan-300",
  },
  {
    id: "tools",
    label: "Daily tools",
    blurb: "Coach, workout, exercise catalog and nutrition.",
    icon: Sparkles,
    ring: "ring-violet-400/25",
    glow: "from-violet-400/20 to-indigo-500/[0.03]",
    text: "text-violet-300",
  },
  {
    id: "progress",
    label: "Progress & tracking",
    blurb: "Check-ins, measurements, trends and AI reviews.",
    icon: TrendingUp,
    ring: "ring-emerald-400/25",
    glow: "from-emerald-400/20 to-teal-500/[0.03]",
    text: "text-emerald-300",
  },
  {
    id: "account",
    label: "Account & privacy",
    blurb: "Subscription, personal data and account safety.",
    icon: ShieldCheck,
    ring: "ring-amber-400/25",
    glow: "from-amber-400/20 to-orange-500/[0.03]",
    text: "text-amber-300",
  },
  {
    id: "support",
    label: "Troubleshooting",
    blurb: "Fix the usual snags before you ask for help.",
    icon: LifeBuoy,
    ring: "ring-rose-400/25",
    glow: "from-rose-400/20 to-pink-500/[0.03]",
    text: "text-rose-300",
  },
];

export const HELP_ARTICLES = [
  {
    id: "create-account",
    category: "start",
    title: "Create your account and sign in",
    summary:
      "Register with your email, confirm the 6-digit code we send you, and sign in for the first time.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open the sign-in screen",
        detail:
          "Go to vitaliqai.net in a current browser. Members start on the Welcome back screen.",
      },
      {
        title: "Choose Create one",
        detail:
          "Under the sign-in form, select Create one to open the Create your account screen.",
      },
      {
        title: "Enter your details",
        detail:
          "Type an email address you check regularly, a strong password, then the same password again under Confirm password.",
      },
      {
        title: "Verify your email",
        detail:
          "We email a 6-digit code. Type it into Verify your email and select Verify. If nothing arrives, select Resend and check your spam or promotions folder.",
      },
      {
        title: "Sign in",
        detail:
          "Verification takes you straight into the app. Next time, enter your email and password on Welcome back.",
      },
    ],
    tips: [
      "Use a password you do not use anywhere else, ideally 12 characters or more.",
      "Keep one account per person so your health data stays accurate.",
      "Signing up with an email that already has an account sends a fresh code instead of creating a duplicate.",
    ],
    issues: [
      {
        problem: "The code never arrives",
        fix:
          "Check spam, wait a minute, then select Resend. Codes expire, so always use the newest one.",
      },
      {
        problem: "The app says the email already has an account",
        fix:
          "Go back and sign in on Welcome back, or select Forgot password? to reset the password.",
      },
    ],
    related: ["health-profile", "troubleshooting"],
  },
  {
    id: "health-profile",
    category: "start",
    title: "Build your health profile",
    summary:
      "Your profile is what every plan is built from, so fill it in once and keep it current.",
    minutes: 4,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Start the assessment",
        detail:
          "On your first sign-in VITALIQ opens Build your health profile. You can reopen it any time from Profile → Health profile.",
      },
      {
        title: "Basic details",
        detail:
          "Add your display name, gender, date of birth, country and city. Your name is what appears on the Today screen.",
      },
      {
        title: "Height and weight",
        detail:
          "Height is in centimetres. Enter your current weight and the weight you are working towards. All figures in the app are metric.",
      },
      {
        title: "Activity and experience",
        detail:
          "Choose your activity level, your usual lifestyle, your training experience and the programme you want (men's, women's or general).",
      },
      {
        title: "Food preference and health notes",
        detail:
          "Pick vegetarian, non-vegetarian or other. Use the conditions and notes fields for anything a coach must respect, such as an injury, pregnancy or a medical condition.",
      },
      {
        title: "Give consent and save",
        detail:
          "Tick the consent box, then save. The Today screen, workout and nutrition plan rebuild from the new details.",
      },
    ],
    tips: [
      "Update your weight whenever it changes so calorie targets stay sensible.",
      "Anything you would tell a trainer in person belongs in the notes field.",
      "Changing your programme rewrites future plans, not the ones already saved.",
    ],
    issues: [
      {
        problem: "The plan did not change after editing my profile",
        fix:
          "Open Workout or Diet Plan and use the refresh control at the top right to build a new plan from the updated profile.",
      },
    ],
    related: ["today-screen", "today-workout", "nutrition-plan"],
  },
  {
    id: "today-screen",
    category: "start",
    title: "Find your way around the Today screen",
    summary:
      "What each card shows, and where the six tabs at the bottom take you.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Brand bar",
        detail:
          "The VITALIQ AI mark sits at the top. Next to the notification bell is the Help button, which opens this centre at any time.",
      },
      {
        title: "Goal card",
        detail:
          "Your weight goal as a ring, with current weight, target weight and how much is left to go.",
      },
      {
        title: "Daily stats",
        detail:
          "Steps, water, calories and sleep for today, taken from your latest check-in.",
      },
      {
        title: "Today's plan",
        detail:
          "Two launchers: today's workout and today's meals. Each opens the full screen.",
      },
      {
        title: "Exercise catalog and check-in",
        detail:
          "The catalog card jumps into the full exercise library. Today's check-in is the quick form for steps, water, sleep and calories.",
      },
      {
        title: "Coach, trainer and progress",
        detail:
          "AI advice from your plan, the AI personal trainer, and the progress grid for weight, waist, plan adherence and workout completion.",
      },
      {
        title: "The dock",
        detail:
          "Home, VitalIQ Coach, Diet Plan, Workout, Progress and Profile. Tapping the tab you are already on returns to the top of that tab.",
      },
    ],
    tips: [
      "Pull down on any main tab to refresh it.",
      "If a card looks empty, it usually means no check-in has been saved for today yet.",
    ],
    issues: [],
    related: ["daily-check-in", "ask-coach", "today-workout"],
  },
  {
    id: "ask-coach",
    category: "tools",
    title: "Ask VITALIQ Coach a question",
    summary:
      "Get a short, practical answer to a general wellness question, with one next action.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open the coach",
        detail: "Tap VitalIQ Coach in the bottom dock.",
      },
      {
        title: "Ask one question at a time",
        detail:
          "Type into Ask your coach anything… and send. Tapping one of the suggested questions fills it in for you.",
      },
      {
        title: "Add the context that matters",
        detail:
          "A sentence about your goal, how many days you train or an old injury is enough. Leave out ID numbers and anything you would not want stored.",
      },
      {
        title: "Read the answer as guidance",
        detail:
          "The coach keeps replies short and ends with a concrete action. Treat it as a starting point you can discuss with a professional.",
      },
      {
        title: "Come back to the thread",
        detail:
          "Your conversation is saved, so you can pick it up again from the same screen.",
      },
    ],
    note:
      "The coach gives general wellness guidance only. It cannot diagnose a condition, prescribe medication or replace a doctor. For symptoms, medication questions or anything urgent, contact a qualified healthcare professional, and for an emergency contact local emergency services.",
    tips: [
      "Ask about habits, routines, exercise choices or how to prepare for an appointment.",
      "Be specific about your goal and your week, and the answer gets more useful.",
    ],
    issues: [
      {
        problem: "The reply takes a while",
        fix:
          "Answers are generated live and can take a few seconds. Keep the screen open; the coach shows a thinking indicator while it works.",
      },
    ],
    related: ["privacy-safety", "progress-review"],
  },
  {
    id: "today-workout",
    category: "tools",
    title: "Follow today's workout",
    summary:
      "Open the session built for you, watch each demo, and tick moves off as you finish.",
    minutes: 4,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open Workout",
        detail: "Tap Workout in the dock, or the workout launcher on Today.",
      },
      {
        title: "Read the session",
        detail:
          "You get a title, a short coaching note and seven moves: a warm-up, five main exercises and a cool-down, each with sets, reps or time.",
      },
      {
        title: "Watch the demo first",
        detail:
          "Tap the play control on a move to open its demonstration clip and form cue.",
      },
      {
        title: "Tick moves as you go",
        detail:
          "Tap a move once it is done so you can see how far through the session you are.",
      },
      {
        title: "Build a different session",
        detail:
          "The refresh control at the top right generates a new session from your profile.",
      },
      {
        title: "Go deeper in the catalog",
        detail:
          "Exercise catalog opens the full library if you want a different movement.",
      },
    ],
    note:
      "Warm up before you start, and stop if you feel chest pain, faintness, severe breathlessness or unusual pain. Ask a healthcare professional before a new programme if you have an injury or medical condition.",
    tips: [
      "Form before speed: a lighter, cleaner set beats a rushed heavy one.",
      "Every exercise in your plan comes from the catalog, so a demo is always available.",
    ],
    issues: [
      {
        problem: "The session is still building",
        fix:
          "Your first plan is generated on sign-in and takes a few seconds. Pull down on the screen to refresh once it finishes.",
      },
      {
        problem: "A demo clip will not play",
        fix: "Check your connection and try again, or open the same move from the catalog.",
      },
    ],
    related: ["exercise-catalog", "ai-trainer", "daily-check-in"],
  },
  {
    id: "exercise-catalog",
    category: "tools",
    title: "Browse the exercise catalog",
    summary:
      "Search the full library, filter by level, and open any move for its demo and cues.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open the catalog",
        detail:
          "From Workout, select Exercise catalog, or use the catalog card on the Today screen.",
      },
      {
        title: "Filter the list",
        detail:
          "Pick a body area from the category list, set All levels to your experience, or search by ID, exercise, equipment or coaching cue.",
      },
      {
        title: "Choose a view",
        detail:
          "Grid for browsing, Table for a compact list, or Video for a wall of demo clips.",
      },
      {
        title: "Open a move",
        detail:
          "Selecting an exercise shows its focus, equipment, level, coaching cue and demonstration video.",
      },
      {
        title: "Load more",
        detail:
          "The catalog loads in pages. Use Load more at the end of the list to keep going.",
      },
    ],
    tips: [
      "Search for equipment you actually have, such as dumbbells or a mat.",
      "Filter to your level before you start so the list stays realistic.",
    ],
    issues: [],
    related: ["today-workout", "ai-trainer"],
  },
  {
    id: "nutrition-plan",
    category: "tools",
    title: "Use your daily nutrition plan",
    summary:
      "Read today's meals, tick them off as you eat, track water and ask a dietitian to review the plan.",
    minutes: 4,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open Diet Plan",
        detail: "Tap Diet Plan in the dock to open Today's nutrition.",
      },
      {
        title: "Read the plan",
        detail:
          "Your AI diet plan shows a daily calorie target, a coaching note and five meals: breakfast, morning snack, lunch, evening snack and dinner, each with portions and a time.",
      },
      {
        title: "Tick meals as you eat",
        detail:
          "Tap a meal once you have had it. Your diet adherence figure updates on the Today screen and in Progress.",
      },
      {
        title: "Track water",
        detail:
          "Use the plus and minus controls on the water card to log each quarter litre.",
      },
      {
        title: "Build a new plan",
        detail:
          "The refresh control at the top right generates a new day of meals from your profile and food preference.",
      },
      {
        title: "Ask for a human review",
        detail:
          "Request a dietitian review sends your plan to the dietitian team and appears under Professional support on your profile.",
      },
    ],
    note:
      "Portions and calorie figures are estimates, not laboratory measurements. Check ingredients and allergens yourself. If you have diabetes, kidney disease, an eating disorder, a food allergy or pregnancy-related needs, follow the individual advice of a qualified professional.",
    tips: [
      "Keep your food preference and conditions up to date so new plans respect them.",
      "Aim for the pattern across the week rather than a perfect single day.",
    ],
    issues: [
      {
        problem: "The plan shows meals that do not suit me",
        fix:
          "Update food preference and conditions in Profile → Health profile, then refresh the plan.",
      },
    ],
    related: ["health-profile", "daily-check-in", "measurements"],
  },
  {
    id: "ai-trainer",
    category: "tools",
    title: "Use the AI personal trainer",
    summary:
      "Count reps live with the camera, or upload a recorded set for a written form breakdown.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open the trainer",
        detail:
          "Go to Profile → AI personal trainer. Two modes are offered: a live camera check and recorded video analysis.",
      },
      {
        title: "Camera form check",
        detail:
          "Prop your phone two metres away with your whole body in frame, pick the movement and start the set. The skeleton overlay confirms the model can see you.",
      },
      {
        title: "Train with the voice coach",
        detail:
          "Reps, depth and form score update live, and spoken cues correct you as you go. Finish the set and it is saved to your history.",
      },
      {
        title: "Video form analysis",
        detail:
          "Upload a set you already filmed to get a written breakdown: what went well, what to fix, corrective drills and the form score.",
      },
      {
        title: "Review your history",
        detail:
          "Recent sessions and the weekly form summary sit on the trainer screen.",
      },
    ],
    tips: [
      "Good, even light matters more than a high camera angle.",
      "Allow camera access when your browser asks, or the live check cannot start.",
    ],
    issues: [
      {
        problem: "The camera does not start",
        fix:
          "Allow camera permission for vitaliqai.net in your browser settings, then reload the screen.",
      },
      {
        problem: "Reps are not counted",
        fix:
          "Step back until your whole body is in frame and the overlay tracks your joints.",
      },
    ],
    related: ["today-workout", "privacy-safety"],
  },
  {
    id: "daily-check-in",
    category: "progress",
    title: "Save your daily check-in",
    summary:
      "Log steps, water, sleep and calories so your trends have something to read.",
    minutes: 2,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Find Today's check-in",
        detail: "The form sits on the Today screen, below the plan cards.",
      },
      {
        title: "Fill in today's numbers",
        detail:
          "Steps, water in litres, sleep in hours and calories. Leave a field empty if you do not have the figure.",
      },
      {
        title: "Save today's numbers",
        detail:
          "Select Save today's numbers. The daily stats at the top of Today update straight away.",
      },
      {
        title: "Correct it later",
        detail:
          "Saving again the same day updates the same record rather than adding a second one.",
      },
    ],
    tips: [
      "Log at roughly the same time each day so the pattern is easy to read.",
      "Water also moves when you use the plus and minus controls on Diet Plan.",
    ],
    issues: [
      {
        problem: "The save fails",
        fix:
          "Check your connection and try again. Nothing is lost; the form keeps what you typed.",
      },
    ],
    related: ["measurements", "progress-review", "nutrition-plan"],
  },
  {
    id: "measurements",
    category: "progress",
    title: "Record measurements",
    summary:
      "Add weight, body fat and tape measurements, then read the trend instead of a single number.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open Measurements",
        detail: "Go to Profile and find the Measurements card.",
      },
      {
        title: "Select Add",
        detail:
          "Choose the date, then enter what you measured: weight, body fat, waist, hip, chest, arm, thigh, water percentage or muscle mass.",
      },
      {
        title: "Save measurement",
        detail:
          "Only the fields you fill in are stored. Your five most recent entries are listed on the card.",
      },
      {
        title: "Read the trend",
        detail:
          "Open Progress for the weight trend chart, body measurement history and the change since you started.",
      },
    ],
    note:
      "A single measurement does not define your health. BMI, where shown, is a screening measure and not a diagnosis. Discuss anything that worries you with a qualified professional.",
    tips: [
      "Measure at the same time of day, ideally in the morning, for a fair comparison.",
      "Weekly entries read better than several in one day.",
    ],
    issues: [],
    related: ["progress-review", "daily-check-in", "health-profile"],
  },
  {
    id: "progress-review",
    category: "progress",
    title: "Read your progress and ask for an AI review",
    summary:
      "See the trend, adherence and measurements in one place, then get a weekly adjustment.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open Progress",
        detail: "Tap Progress in the dock to see Your progress.",
      },
      {
        title: "Read the summary cards",
        detail:
          "Weight change since your first entry, how much is left to your target, and the current trend.",
      },
      {
        title: "Check the charts",
        detail:
          "Weight trend and diet adherence show the last weeks, and body measurements list your recent entries.",
      },
      {
        title: "Ask for an AI review",
        detail:
          "In AI progress review, select Analyse. You get a short read on what is working, one risk to watch and one adjustment for this week.",
      },
    ],
    tips: [
      "Review once a week rather than daily; trends need a little time.",
      "Log meals and check-ins first so the review has real data to work from.",
    ],
    issues: [
      {
        problem: "The review says it is unavailable",
        fix: "Try again in a moment. The rest of your progress data is unaffected.",
      },
    ],
    related: ["measurements", "daily-check-in", "ask-coach"],
  },
  {
    id: "subscription",
    category: "account",
    title: "Choose and manage your plan",
    summary:
      "Compare programmes, pick a billing cycle and see exactly what your account is on.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Open your subscription",
        detail:
          "Go to Profile → Subscription and select Manage to open Choose your programme.",
      },
      {
        title: "Compare the programmes",
        detail:
          "Every plan includes the AI health advisor. Higher tiers add personalised plans and human professionals.",
      },
      {
        title: "Pick a billing cycle",
        detail: "Choose monthly, quarterly or annual at the top of the screen.",
      },
      {
        title: "Send the request",
        detail:
          "Select Choose <cycle> billing on the plan you want. The button then shows Awaiting activation.",
      },
      {
        title: "Wait for confirmation",
        detail:
          "Requests are confirmed by the VITALIQ team once payment is verified. Your plan then runs for the chosen cycle.",
      },
      {
        title: "Check your current plan",
        detail:
          "Profile always shows the active plan and renewal date. You can change tier or billing cycle at any time, and a lapsed renewal returns the account to Free.",
      },
    ],
    tips: [
      "Annual billing is the cheapest way to run a plan for a full year.",
      "The free plan still includes the AI health advisor, so you can explore before upgrading.",
    ],
    issues: [
      {
        problem: "My new plan still shows as pending",
        fix:
          "Pending means payment has not been verified yet. It switches to active once the team confirms it.",
      },
    ],
    related: ["close-account", "privacy-safety"],
  },
  {
    id: "privacy-safety",
    category: "account",
    title: "Privacy, safety and responsible use",
    summary:
      "What VITALIQ stores, who can see it, and where the limits of AI guidance sit.",
    minutes: 3,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "What the app stores",
        detail:
          "Your health profile, measurements, daily logs, generated plans, coach messages, trainer sessions, consultations and subscription details.",
      },
      {
        title: "Who can see it",
        detail:
          "Your records are tied to your account. Platform administrators can access them to run the service, verify payments and support you. Other members cannot see your data.",
      },
      {
        title: "Keep your account yours",
        detail:
          "Use your own login, keep the password private, and sign out on shared devices from the bottom of your profile.",
      },
      {
        title: "Share only what is needed",
        detail:
          "Avoid putting identifying details into coach messages or notes. Never upload another person's health information without their consent.",
      },
      {
        title: "Know the limits of AI",
        detail:
          "Plans, coach replies and form scores are wellness guidance. They are not a diagnosis, prescription or clinical treatment plan.",
      },
    ],
    note:
      "For medical concerns, contact a qualified healthcare professional. In an emergency, contact local emergency services rather than using the app.",
    tips: [
      "Review your consent and profile details whenever your circumstances change.",
      "Use a secure device and network when entering health information.",
    ],
    issues: [],
    related: ["close-account", "ask-coach", "subscription"],
  },
  {
    id: "close-account",
    category: "account",
    title: "Update or close your account",
    summary:
      "Change your details, sign out safely, or delete your account and its health data.",
    minutes: 2,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Update your details",
        detail:
          "Profile → Health profile edits your personal and health details. Measurements are edited from the Measurements card.",
      },
      {
        title: "Sign out",
        detail:
          "The Sign out button sits at the bottom of your profile. Use it on any shared or public device.",
      },
      {
        title: "Delete your account",
        detail:
          "Delete account, below Sign out, removes your health profile, measurements, daily logs, plans, subscription and payment records, coach messages, consultations and trainer sessions.",
      },
      {
        title: "Confirm the deletion",
        detail:
          "Deletion is permanent and signs you out. There is no undo, so export anything you want to keep before you confirm.",
      },
    ],
    tips: [
      "If you only want a fresh start, updating your profile and generating new plans is enough.",
      "Deleting an account does not cancel a payment your bank has already processed; contact the VITALIQ team for billing questions.",
    ],
    issues: [],
    related: ["privacy-safety", "subscription"],
  },
  {
    id: "troubleshooting",
    category: "support",
    title: "Fix common problems",
    summary:
      "The usual snags, in the order worth trying, plus how to reach a person.",
    minutes: 4,
    updated: "20 Nov 2026",
    steps: [
      {
        title: "Start with the basics",
        detail:
          "Check your connection, reload the page, and make sure your browser is up to date. On a phone, closing and reopening the app clears most stuck screens.",
      },
      {
        title: "Sign out and back in",
        detail:
          "Sign out from the bottom of your profile, then sign in again. This refreshes your session without touching your data.",
      },
      {
        title: "Then work through the specific fix",
        detail:
          "Use the list below for sign-in, verification, plans, video and camera problems.",
      },
      {
        title: "Ask the team",
        detail:
          "If nothing works, open Profile → Professional support to request a review, and describe what you tried. Include the device and browser you are using, and the approximate time it happened.",
      },
    ],
    tips: [
      "Screenshots help, but remove passwords, verification codes and anything unrelated to the problem first.",
      "Never share your password or a verification code with anyone, including someone claiming to be support.",
    ],
    issues: [
      {
        problem: "The site does not load",
        fix:
          "Try another network, disable any content blocker for vitaliqai.net, and open the site in a fresh browser tab.",
      },
      {
        problem: "I cannot sign in",
        fix:
          "Check the email spelling and password. Use Forgot password? on the Welcome back screen to reset it.",
      },
      {
        problem: "The verification code does not arrive",
        fix:
          "Check spam, select Resend, and use the newest code. Codes expire after a short time.",
      },
      {
        problem: "My plan is empty or still loading",
        fix:
          "Plans are generated on first sign-in and can take a few seconds. Pull down to refresh, or use the refresh control on Workout or Diet Plan.",
      },
      {
        problem: "A video will not play",
        fix:
          "Check your connection and browser permissions, then reopen the exercise from the catalog.",
      },
      {
        problem: "The live trainer cannot see me",
        fix:
          "Allow camera access for the site, stand two metres back with your whole body in frame, and keep the phone steady.",
      },
      {
        problem: "Something looks wrong on my account",
        fix:
          "Change your password with Forgot password?, sign out of other devices by signing out here, and contact the VITALIQ team promptly.",
      },
    ],
    related: ["create-account", "privacy-safety", "today-workout"],
  },
];

export const articleById = (id) => HELP_ARTICLES.find((article) => article.id === id) ?? null;

export const categoryById = (id) => HELP_CATEGORIES.find((category) => category.id === id) ?? null;

export const articlesIn = (categoryId) =>
  HELP_ARTICLES.filter((article) => article.category === categoryId);

function searchable(article) {
  const category = categoryById(article.category)?.label ?? "";
  return [
    article.title,
    article.summary,
    category,
    ...article.steps.flatMap((step) => [step.title, step.detail]),
    ...(article.tips ?? []),
    ...(article.issues ?? []).flatMap((issue) => [issue.problem, issue.fix]),
  ]
    .join(" ")
    .toLowerCase();
}

export function searchHelpArticles(query) {
  const terms = String(query ?? "").toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return HELP_ARTICLES.filter((article) => {
    const text = searchable(article);
    return terms.every((term) => text.includes(term));
  });
}
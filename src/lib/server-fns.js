import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { profileSummary as buildProfileSummary } from "@/lib/health";
import { fillGalleryItems, galleryCandidates, galleryLines, resolveGalleryItems } from "@/lib/catalogPlan";

const planSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    calories_target: { type: "number" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          detail: { type: "string" },
          meta: { type: "string" },
        },
        required: ["label", "detail", "meta"],
      },
    },
  },
  required: ["title", "summary", "items"],
};

const SAFETY =
  "You give general wellness guidance only. Never diagnose a condition, never prescribe medication or supplements, and never promise medical outcomes. If the profile mentions a medical condition, injury, pregnancy or postpartum recovery, keep recommendations conservative and add a note to confirm with a doctor. Be encouraging and specific.";

const workoutSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          exercise_id: { type: "string" },
          label: { type: "string" },
          detail: { type: "string" },
          meta: { type: "string" },
        },
        required: ["exercise_id", "label", "detail", "meta"],
      },
    },
  },
  required: ["title", "summary", "items"],
};

// Builds one plan. Workout plans are composed only from the exercise gallery,
// so every move a member sees has a catalogue entry and a demo clip.
async function composePlan(service, { kind, profileSummary, experience = "beginner", conditions = "", focus }) {
  const isDiet = kind === "diet";
  const gallery = isDiet ? [] : galleryCandidates(experience, conditions);
  const prompt = `You are ${isDiet ? "VITALIQ Nutrition, an AI dietitian" : "VITALIQ Coach, an AI personal trainer"} inside a health platform.
${SAFETY}

Client profile:
${profileSummary}
${focus ? `Client focus for this plan: ${focus}` : ""}
${
  isDiet
    ? ""
    : `
The only exercises you may prescribe are these gallery entries (ID | name | focus | equipment | level):
${galleryLines(gallery)}
`
}
Create a personalised one-day ${isDiet ? "meal plan" : "workout session"}.
Return JSON. "title" is short and specific. "summary" is 2 sentences of coaching advice for today.
${
  isDiet
    ? 'Return exactly 5 "items" in order: Breakfast, Morning snack, Lunch, Evening snack, Dinner. "label" is the meal name, "detail" lists the foods with portions, "meta" is the time plus calories (e.g. "8:00 AM · 420 kcal"). "calories_target" is the daily calorie target.'
    : 'Return exactly 7 "items" in this order: 1 warm-up, 5 main exercises, 1 cool-down. Every item needs "exercise_id" copied exactly from the gallery list, "label" as that exercise\'s gallery name, "detail" with sets, reps or time plus one form cue, and "meta" with the duration and difficulty (e.g. "10 min · Beginner"). Pick movements that fit the client\'s goal, experience and health considerations, and cover different focus areas.'
}
Respect the food preference, conditions, fitness experience and activity level in the profile.`;

  const result = await service.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: isDiet ? planSchema : workoutSchema,
  });

  if (isDiet) return result;
  return {
    title: result.title,
    summary: result.summary,
    items: fillGalleryItems(resolveGalleryItems(result.items), gallery, 5),
  };
}

export const generateHealthPlan = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      kind: z.enum(["diet", "workout"]),
      profileSummary: z.string().min(3).max(4000),
      experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      conditions: z.string().max(600).optional(),
      focus: z.string().max(200).optional(),
    }),
  )
  .handler(({ data, context }) => composePlan(context.getBase44().asServiceRole, data));

const dayOf = (value) => String(value || "").slice(0, 10);
const todayUTC = () => new Date().toISOString().slice(0, 10);

// Runs when a member opens the app: builds the gallery workout plan and
// today's daily plan when they are missing, so nobody lands on an empty day.
export const ensurePersonalPlans = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .handler(async ({ context }) => {
    const user = context.user;
    const base = context.getBase44();

    const profilePage = await base.entities.HealthProfile.filter(
      { email: user.email },
      { sort: "-created_date", limit: 1 },
    );
    const profile = profilePage.items?.[0] ?? null;
    if (!profile) return { created: [] };

    const [workoutPage, dietPage] = await Promise.all([
      base.entities.Plan.filter({ client_id: user.id, kind: "workout" }, { sort: "-created_date", limit: 5 }),
      base.entities.Plan.filter({ client_id: user.id, kind: "diet" }, { sort: "-created_date", limit: 5 }),
    ]);

    const hasGalleryWorkout = (workoutPage.items ?? []).some(
      (plan) => Array.isArray(plan.items) && plan.items.some((item) => item.exercise_id),
    );
    const hasTodayDiet = (dietPage.items ?? []).some((plan) => dayOf(plan.created_date) === todayUTC());

    const pending = [hasGalleryWorkout ? null : "workout", hasTodayDiet ? null : "diet"].filter(Boolean);
    if (!pending.length) return { created: [] };

    const shared = {
      profileSummary: buildProfileSummary(profile, null),
      experience: profile.experience,
      conditions: profile.conditions,
    };

    const created = await Promise.all(
      pending.map(async (kind) => {
        const plan = await composePlan(base.asServiceRole, { kind, ...shared });
        await base.entities.Plan.create({
          kind,
          title: plan.title,
          summary: plan.summary,
          ...(kind === "diet" ? { calories_target: plan.calories_target } : {}),
          items: plan.items,
          status: "ai_draft",
          client_id: user.id,
          client_name: user.full_name,
          client_email: user.email,
          program: profile.program,
        });
        return kind;
      }),
    );

    return { created };
  });

export const askCoach = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      question: z.string().min(1).max(1500),
      profileSummary: z.string().max(4000).optional(),
      recentSummary: z.string().max(2000).optional(),
      mode: z.enum(["chat", "insight"]).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const prompt = `You are VITALIQ Health, the personal AI health advisor of a fitness platform.
${SAFETY}

Client profile:
${data.profileSummary || "No profile details provided."}

Recent activity:
${data.recentSummary || "No recent activity logged."}

${
  data.mode === "insight"
    ? `Analyse this progress and reply with a short progress review: what is working, one risk to watch, and one concrete adjustment for this week. Maximum 140 words, no headings, no bullet lists.`
    : `Answer the client's question in under 140 words, warm and practical, with one concrete next action.`
}

Client: ${data.question}`;

    const reply = await context.getBase44().asServiceRole.integrations.Core.InvokeLLM({ prompt });
    return { reply: typeof reply === "string" ? reply : JSON.stringify(reply) };
  });

const formSchema = {
  type: "object",
  properties: {
    exercise_detected: { type: "string" },
    reps_estimate: { type: "number" },
    form_score: { type: "number" },
    summary: { type: "string" },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          area: { type: "string" },
          issue: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high"] },
          fix: { type: "string" },
        },
        required: ["area", "issue", "severity", "fix"],
      },
    },
    cues: { type: "array", items: { type: "string" } },
    drills: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, dose: { type: "string" } },
        required: ["name", "dose"],
      },
    },
  },
  required: ["exercise_detected", "reps_estimate", "form_score", "summary", "issues", "cues", "drills"],
};

export const generateExerciseVideo = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      exerciseId: z.string().min(3).max(40),
      name: z.string().min(2).max(80),
      cue: z.string().max(400).optional(),
      category: z.string().max(60).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const service = context.getBase44().asServiceRole;

    const existing = await service.entities.ExerciseMedia.filter({ exercise_id: data.exerciseId });
    const rows = Array.isArray(existing) ? existing : existing?.items ?? [];
    const cached = rows.find((row) => row.video_url);
    if (cached) return { video_url: cached.video_url, cached: true };

    const prompt = `Photorealistic fitness demonstration video: an athletic person performing ${data.name}${
      data.cue ? ` — ${data.cue}` : ""
    }, full body in frame, bright modern gym, locked-off camera, soft daylight, clean minimal background, controlled natural motion, no text overlays.`;

    const { url } = await service.integrations.Core.GenerateVideo({
      prompt,
      duration: 6,
      aspect_ratio: "16:9",
      generate_audio: false,
    });

    await service.entities.ExerciseMedia.create({
      exercise_id: data.exerciseId,
      exercise_name: data.name,
      category: data.category,
      video_url: url,
      status: "generated",
      duration_sec: 6,
    });

    return { video_url: url, cached: false };
  });

export const analyzeWorkoutForm = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      exercise: z.string().min(2).max(40),
      durationSec: z.number().min(0).max(3600).optional(),
      frameUrls: z.array(z.string().min(10).max(1200)).min(1).max(6),
    }),
  )
  .handler(async ({ data, context }) => {
    const prompt = `You are VITALIQ Form Coach, a strength coach reviewing a recorded set for a health platform.
${SAFETY}
You are given ${data.frameUrls.length} still frames sampled evenly across a ${Math.round(data.durationSec ?? 0)} second clip of the client training: ${data.exercise}.

Review posture and technique frame by frame. Describe only what is actually visible: torso position, joint alignment, depth or range of motion, head and spine position, and control of the movement.

Return JSON:
- "exercise_detected": the movement you can see, or "${data.exercise}" if unclear.
- "reps_estimate": the best estimate of completed repetitions visible across the frames (0 if a static hold).
- "form_score": 0-100 rating of technique across the frames.
- "summary": 2-3 sentences a client can act on today.
- "issues": up to 4 items, each with the body "area", the "issue" you see, a "severity" of low, medium or high, and a concrete "fix".
- "cues": up to 4 short spoken reminders the client can repeat in their next set.
- "drills": up to 3 corrective "name" plus "dose" entries.`;

    return context
      .getBase44()
      .asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        file_urls: data.frameUrls,
        response_json_schema: formSchema,
      });
  });
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

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

export const generateHealthPlan = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      kind: z.enum(["diet", "workout"]),
      profileSummary: z.string().min(3).max(4000),
      focus: z.string().max(200).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const isDiet = data.kind === "diet";
    const prompt = `You are ${isDiet ? "VITALIQ Nutrition, an AI dietitian" : "VITALIQ Coach, an AI personal trainer"} inside a health platform.
${SAFETY}

Client profile:
${data.profileSummary}
${data.focus ? `Client focus for this plan: ${data.focus}` : ""}

Create a personalised one-day ${isDiet ? "meal plan" : "workout session"}.
Return JSON. "title" is short and specific. "summary" is 2 sentences of coaching advice for today.
${
  isDiet
    ? 'Return exactly 5 "items" in order: Breakfast, Morning snack, Lunch, Evening snack, Dinner. "label" is the meal name, "detail" lists the foods with portions, "meta" is the time plus calories (e.g. "8:00 AM · 420 kcal"). "calories_target" is the daily calorie target.'
    : 'Return exactly 6 "items": warm-up plus 5 exercises. "label" is the exercise name, "detail" has sets, reps or duration and one form cue, "meta" is the duration and a difficulty label (e.g. "10 min · Beginner"). Omit "calories_target" or use the estimated burn.'
}
Respect the food preference, conditions, fitness experience and activity level in the profile.`;

    const result = await context
      .getBase44()
      .asServiceRole.integrations.Core.InvokeLLM({ prompt, response_json_schema: planSchema });
    return result;
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
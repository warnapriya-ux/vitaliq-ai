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
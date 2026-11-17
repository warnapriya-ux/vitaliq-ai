import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const SAFETY =
  "Show only safe, correct technique. Never depict a medical scenario, extreme load, or a movement that would be unsafe for a beginner.";

export const generateWorkoutVideo = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      planTitle: z.string().min(2).max(120),
      goals: z.string().min(2).max(700),
      exercises: z.array(z.string().min(2).max(180)).min(1).max(6),
    }),
  )
  .handler(async ({ data, context }) => {
    const moves = data.exercises.join("; ");
    const prompt = `Cinematic vertical 9:16 fitness film for a premium health app, titled "${data.planTitle}".
A single athletic adult trains in a clean modern gym with dark navy walls, soft daylight from tall windows and a warm rim light. The session, in order: ${moves}.
Smooth slow-motion repetitions with correct posture, tight framing on the working muscles, subtle camera push-in, shallow depth of field, light haze in the air. Calm, motivating, premium sports-brand mood. Photorealistic, no text, no captions, no logos, no watermarks.

Client goals: ${data.goals}
Pace the intensity and the emphasis of the shots to serve those goals. ${SAFETY}`;

    const result = await context
      .getBase44()
      .asServiceRole.integrations.Core.GenerateVideo({
        prompt,
        duration: 8,
        aspect_ratio: "9:16",
        generate_audio: false,
      });

    return { url: result?.url };
  });
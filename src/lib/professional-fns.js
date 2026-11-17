import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { DEFAULT_PRICES, PRO_PLANS, planConfig } from "@/lib/professional";
import { ageFrom, profileSummary, recentSummary } from "@/lib/health";

const trackInput = z.enum(["gym", "diet"]);
const planInput = z.enum(["basic", "medium", "ultra"]);
const cycleInput = z.enum(["monthly", "annual"]);

const today = () => new Date().toISOString().slice(0, 10);

function addMonths(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function store(base44, track) {
  return track === "diet"
    ? {
        profile: base44.asServiceRole.entities.Dietitian,
        subscription: base44.asServiceRole.entities.DietitianSubscription,
        link: base44.asServiceRole.entities.DietitianClient,
        plan: base44.asServiceRole.entities.DietPlan,
        profileName: "Dietitian",
        subName: "DietitianSubscription",
        linkName: "DietitianClient",
      }
    : {
        profile: base44.asServiceRole.entities.GymInstructor,
        subscription: base44.asServiceRole.entities.GymSubscription,
        link: base44.asServiceRole.entities.GymClient,
        plan: base44.asServiceRole.entities.WorkoutPlan,
        profileName: "GymInstructor",
        subName: "GymSubscription",
        linkName: "GymClient",
      };
}

const PROFILE_FIELDS = [
  "name",
  "photo_url",
  "bio",
  "qualifications",
  "licence_details",
  "years_experience",
  "specialisations",
  "gym_location",
  "city",
  "contact",
  "languages",
  "intro_video_url",
  "availability",
];

async function priceFor(base44, priceTrack, plan, cycle) {
  const page = await base44.asServiceRole.entities.ProfessionalPrice.filter(
    { track: priceTrack, plan },
    { limit: 1 },
  );
  const row = page.items?.[0];
  const fallback = DEFAULT_PRICES[priceTrack][plan];
  const monthly = row?.monthly ?? fallback.monthly;
  const annual = row?.annual ?? fallback.annual;
  return cycle === "annual" ? annual : monthly;
}

export const registerProfessional = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      track: trackInput,
      plan: planInput,
      cycle: cycleInput,
      paymentReference: z.string().min(2).max(120),
      name: z.string().min(2).max(120),
      bio: z.string().max(2000).optional(),
      qualifications: z.string().max(600).optional(),
      licence_details: z.string().max(400).optional(),
      years_experience: z.number().min(0).max(70).optional(),
      specialisations: z.array(z.string().max(60)).max(12).optional(),
      gym_location: z.string().max(200).optional(),
      city: z.string().max(120).optional(),
      contact: z.string().max(120).optional(),
      languages: z.array(z.string().max(40)).max(10).optional(),
      availability: z.string().max(400).optional(),
      intro_video_url: z.string().max(700).optional(),
      photo_url: z.string().max(700).optional(),
      verification_doc_uri: z.string().max(700).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const s = store(base44, data.track);

    const existing = await s.profile.filter({ user_id: context.user.id }, { limit: 1 });
    if (existing.items?.length) {
      throw Object.assign(new Error("You already have a professional account."), { status: 409 });
    }

    const priceTrack = data.track === "diet" ? "dietitian" : "gym_instructor";
    const amount = await priceFor(base44, priceTrack, data.plan, data.cycle);

    const profile = await s.profile.create({
      user_id: context.user.id,
      name: data.name,
      email: context.user.email,
      photo_url: data.photo_url || "",
      bio: data.bio || "",
      qualifications: data.qualifications || "",
      licence_details: data.licence_details || "",
      years_experience: data.years_experience ?? 0,
      specialisations: data.specialisations ?? [],
      gym_location: data.gym_location || "",
      city: data.city || "",
      contact: data.contact || "",
      languages: data.languages ?? [],
      availability: data.availability || "",
      intro_video_url: data.intro_video_url || "",
      verification_doc_uri: data.verification_doc_uri || "",
      plan: data.plan,
      status: "pending",
      max_clients: planConfig(data.plan).clients,
      rating: 0,
      review_count: 0,
    });

    const nameKey = data.track === "diet" ? "dietitian" : "instructor";
    await s.subscription.create({
      [`${nameKey}_id`]: profile.id,
      [`${nameKey}_user_id`]: context.user.id,
      [`${nameKey}_name`]: data.name,
      [`${nameKey}_email`]: context.user.email,
      plan: data.plan,
      cycle: data.cycle,
      amount,
      currency: "USD",
      status: "pending",
      payment_reference: data.paymentReference,
    });

    await base44.asServiceRole.entities.ProfessionalPayment.create({
      track: priceTrack,
      professional_id: profile.id,
      professional_name: data.name,
      professional_email: context.user.email,
      plan: data.plan,
      cycle: data.cycle,
      amount,
      currency: "USD",
      method: "Bank transfer",
      reference: data.paymentReference,
      status: "pending",
      paid_on: today(),
    });

    return { profileId: profile.id, amount };
  });

export const saveProfessionalProfile = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      track: trackInput,
      id: z.string(),
      fields: z.object({
        name: z.string().min(2).max(120).optional(),
        photo_url: z.string().max(700).optional(),
        bio: z.string().max(2000).optional(),
        qualifications: z.string().max(600).optional(),
        licence_details: z.string().max(400).optional(),
        years_experience: z.number().min(0).max(70).optional(),
        specialisations: z.array(z.string().max(60)).max(12).optional(),
        gym_location: z.string().max(200).optional(),
        city: z.string().max(120).optional(),
        contact: z.string().max(120).optional(),
        languages: z.array(z.string().max(40)).max(10).optional(),
        intro_video_url: z.string().max(700).optional(),
        availability: z.string().max(400).optional(),
      }),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const s = store(base44, data.track);
    const record = await s.profile.get(data.id);
    if (record.user_id !== context.user.id && context.user.role !== "admin") {
      throw Object.assign(new Error("Not your profile."), { status: 403 });
    }
    const patch = {};
    for (const key of PROFILE_FIELDS) {
      if (data.fields[key] !== undefined) patch[key] = data.fields[key];
    }
    return s.profile.update(data.id, patch);
  });

export const requestProfessional = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      track: trackInput,
      professionalId: z.string(),
      goal: z.string().max(300).optional(),
      note: z.string().max(600).optional(),
      consent: z.boolean(),
    }),
  )
  .handler(async ({ data, context }) => {
    if (!data.consent) {
      throw Object.assign(new Error("Consent is required to share your health profile."), { status: 400 });
    }
    const base44 = context.getBase44();
    const s = store(base44, data.track);
    const pro = await s.profile.get(data.professionalId);
    if (pro.status !== "active") {
      throw Object.assign(new Error("This professional is not accepting clients yet."), { status: 400 });
    }

    const existing = (await s.link.filter({ client_user_id: context.user.id }, { limit: 50 })).items ?? [];
    const already = existing.find((l) => l[data.track === "diet" ? "dietitian_id" : "instructor_id"] === pro.id && l.status !== "ended" && l.status !== "declined");
    if (already) {
      throw Object.assign(new Error("You already have a request with this professional."), { status: 409 });
    }

    const nameKey = data.track === "diet" ? "dietitian" : "instructor";
    return s.link.create({
      [`${nameKey}_id`]: pro.id,
      [`${nameKey}_user_id`]: pro.user_id,
      [`${nameKey}_name`]: pro.name,
      client_user_id: context.user.id,
      client_name: context.user.full_name || "Member",
      client_email: context.user.email,
      goal: data.goal || "",
      note: data.note || "",
      consent: true,
      status: "requested",
      requested_on: today(),
    });
  });

export const respondToRequest = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ track: trackInput, linkId: z.string(), accept: z.boolean() }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const s = store(base44, data.track);
    const link = await s.link.get(data.linkId);
    const nameKey = data.track === "diet" ? "dietitian" : "instructor";

    if (link[`${nameKey}_user_id`] !== context.user.id && context.user.role !== "admin") {
      throw Object.assign(new Error("Not your client request."), { status: 403 });
    }
    if (!data.accept) {
      return s.link.update(link.id, { status: "declined" });
    }

    const pro = await s.profile.get(link[`${nameKey}_id`]);
    if (pro.status !== "active") {
      throw Object.assign(new Error("Your account is not active. Contact support to activate it."), { status: 400 });
    }
    const subPage = await s.subscription.filter(
      { [`${nameKey}_id`]: pro.id },
      { sort: "-created_date", limit: 1 },
    );
    const sub = subPage.items?.[0];
    if (!sub || sub.status !== "active" || (sub.renews_on && sub.renews_on < today())) {
      throw Object.assign(new Error("Your subscription is not active. Renew it to accept new clients."), { status: 402 });
    }

    const activePage = await s.link.filter(
      { [`${nameKey}_id`]: pro.id, status: "active" },
      { limit: 200 },
    );
    const activeCount = activePage.items?.length ?? 0;
    const limit = pro.max_clients ?? planConfig(pro.plan).clients;
    if (activeCount >= limit) {
      throw Object.assign(
        new Error(`Client limit reached (${limit} on the ${planConfig(pro.plan).name} package). Upgrade to accept more clients.`),
        { status: 409 },
      );
    }

    return s.link.update(link.id, { status: "active", started_on: today() });
  });

export const activateProfessional = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({ track: trackInput, professionalId: z.string(), plan: planInput, cycle: cycleInput }),
  )
  .handler(async ({ data, context }) => {
    if (context.user.role !== "admin") {
      throw Object.assign(new Error("Admins only."), { status: 403 });
    }
    const base44 = context.getBase44();
    const s = store(base44, data.track);
    const pro = await s.profile.get(data.professionalId);
    const nameKey = data.track === "diet" ? "dietitian" : "instructor";
    const config = planConfig(data.plan);

    await s.profile.update(pro.id, { status: "active", plan: data.plan, max_clients: config.clients });

    const subPage = await s.subscription.filter({ [`${nameKey}_id`]: pro.id }, { sort: "-created_date", limit: 1 });
    const sub = subPage.items?.[0];
    const amount = sub?.amount ?? (data.cycle === "annual" ? DEFAULT_PRICES[data.track === "diet" ? "dietitian" : "gym_instructor"][data.plan].annual : DEFAULT_PRICES[data.track === "diet" ? "dietitian" : "gym_instructor"][data.plan].monthly);
    const patch = {
      plan: data.plan,
      cycle: data.cycle,
      amount,
      status: "active",
      started_on: today(),
      renews_on: addMonths(data.cycle === "annual" ? 12 : 1),
    };
    if (sub) await s.subscription.update(sub.id, patch);
    else
      await s.subscription.create({
        [`${nameKey}_id`]: pro.id,
        [`${nameKey}_user_id`]: pro.user_id,
        [`${nameKey}_name`]: pro.name,
        [`${nameKey}_email`]: pro.email,
        ...patch,
      });

    const payments = await base44.asServiceRole.entities.ProfessionalPayment.filter(
      { professional_id: pro.id },
      { sort: "-created_date", limit: 1 },
    );
    const payment = payments.items?.[0];
    if (payment) await base44.asServiceRole.entities.ProfessionalPayment.update(payment.id, { status: "paid" });

    return { ok: true };
  });

async function professionalContext(base44, track, linkId, user) {
  const s = store(base44, track);
  const link = await s.link.get(linkId);
  const nameKey = track === "diet" ? "dietitian" : "instructor";
  if (link[`${nameKey}_user_id`] !== user.id && user.role !== "admin") {
    throw Object.assign(new Error("Not your client."), { status: 403 });
  }
  if (link.status !== "active") {
    throw Object.assign(new Error("This client has not been accepted yet."), { status: 400 });
  }
  if (link.consent === false) {
    throw Object.assign(new Error("This client has not consented to share health data."), { status: 400 });
  }

  const profiles = await base44.asServiceRole.entities.HealthProfile.filter(
    { email: link.client_email },
    { sort: "-created_date", limit: 1 },
  );
  const profile = profiles.items?.[0] ?? null;

  const measurements = profile
    ? (await base44.asServiceRole.entities.Measurement.filter({ profile_id: profile.id }, { sort: "measured_on", limit: 40 })).items ?? []
    : [];
  const logs = profile
    ? (await base44.asServiceRole.entities.DailyLog.filter({ profile_id: profile.id }, { sort: "-log_date", limit: 10 })).items ?? []
    : [];
  const dietLogs = (await base44.asServiceRole.entities.DailyDietLog.filter({ client_user_id: link.client_user_id }, { sort: "-log_date", limit: 10 })).items ?? [];

  const latest = measurements.filter((m) => typeof m.weight === "number").slice(-1)[0];
  return {
    link,
    summary: `${profileSummary(profile, latest)}. Weight trend: ${measurements.map((m) => m.weight).filter(Boolean).join(" → ") || "no entries"}.`,
    activity: recentSummary(logs),
    dietLogs,
  };
}

export const clientBrief = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ track: trackInput, linkId: z.string() }))
  .handler(async ({ data, context }) => {
    const ctx = await professionalContext(context.getBase44(), data.track, data.linkId, context.user);
    return { summary: ctx.summary, activity: ctx.activity, dietLogs: ctx.dietLogs, client: ctx.link };
  });

const SAFETY =
  "You work inside a health platform. Give general fitness and nutrition guidance only. Never diagnose a condition, never prescribe medication or supplements, and never promise medical outcomes. If the client has a medical condition, injury or is pregnant, keep everything conservative and add a note to confirm with their doctor.";

const workoutSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    goal: { type: "string" },
    level: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
    summary: { type: "string" },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          focus: { type: "string" },
          exercises: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                sets: { type: "string" },
                reps: { type: "string" },
                rest: { type: "string" },
                notes: { type: "string" },
              },
              required: ["name", "sets", "reps", "rest", "notes"],
            },
          },
        },
        required: ["day", "focus", "exercises"],
      },
    },
  },
  required: ["title", "goal", "level", "summary", "days"],
};

export const generateWorkoutPlan = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      linkId: z.string(),
      transcript: z.string().max(4000).optional(),
      mode: z.enum(["voice", "ai"]),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const ctx = await professionalContext(base44, "gym", data.linkId, context.user);
    const prompt = `You are VITALIQ Coach, an AI assistant supporting a qualified gym instructor.
${SAFETY}

Client profile:
${ctx.summary}

Recent activity:
${ctx.activity}

Instructor's instruction:
${data.transcript || "Design a balanced progressive programme based on the client profile."}

Turn this into a structured weekly workout programme the instructor will review and approve.
Use ${data.mode === "voice" ? "exactly the days and focuses the instructor asked for" : "4 to 5 training days"}.
Give 4 to 6 exercises per day with sets, reps, rest and one short coaching note each.`;
    return base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: workoutSchema,
    });
  });

const dietSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    goal: { type: "string" },
    summary: { type: "string" },
    target_calories: { type: "number" },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          meals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                time: { type: "string" },
                meal: { type: "string" },
                detail: { type: "string" },
                portion: { type: "string" },
                calories: { type: "number" },
                protein: { type: "number" },
                carbs: { type: "number" },
                fat: { type: "number" },
                prep: { type: "string" },
                alternatives: { type: "string" },
              },
              required: ["time", "meal", "detail", "portion", "calories", "prep", "alternatives"],
            },
          },
        },
        required: ["day", "meals"],
      },
    },
  },
  required: ["title", "goal", "summary", "target_calories", "days"],
};

export const generateDietPlan = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      linkId: z.string(),
      transcript: z.string().max(4000).optional(),
      days: z.number().min(1).max(7).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const ctx = await professionalContext(base44, "diet", data.linkId, context.user);
    const dayCount = data.days ?? 7;
    const prompt = `You are VITALIQ Nutrition, an AI assistant supporting a registered dietitian.
${SAFETY}

Client profile:
${ctx.summary}

Recent food logs:
${ctx.dietLogs.map((l) => `${l.log_date}: weight ${l.weight ?? "-"}kg, ${l.meals_completed ?? 0}/${l.meals_planned ?? 0} meals, ${l.water_l ?? 0}L water, hunger ${l.hunger ?? "-"}/5, difficulties: ${l.difficulties || "none"}`).join("\n") || "No food logs yet."}

Dietitian's instruction:
${data.transcript || "Create a balanced plan for gradual, sustainable progress."}

Produce a ${dayCount}-day meal plan with breakfast, morning snack, lunch, evening snack and dinner each day.
Use realistic Sri Lankan foods (rice, string hoppers, hoppers, pittu, dhal, coconut sambol, fish, vegetables, curd, tropical fruit) alongside familiar international options, respecting the client's food preference and health considerations.
Give portion sizes, calories, macros where sensible, one-line preparation notes and a local alternative for each meal. This is a draft for the dietitian to review.`;
    return base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: dietSchema,
    });
  });
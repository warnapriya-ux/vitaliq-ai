import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import {
  CODE_TTL_MINUTES,
  MAX_ATTEMPTS,
  MAX_PER_HOUR,
  RESEND_SECONDS,
  codeEmail,
  generateCode,
  hashCode,
  maskEmail,
  normalizePhone,
} from "@/lib/phoneAuth.server";

const phoneInput = z.object({ phone: z.string().min(6).max(24) });
const codeInput = z.object({ challengeId: z.string().min(10).max(64), code: z.string().min(4).max(8) });

async function sendCodeEmail(service, { to, code }) {
  const result = await service.integrations.Core.SendEmail({
    to,
    subject: "Your VITALIQ sign-in code",
    html: codeEmail(code),
    text: `Your VITALIQ sign-in code is ${code}. It expires in ${CODE_TTL_MINUTES} minutes.`,
    category: "transactional",
  });
  if (result && result.success === false) {
    throw new Error("We could not email your code. Please try again in a moment.");
  }
}

// Creates the one-time code, stores only its hash, and emails it.
async function issueCode(service, { email, phone, key, purpose, userId }) {
  const recent = await service.entities.PhoneCode.filter(
    { phone_key: key },
    { sort: "-created_date", limit: MAX_PER_HOUR },
  );
  const rows = recent.items ?? [];
  const latest = rows[0];
  if (latest) {
    const age = Date.now() - new Date(latest.created_date).getTime();
    if (age < RESEND_SECONDS * 1000) {
      throw new Error(
        `Please wait ${Math.ceil((RESEND_SECONDS * 1000 - age) / 1000)} seconds before asking for another code.`,
      );
    }
  }
  const lastHour = rows.filter((row) => Date.now() - new Date(row.created_date).getTime() < 3600 * 1000);
  if (lastHour.length >= MAX_PER_HOUR) {
    throw new Error("Too many codes requested for this number. Try again in an hour.");
  }

  const challengeId = crypto.randomUUID();
  const code = generateCode();
  await service.entities.PhoneCode.create({
    challenge_id: challengeId,
    phone_key: key,
    phone,
    email,
    code_hash: await hashCode(code, challengeId),
    purpose,
    user_id: userId,
    attempts: 0,
    consumed: false,
    expires_at: new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString(),
  });
  await sendCodeEmail(service, { to: email, code });
  return { challengeId, maskedEmail: maskEmail(email) };
}

async function consumeCode(service, { challengeId, code, purpose }) {
  const found = await service.entities.PhoneCode.filter({ challenge_id: challengeId }, { limit: 1 });
  const record = found.items?.[0];
  if (!record || record.purpose !== purpose) throw new Error("That code has expired. Request a new one.");
  if (record.consumed) throw new Error("That code was already used. Request a new one.");
  if (new Date(record.expires_at).getTime() < Date.now()) {
    throw new Error("That code has expired. Request a new one.");
  }
  if ((record.attempts ?? 0) >= MAX_ATTEMPTS) throw new Error("Too many attempts. Request a new code.");

  const expected = await hashCode(String(code).trim(), record.challenge_id);
  if (expected !== record.code_hash) {
    await service.entities.PhoneCode.update(record.id, { attempts: (record.attempts ?? 0) + 1 });
    throw new Error("That code is not right. Check the email and try again.");
  }
  await service.entities.PhoneCode.update(record.id, { consumed: true });
  return record;
}

// Step 1 of mobile sign-in: find the account behind the number and email a code.
// The address itself is only revealed as a mask until the code is entered.
export const requestPhoneLoginCode = createServerFn({ method: "POST" })
  .validator(phoneInput)
  .handler(async ({ data, context }) => {
    const normalized = normalizePhone(data.phone);
    if (!normalized) throw new Error("Enter a valid mobile number.");
    const service = context.getBase44().asServiceRole;
    const linked = await service.entities.MemberPhone.filter(
      { phone_key: normalized.key, verified: true },
      { limit: 1 },
    );
    const link = linked.items?.[0];
    if (!link) return { found: false };
    const issued = await issueCode(service, {
      email: link.user_email,
      phone: normalized.phone,
      key: normalized.key,
      purpose: "login",
    });
    return { found: true, ...issued };
  });

// Step 2: the code proves the number, and hands back the email the password
// sign-in then uses. Nothing is signed in until the password is checked.
export const verifyPhoneLoginCode = createServerFn({ method: "POST" })
  .validator(codeInput)
  .handler(async ({ data, context }) => {
    const service = context.getBase44().asServiceRole;
    const record = await consumeCode(service, {
      challengeId: data.challengeId,
      code: data.code,
      purpose: "login",
    });
    return { email: record.email };
  });

// Linking a number from the profile: the code goes to the member's own address.
export const requestPhoneLinkCode = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(phoneInput)
  .handler(async ({ data, context }) => {
    const normalized = normalizePhone(data.phone);
    if (!normalized) throw new Error("Enter a valid mobile number.");
    const service = context.getBase44().asServiceRole;
    const taken = await service.entities.MemberPhone.filter({ phone_key: normalized.key }, { limit: 5 });
    const usedByAnother = (taken.items ?? []).find((row) => row.user_id !== context.user.id);
    if (usedByAnother) throw new Error("That mobile number is already linked to another account.");
    const issued = await issueCode(service, {
      email: context.user.email,
      phone: normalized.phone,
      key: normalized.key,
      purpose: "link",
      userId: context.user.id,
    });
    return issued;
  });

export const verifyPhoneLinkCode = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(codeInput)
  .handler(async ({ data, context }) => {
    const service = context.getBase44().asServiceRole;
    const record = await consumeCode(service, {
      challengeId: data.challengeId,
      code: data.code,
      purpose: "link",
    });
    if (record.user_id !== context.user.id) throw new Error("That code belongs to another account.");

    const base = context.getBase44();
    const existing = await base.entities.MemberPhone.filter({ user_id: context.user.id }, { limit: 5 });
    const [current, ...stale] = existing.items ?? [];
    const payload = {
      user_id: context.user.id,
      user_email: context.user.email,
      phone: record.phone,
      phone_key: record.phone_key,
      verified: true,
    };
    if (current) await base.entities.MemberPhone.update(current.id, payload);
    else await base.entities.MemberPhone.create(payload);
    await Promise.all(stale.map((row) => base.entities.MemberPhone.delete(row.id)));
    return { phone: record.phone };
  });
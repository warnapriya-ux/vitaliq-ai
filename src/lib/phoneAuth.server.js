// Server-only helpers for mobile-number sign-in. Kept out of the browser bundle
// by the .server.js suffix: they generate and hash the one-time codes.

export const CODE_TTL_MINUTES = 10;
export const RESEND_SECONDS = 45;
export const MAX_PER_HOUR = 5;
export const MAX_ATTEMPTS = 5;

// "+94 77 123 4567", "0094771234567" and "0771234567" all reduce to the same key,
// so a member can type their number any way they normally write it.
export function normalizePhone(raw) {
  const digits = String(raw || "").replace(/\D/g, "").replace(/^00/, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return { phone: `+${digits}`, key: digits.slice(-9) };
}

export function generateCode() {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(value).padStart(6, "0");
}

export async function hashCode(code, challengeId) {
  const bytes = new TextEncoder().encode(`${challengeId}:${code}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function maskEmail(email) {
  const [name = "", domain] = String(email || "").split("@");
  if (!domain) return "your email";
  return `${name.slice(0, 1)}${"•".repeat(Math.max(name.length - 1, 2))}@${domain}`;
}

export function codeEmail(code) {
  return `<div style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:32px">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden">
    <div style="background:#0790a2;padding:18px 24px;font-size:15px;font-weight:700;color:#000000">VITALIQ AI</div>
    <div style="padding:24px">
      <h1 style="margin:0 0 8px;font-size:20px;line-height:1.3;color:#0f1729">Your sign-in code</h1>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#3d506c">Enter this code to finish signing in with your mobile number. It expires in ${CODE_TTL_MINUTES} minutes.</p>
      <p style="margin:0 0 18px;font-size:30px;font-weight:700;letter-spacing:8px;color:#0790a2">${code}</p>
      <p style="margin:0;font-size:12px;line-height:1.6;color:#3d506c">If you did not try to sign in, you can ignore this email. Nobody can sign in without your password.</p>
    </div>
  </div>
</div>`;
}
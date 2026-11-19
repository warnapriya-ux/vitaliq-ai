import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { MfaFlow } from "@/components/auth/MfaFlow";
import { MfaScreen } from "@/components/auth/MfaParts";
import { AuthError, SubmitButton } from "@/components/auth/parts";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const isAlreadyVerified = (err) => err?.status === 400 && /already verified/i.test(err?.message ?? "");

/**
 * The 6-digit email code step, shared by sign-in and sign-up: verifies the code,
 * resends it on request, then finishes signing in (or hands over to the MFA step).
 */
export function VerifyCodeStep({ email, returnTo, title, subtitle, notice, onAlreadyVerified, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState(null);

  async function verify(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode: code });
      if (result?.mfa_required) {
        setMfaChallenge(result);
        return;
      }
      if (result?.access_token) base44.auth.setToken(result.access_token);
      window.location.href = returnTo;
    } catch (err) {
      if (isAlreadyVerified(err)) {
        onAlreadyVerified?.();
        return;
      }
      setError(err.message || "Invalid verification code");
      setBusy(false);
    }
  }

  async function resend() {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast("Code sent", { description: `Check ${email} for a new 6-digit code.` });
    } catch (err) {
      if (isAlreadyVerified(err)) {
        onAlreadyVerified?.();
        return;
      }
      setError(err.message || "Failed to resend code");
    }
  }

  if (mfaChallenge) return <MfaScreen><MfaFlow challenge={mfaChallenge} returnTo={returnTo} /></MfaScreen>;

  return (
    <AuthLayout icon={ShieldCheck} title={title} subtitle={subtitle}>
      <form onSubmit={verify}>
        <p className="mb-4 text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
        </p>
        {notice && (
          <p className="mb-4 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">{notice}</p>
        )}
        <AuthError>{error}</AuthError>
        <div className="mb-6 flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode} autoFocus autoComplete="one-time-code">
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <SubmitButton busy={busy} busyLabel="Verifying..." disabled={busy || code.length < 6}>
          Verify
        </SubmitButton>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button type="button" onClick={resend} className="font-medium text-primary hover:underline">
            Resend
          </button>
        </p>
        {onBack && (
          <p className="mt-2 text-center text-sm text-muted-foreground">
            <button type="button" onClick={onBack} className="font-medium text-primary hover:underline">
              Use a different email
            </button>
          </p>
        )}
      </form>
    </AuthLayout>
  );
}
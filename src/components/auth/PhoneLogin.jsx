import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Smartphone } from "lucide-react";
import { AuthError, SubmitButton } from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithMfa } from "@/lib/authMfa";
import { requestPhoneLoginCode, verifyPhoneLoginCode } from "@/lib/phoneAuthFns";

// Mobile sign-in: number plus password, then a 6-digit code emailed to the
// address on the account. The password is still what the platform signs in with.
export default function PhoneLogin({ returnTo, onMfaRequired }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const sendCode = useServerFn(requestPhoneLoginCode);
  const checkCode = useServerFn(verifyPhoneLoginCode);

  async function requestCode(event) {
    event?.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await sendCode({ data: { phone } });
      if (!result.found) {
        setError("No account uses that mobile number yet. Add it under Profile, Mobile sign-in, then come back.");
        return;
      }
      setChallenge(result);
      setCode("");
      setNotice(`We emailed a 6-digit code to ${result.maskedEmail}.`);
      setStep("code");
    } catch (err) {
      setError(err.message || "We could not send your code.");
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { email } = await checkCode({
        data: { challengeId: challenge.challengeId, code: code.trim() },
      });
      const result = await loginWithMfa(email, password);
      if (result.mfa_required) {
        onMfaRequired(result);
        return;
      }
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message || "That code did not work.");
      setBusy(false);
    }
  }

  if (step === "code") {
    return (
      <form onSubmit={submitCode} className="space-y-4">
        <AuthError>{error}</AuthError>
        <p className="text-sm text-muted-foreground">{notice}</p>
        <div className="space-y-2">
          <Label htmlFor="phone-code">6-digit code</Label>
          <Input
            id="phone-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="h-12 text-center text-lg tracking-[0.4em]"
            required
          />
        </div>
        <SubmitButton busy={busy} busyLabel="Checking...">
          Verify and log in
        </SubmitButton>
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setNotice("");
              setError("");
            }}
            className="font-medium text-muted-foreground hover:text-foreground"
          >
            Change number
          </button>
          <button
            type="button"
            onClick={requestCode}
            disabled={busy}
            className="font-medium text-primary hover:underline disabled:opacity-50"
          >
            Resend code
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={requestCode} className="space-y-4">
      <AuthError>{error}</AuthError>
      <div className="space-y-2">
        <Label htmlFor="login-phone">Mobile number</Label>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="login-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            autoFocus
            placeholder="+94 77 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12 pl-10"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-phone-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="login-phone-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 pl-10"
            required
          />
        </div>
      </div>
      <SubmitButton busy={busy} busyLabel="Sending code...">
        Continue
      </SubmitButton>
      <p className="text-center text-xs text-muted-foreground">
        We email a 6-digit code to the address on your account to confirm it is you.
      </p>
    </form>
  );
}
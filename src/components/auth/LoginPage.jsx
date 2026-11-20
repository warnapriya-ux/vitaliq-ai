import { Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthError, AuthLink, GoogleButton, OrDivider, SubmitButton } from "@/components/auth/parts";
import PhoneLogin from "@/components/auth/PhoneLogin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MfaFlow } from "@/components/auth/MfaFlow";
import { MfaScreen } from "@/components/auth/MfaParts";
import { base44 } from "@/api/base44Client";
import { VerifyCodeStep } from "@/components/auth/VerifyCodeStep";
import { loginWithMfa } from "@/lib/authMfa";
import { safeReturnTo } from "@/lib/authReturnTo";

const activeTab = "h-10 rounded-lg bg-card text-sm font-medium text-foreground shadow-sm";
const idleTab = "h-10 rounded-lg text-sm font-medium text-muted-foreground transition hover:text-foreground";

// The /login page. ?returnTo= (or the platform's ?from_url=) is where the visitor
// goes after signing in — the login gate and the MCP consent page send people here with it.
export function LoginPage() {
  const returnTo = safeReturnTo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState(null);
  const [step, setStep] = useState("form");
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState("mobile");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = await loginWithMfa(email, password);
      if (result.mfa_required) {
        setMfaChallenge(result);
        return;
      }
      // A hard redirect: the app re-initializes with the new session.
      window.location.href = returnTo;
    } catch (err) {
      const message = err.message || "Invalid email or password";
      // A registered but unverified account: send a fresh code and finish verifying here,
      // so a returning visitor is never left without a code to enter.
      if (/verify your email/i.test(message)) {
        try {
          await base44.auth.resendOtp(email);
          setNotice("This email is not verified yet, so we sent a new 6-digit code.");
          setStep("otp");
        } catch (resendErr) {
          setError(resendErr.message || "We could not send your verification code.");
        }
        setBusy(false);
        return;
      }
      setError(message);
      setBusy(false);
    }
  }

  // An unverified email continues with the 6-digit code step.
  if (step === "otp") {
    return (
      <VerifyCodeStep
        email={email}
        returnTo={returnTo}
        title="Verify your email"
        subtitle="One code and you're in"
        notice={notice}
        onAlreadyVerified={() => {
          setStep("form");
          setNotice("");
          setError("Your email is already verified. Sign in with your password.");
        }}
        onBack={() => {
          setStep("form");
          setNotice("");
          setError("");
        }}
      />
    );
  }

  // The second sign-in step (authenticator app or text message) replaces the whole page.
  if (mfaChallenge) return <MfaScreen><MfaFlow challenge={mfaChallenge} returnTo={returnTo} /></MfaScreen>;

  return (
    <AuthLayout icon={LogIn} title="Welcome back" subtitle="Log in to your account">
      <GoogleButton returnTo={returnTo} onError={setError} />
      <OrDivider />
      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => {
            setMode("mobile");
            setError("");
          }}
          className={mode === "mobile" ? activeTab : idleTab}
        >
          Mobile number
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("email");
            setError("");
          }}
          className={mode === "email" ? activeTab : idleTab}
        >
          Email
        </button>
      </div>

      {mode === "mobile" ? (
        <PhoneLogin returnTo={returnTo} onMfaRequired={setMfaChallenge} />
      ) : (
        <>
          <AuthError>{error}</AuthError>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input id="login-email" type="email" autoComplete="email" autoFocus placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <AuthLink to="/forgot-password" returnTo={returnTo} className="text-xs text-primary hover:underline">
                  Forgot password?
                </AuthLink>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input id="login-password" type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-10" required />
              </div>
            </div>
            <SubmitButton busy={busy} busyLabel="Logging in...">
              Log in
            </SubmitButton>
          </form>
        </>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <AuthLink to="/register" returnTo={returnTo}>
          Create one
        </AuthLink>
      </p>
    </AuthLayout>
  );
}
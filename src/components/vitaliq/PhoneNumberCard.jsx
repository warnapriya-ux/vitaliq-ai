import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BadgeCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import GlassCard from "@/components/vitaliq/GlassCard";
import { Input } from "@/components/ui/input";
import { requestPhoneLinkCode, verifyPhoneLinkCode } from "@/lib/phoneAuthFns";

// Lets a member link the mobile number they want to sign in with. The code is
// emailed to their account address, and only then does the number start working.
export default function PhoneNumberCard() {
  const [link, setLink] = useState(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const sendCode = useServerFn(requestPhoneLinkCode);
  const checkCode = useServerFn(verifyPhoneLinkCode);

  useEffect(() => {
    base44.entities.MemberPhone.list({ sort: "-created_date", limit: 1 })
      .then((page) => setLink(page.items?.[0] ?? null))
      .catch(() => {});
  }, []);

  async function startLink(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await sendCode({ data: { phone } });
      setChallenge(result);
      setCode("");
      toast.success(`Code sent to ${result.maskedEmail}`);
    } catch (err) {
      toast.error(err.message || "Could not send the code.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmLink(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const result = await checkCode({
        data: { challengeId: challenge.challengeId, code: code.trim() },
      });
      setLink({ phone: result.phone, verified: true });
      setChallenge(null);
      setEditing(false);
      setPhone("");
      setCode("");
      toast.success("Mobile number verified");
    } catch (err) {
      toast.error(err.message || "That code did not work.");
    } finally {
      setBusy(false);
    }
  }

  const buttonClass =
    "flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground disabled:opacity-60";

  return (
    <GlassCard>
      <p className="flex items-center gap-1.5 font-heading text-sm font-semibold text-white">
        <Smartphone className="h-3.5 w-3.5 text-cyan-300" /> Mobile sign-in
      </p>

      {link && !editing ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-3 py-2.5">
          <div>
            <p className="text-[12.5px] text-white/80">{link.phone}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[10.5px] text-emerald-300">
              <BadgeCheck className="h-3 w-3" /> Verified
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setPhone(link.phone);
            }}
            className="min-h-[36px] rounded-full border border-white/10 px-3 text-[11px] text-white/60"
          >
            Change
          </button>
        </div>
      ) : (
        <form onSubmit={challenge ? confirmLink : startLink} className="mt-3 space-y-2.5">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+94 77 123 4567"
            inputMode="tel"
            autoComplete="tel"
            className="h-11"
            required
          />
          {challenge ? (
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="h-11 text-center tracking-[0.3em]"
              required
            />
          ) : null}
          <button type="submit" disabled={busy} className={buttonClass}>
            {busy ? "Please wait..." : challenge ? "Verify number" : "Send code"}
          </button>
          <p className="text-[11px] leading-relaxed text-white/40">
            The code goes to your account email. Once verified you can log in with this number and
            your password.
          </p>
        </form>
      )}
    </GlassCard>
  );
}
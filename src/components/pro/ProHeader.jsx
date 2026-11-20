import { Link } from "@tanstack/react-router";
import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";

export default function ProHeader({ track, profile, subscription, children }) {
  const live = subscription?.status === "active" && (!subscription?.renews_on || subscription.renews_on >= new Date().toISOString().slice(0, 10));
  const pending = profile?.status === "pending";
  const suspended = profile?.status === "suspended" || profile?.status === "rejected";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">
            {track === "diet" ? "Dietitian portal" : "Instructor portal"}
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-white">{profile?.name || "Professional"}</h1>
          <p className="mt-0.5 text-[11px] text-white/40">
            {subscription ? `${subscription.plan} package · renews ${subscription.renews_on || "pending"}` : "No active subscription"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {children}
          {profile?.status === "active" && live ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/12 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified
            </span>
          ) : pending ? (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-400/12 px-2.5 py-1 text-[10px] font-semibold text-amber-300">
              <Clock className="h-3.5 w-3.5" /> Awaiting approval
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-rose-400/12 px-2.5 py-1 text-[10px] font-semibold text-rose-300">
              <ShieldAlert className="h-3.5 w-3.5" /> {suspended ? "Suspended" : "Inactive"}
            </span>
          )}
        </div>
      </div>

      {pending && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-3 text-[11px] leading-relaxed text-amber-200/80">
          Your registration and payment are being verified. Your dashboard unlocks as soon as an administrator activates your
          account. Keep your qualifications and payment reference up to date.
        </div>
      )}

      {!pending && !live && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-3 text-[11px] leading-relaxed text-rose-200/80">
          Your subscription is not active, so you cannot accept new clients. Renew from your subscription page and an
          administrator will reactivate your account.
          <Link to={track === "diet" ? "/pro/dietitian/subscription" : "/pro/instructor/subscription"} className="ml-1 font-semibold text-rose-100 underline">
            Renewal
          </Link>
        </div>
      )}
    </div>
  );
}
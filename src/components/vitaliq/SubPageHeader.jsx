import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

/**
 * Shared back header for child screens. Uses real history when there is any,
 * otherwise falls back to the logical parent route so the button never dead-ends.
 */
export default function SubPageHeader({ title, subtitle, to = "/" }) {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) router.history.back();
    else router.navigate({ to });
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={goBack}
        aria-label="Go back"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="min-w-0">
        {subtitle && <p className="text-[12px] uppercase tracking-[0.2em] text-white/60">{subtitle}</p>}
        <h1 className="truncate font-heading text-[19px] font-semibold tracking-tight text-white">{title}</h1>
      </div>
    </div>
  );
}
import { ArrowLeft } from "lucide-react";

export default function SubPageHeader({ title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => window.history.back()}
        aria-label="Go back"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:text-white active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div className="min-w-0">
        {subtitle && <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">{subtitle}</p>}
        <h1 className="truncate font-heading text-[19px] font-semibold tracking-tight text-white">{title}</h1>
      </div>
    </div>
  );
}
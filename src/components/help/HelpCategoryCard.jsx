import { Link } from "@tanstack/react-router";

const baseClass =
  "group relative block w-full overflow-hidden rounded-[22px] border p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 active:scale-[0.99]";

/** A category tile. Renders a link for video, troubleshooting and onboarding sections. */
export default function HelpCategoryCard({ category, countLabel, active, onSelect, to }) {
  const Icon = category.icon;

  const inner = (
    <>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.glow} opacity-70`} />
      <div className="relative">
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] ring-1 ${category.ring} ${category.text}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <p className="mt-2.5 font-heading text-[13px] font-semibold leading-snug text-white">
          {category.label}
        </p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-white/55">{category.blurb}</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-white/40">{countLabel}</p>
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClass} border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]`}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`${baseClass} ${
        active
          ? "border-cyan-300/50 bg-white/[0.07]"
          : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]"
      }`}
    >
      {inner}
    </button>
  );
}
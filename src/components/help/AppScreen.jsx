import { Dumbbell, Home, MessageCircle, TrendingUp, Utensils } from "lucide-react";
import { Image } from "@/components/ui/image";
import { BRAND_LOGO } from "@/lib/brand";

const DOCK = [
  { label: "Today", icon: Home },
  { label: "Coach", icon: MessageCircle },
  { label: "Workout", icon: Dumbbell },
  { label: "Diet", icon: Utensils },
  { label: "Progress", icon: TrendingUp },
];

/**
 * The VITALIQ mobile screen shown during a tutorial: the real module the chapter
 * is about, with the row the narration is describing highlighted.
 */
export default function AppScreen({ screen, activeIndex, playing }) {
  const focus = Math.min(screen.rows.length - 1, activeIndex);

  return (
    <div className="relative flex h-full max-h-full aspect-[9/19] shrink-0 flex-col overflow-hidden rounded-[22px] border border-white/15 bg-[#070d18] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.95)]">
      <div className="flex items-center justify-between px-3 pt-2 text-[7px] font-medium text-white/45">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span className="h-1.5 w-2.5 rounded-[2px] border border-white/40" />
        </span>
      </div>

      <div className="mt-1 flex items-center gap-1.5 px-3">
        <Image
          src={BRAND_LOGO}
          alt=""
          className="h-4 w-4 shrink-0 overflow-hidden rounded-[5px] ring-1 ring-white/10"
        />
        <span className="truncate text-[7.5px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {screen.eyebrow}
        </span>
      </div>

      <div className="mx-2.5 mt-2 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.08] px-2.5 py-2">
        <p className="text-[6.5px] uppercase tracking-[0.14em] text-cyan-200/70">{screen.hero.label}</p>
        <p className="mt-0.5 font-heading text-[17px] font-semibold leading-none text-white">
          {screen.hero.value}
          {screen.hero.unit ? (
            <span className="ml-1 text-[8px] font-medium text-white/50">{screen.hero.unit}</span>
          ) : null}
        </p>
      </div>

      <div className="mt-2 flex-1 space-y-1 overflow-hidden px-2.5">
        {screen.rows.map((row, index) => {
          const active = index === focus;
          return (
            <div
              key={row.title}
              className={`rounded-lg border px-2 py-1.5 transition ${
                active
                  ? "border-cyan-400/60 bg-cyan-400/12 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]"
                  : "border-white/[0.07] bg-white/[0.03]"
              }`}
            >
              <p className={`text-[8px] font-semibold ${active ? "text-white" : "text-white/80"}`}>
                {row.title}
              </p>
              <p className="truncate text-[6.5px] leading-snug text-white/45">{row.meta}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-1 flex items-center justify-around border-t border-white/[0.07] px-1 pb-1.5 pt-1">
        {DOCK.map((item) => {
          const active = item.label === screen.tab;
          const Icon = item.icon;
          return (
            <span
              key={item.label}
              className={`flex flex-col items-center gap-0.5 ${
                active ? "text-cyan-300" : "text-white/25"
              }`}
            >
              <Icon className="h-2.5 w-2.5" />
              <span className="text-[5.5px] font-medium">{item.label}</span>
            </span>
          );
        })}
      </div>

      {playing && (
        <span className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-cyan-400/20" />
      )}
    </div>
  );
}
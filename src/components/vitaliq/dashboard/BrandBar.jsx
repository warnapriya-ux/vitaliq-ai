import { Bell } from "lucide-react";
import { Image } from "@/components/ui/image";

import { BRAND_LOGO as LOGO } from "@/lib/brand";

export default function BrandBar({ unread = 2 }) {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <Image
          src={LOGO}
          alt="VITALIQ AI"
          className="h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-cyan-400/25"
        />
        <div className="min-w-0">
          <p className="font-heading text-[13px] font-semibold tracking-[0.16em] text-white">
            VITALIQ <span className="text-cyan-300">AI</span>
          </p>
          <p className="truncate text-[12px] text-white/60">Your Intelligent Health &amp; Fitness Companion</p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Notifications"
        className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-white/75 backdrop-blur-xl transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[11px] font-bold text-white">
          {unread}
        </span>
      </button>
    </header>
  );
}
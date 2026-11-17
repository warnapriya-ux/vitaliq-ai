import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { BRAND_LOGO } from "@/lib/brand";
import { NAV } from "@/components/vitaliq/nav";

export default function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col border-r border-white/[0.06] bg-[#070c15]/85 px-4 py-6 backdrop-blur-xl lg:flex">
      <Link to="/" className="flex items-center gap-2.5 px-2">
        <Image
          src={BRAND_LOGO}
          alt="VITALIQ AI"
          className="h-9 w-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10"
        />
        <span className="font-heading text-sm font-semibold tracking-[0.16em] text-white">
          VITALIQ <span className="text-cyan-300">AI</span>
        </span>
      </Link>

      <nav className="mt-8 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-white/50 transition hover:bg-white/5 hover:text-white"
            activeProps={{ className: "bg-cyan-400/10 text-cyan-300" }}
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
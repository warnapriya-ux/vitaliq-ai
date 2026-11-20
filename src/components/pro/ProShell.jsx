import { Link, useLocation } from "@tanstack/react-router";
import { Apple, ArrowLeft, Dumbbell, LayoutDashboard, Layers, LayoutTemplate, CreditCard } from "lucide-react";
import { Image } from "@/components/ui/image";
import { BRAND_LOGO } from "@/lib/brand";
import { TRACKS } from "@/lib/professional";

function tab(track, path, label, icon, exact) {
  return { to: path, label, icon, exact };
}

export default function ProShell({ track, children }) {
  const config = TRACKS[track];
  const { pathname } = useLocation();
  const base = config.route;

  const tabs = [
    tab(track, base, "Dashboard", LayoutDashboard, true),
    tab(track, `${base}/plans`, track === "diet" ? "Diet plans" : "Workout plans", Layers),
    ...(track === "gym"
      ? [
          tab(track, `${base}/templates`, "Templates", LayoutTemplate),
          tab(track, `${base}/library`, "Virtual gym", Dumbbell),
        ]
      : []),
    tab(track, `${base}/subscription`, "Subscription", CreditCard),
  ];

  return (
    // Same dark canvas and palette as the member app, so the portal never inherits a light theme.
    <div className="dark app-canvas min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#070c15]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1100px] items-center gap-2.5 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Image src={BRAND_LOGO} alt="VITALIQ AI" className="h-8 w-8 overflow-hidden rounded-lg ring-1 ring-white/10" />
            <span className="hidden font-heading text-[12px] font-semibold tracking-[0.16em] text-white sm:block">
              VITALIQ <span className={track === "diet" ? "text-emerald-300" : "text-cyan-300"}>PRO</span>
            </span>
          </Link>
          <span className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-white/40">
            {track === "diet" ? <Apple className="mr-1 inline h-3 w-3" /> : <Dumbbell className="mr-1 inline h-3 w-3" />}
            {config.label}
          </span>
          <Link to="/" className="ml-auto flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 text-[10px] text-white/45">
            <ArrowLeft className="h-3 w-3" /> My app
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-[1100px] gap-1 overflow-x-auto px-3 pb-2 no-scrollbar">
          {tabs.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition ${
                  active
                    ? track === "diet"
                      ? "bg-emerald-400/12 text-emerald-200"
                      : "bg-cyan-400/12 text-cyan-200"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1100px] px-4 py-5">{children}</main>
    </div>
  );
}
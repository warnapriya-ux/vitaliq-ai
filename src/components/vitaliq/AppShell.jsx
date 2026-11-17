import { Link } from "@tanstack/react-router";
import { Apple, Bot, Dumbbell, Home, Map, PersonStanding, TrendingUp, User } from "lucide-react";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/coach", label: "Coach", icon: Bot },
  { to: "/nutrition", label: "Diet", icon: Apple },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/trainer", label: "Trainer", icon: PersonStanding },
  { to: "/insights", label: "Progress", icon: TrendingUp },
  { to: "/journey", label: "Journey", icon: Map },
  { to: "/profile", label: "Profile", icon: User },
];

function Dock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <nav className="flex w-full max-w-[406px] items-center justify-between rounded-[24px] border border-white/10 bg-[#080d16]/92 px-1 py-1.5 backdrop-blur-2xl">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1 text-white/35 transition"
            activeProps={{ className: "text-cyan-300" }}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="text-[9px] font-medium tracking-tight">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-background pt-[env(safe-area-inset-top)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-white/[0.015] sm:border-x sm:border-white/[0.06]">
        <main className="flex-1 px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-5">{children}</main>
      </div>
      <Dock />
    </div>
  );
}
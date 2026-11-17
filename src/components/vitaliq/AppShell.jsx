import { Link, useLocation } from "@tanstack/react-router";
import { Activity, Apple, Bot, Dumbbell, Home, PersonStanding, TrendingUp, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/coach", label: "AI Coach", icon: Bot },
  { to: "/nutrition", label: "Diet", icon: Apple },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/trainer", label: "Trainer", icon: PersonStanding },
  { to: "/insights", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
];

function Brand({ compact }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-cyan-400 to-orange-500 text-slate-950 neon-cyan">
        <Activity className="h-4 w-4" strokeWidth={2.6} />
      </span>
      {!compact && (
        <span className="font-heading text-sm font-semibold tracking-[0.18em] text-white/90">VITALIQ AI</span>
      )}
    </Link>
  );
}

function Rail() {
  const { user } = useAuth();
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-white/10 bg-white/[0.02] px-5 py-7 backdrop-blur-xl lg:flex">
      <Brand />
      <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-white/30">Your companion</p>
      <nav className="mt-3 flex flex-1 flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            activeProps={{ className: "bg-white/[0.07] text-white ring-1 ring-cyan-400/25" }}
            className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-white/55 transition hover:bg-white/5 hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      {user?.role === "admin" && (
        <Link
          to="/command"
          className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-white/60 transition hover:text-white"
        >
          <LayoutDashboard className="h-4 w-4 text-cyan-300" />
          VITALIQ Command
        </Link>
      )}
      <Link
        to="/console"
        className="mt-2 flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs text-white/40 transition hover:text-white"
      >
        <User className="h-3.5 w-3.5" />
        Professional portal
      </Link>
    </aside>
  );
}

function Dock() {
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-[26px] border border-white/10 bg-[#080c14]/80 px-1.5 py-2 backdrop-blur-2xl lg:hidden">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="group flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-white/35 transition"
          activeProps={{ className: "text-cyan-300" }}
        >
          <Icon className="h-[18px] w-[18px]" />
          <span className="text-[9px] font-medium tracking-tight">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen">
      <Rail />
      <div className="lg:pl-64">
        <main className="relative mx-auto w-full max-w-md px-4 pb-28 pt-6 lg:max-w-6xl lg:px-10 lg:pb-14 lg:pt-10">
          {children}
        </main>
      </div>
      <Dock />
    </div>
  );
}
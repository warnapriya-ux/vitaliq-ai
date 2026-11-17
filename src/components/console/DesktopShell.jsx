import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { ArrowLeft, Bot, CalendarClock, CreditCard, LayoutDashboard, ShieldCheck, Tag, Users, UserCog } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { BRAND_LOGO } from "@/lib/brand";
import { Image } from "@/components/ui/image";

const PRO_NAV = [
  { to: "/console", label: "Clients", icon: Users, exact: true },
  { to: "/console/consultations", label: "Consultations", icon: CalendarClock },
];

const ADMIN_NAV = [
  { to: "/command", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/command/users", label: "Users", icon: UserCog },
  { to: "/command/subscriptions", label: "Subscriptions & billing", icon: CreditCard },
  { to: "/command/pricing", label: "Plan pricing", icon: Tag },
  { to: "/command/professionals", label: "Professionals", icon: ShieldCheck },
  { to: "/command/ai", label: "AI engine", icon: Bot },
];

function NavLink({ item }) {
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: !!item.exact }}
      activeProps={{ className: "bg-white/[0.08] text-white ring-1 ring-cyan-400/25" }}
      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-white/50 transition hover:bg-white/5 hover:text-white"
    >
      <item.icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}

export default function DesktopShell({ children }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-white/10 bg-[#070b13]/80 px-4 py-6 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 px-2">
          <Image
            src={BRAND_LOGO}
            alt="VITALIQ AI"
            className="h-9 w-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-cyan-400/25"
          />
          <div>
            <p className="font-heading text-[13px] font-semibold tracking-[0.16em] text-white">VITALIQ</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">{isAdmin ? "Command" : "Professional"}</p>
          </div>
        </div>

        <div className="mt-7 flex-1 space-y-6 overflow-y-auto no-scrollbar">
          <div>
            <p className="px-3 text-[9px] uppercase tracking-[0.22em] text-white/25">Professional portal</p>
            <nav className="mt-2 space-y-1">
              {PRO_NAV.map((item) => (
                <NavLink key={item.to} item={item} />
              ))}
            </nav>
          </div>
          {isAdmin && (
            <div>
              <p className="px-3 text-[9px] uppercase tracking-[0.22em] text-white/25">Command</p>
              <nav className="mt-2 space-y-1">
                {ADMIN_NAV.map((item) => (
                  <NavLink key={item.to} item={item} />
                ))}
              </nav>
            </div>
          )}
        </div>

        <Link
          to="/"
          className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[11px] text-white/45 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to my app
        </Link>
        <div className="mt-3 flex items-center gap-2 px-1">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[11px] font-semibold text-white">
            {(user?.full_name || "V").charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] text-white/70">{user?.full_name || "Team member"}</p>
            <p className="truncate text-[10px] text-white/30">{user?.email}</p>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <main key={location.pathname} className="mx-auto w-full max-w-[1320px] px-5 py-6 lg:px-10 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
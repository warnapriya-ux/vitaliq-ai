import { useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, Bot, Dumbbell, Home, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/coach", label: "AI Coach", icon: Bot },
  { to: "/nutrition", label: "Diet Plan", icon: Apple },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/insights", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
];

function Dock({ wide = false }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-6">
      <nav
        className={cn(
          "flex w-full max-w-[398px] items-center justify-between rounded-[24px] border border-white/10 bg-[#080d16]/92 px-1 py-1.5 backdrop-blur-2xl",
          wide && "md:max-w-[672px]",
        )}
      >
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            resetScroll={false}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-white/35 transition"
            activeProps={{ className: "text-cyan-300 bg-cyan-400/10" }}
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="text-[10px] font-medium leading-none tracking-tight">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const positions = useRef(new Map());
  // The home dashboard is the one screen that uses the extra tablet width.
  const wide = pathname === "/";

  // Remember where each tab was left, so switching tabs feels native instead of resetting.
  useEffect(() => {
    const save = () => positions.current.set(pathname, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    const restore = window.setTimeout(() => window.scrollTo(0, positions.current.get(pathname) ?? 0), 240);
    return () => {
      save();
      window.removeEventListener("scroll", save);
      window.clearTimeout(restore);
    };
  }, [pathname]);

  return (
    <div className="min-h-screen pt-[env(safe-area-inset-top)]">
      <div
        className={cn(
          "relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-white/[0.015] sm:border-x sm:border-white/[0.06]",
          wide && "md:max-w-[720px]",
        )}
      >
        <main className={cn("flex-1 px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-5", wide && "md:px-6")}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Dock wide={wide} />
    </div>
  );
}
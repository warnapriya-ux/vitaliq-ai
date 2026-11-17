import { useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, Bot, Dumbbell, Home, User } from "lucide-react";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/coach", label: "Coach", icon: Bot },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/nutrition", label: "Diet", icon: Apple },
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
            resetScroll={false}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-white/35 transition"
            activeProps={{ className: "text-cyan-300" }}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-medium leading-none tracking-tight">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const positions = useRef(new Map());

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
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-white/[0.015] sm:border-x sm:border-white/[0.06]">
        <main className="flex-1 px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-5">
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
      <Dock />
    </div>
  );
}
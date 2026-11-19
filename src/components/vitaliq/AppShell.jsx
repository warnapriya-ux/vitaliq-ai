import { useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/components/vitaliq/nav";

function Dock() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:absolute lg:inset-x-auto lg:inset-y-auto lg:bottom-0 lg:left-0 lg:right-0 lg:pb-4">
      <nav
        className="flex w-full max-w-[398px] items-center justify-between rounded-[24px] border border-white/10 bg-[#080d16]/92 px-1 py-1.5 backdrop-blur-2xl"
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
            <span className="text-center text-[9.5px] font-medium leading-[1.1] tracking-tight">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const positions = useRef(new Map());
  const scroller = useRef(null);

  // Remember where each tab was left, so switching tabs feels native instead of resetting.
  // On phones the window scrolls; inside the desktop phone frame the panel scrolls.
  useEffect(() => {
    const el = scroller.current;
    const usePanel = Boolean(el && el.scrollHeight > el.clientHeight + 4);
    const save = () => positions.current.set(pathname, usePanel ? el.scrollTop : window.scrollY);
    const target = usePanel ? el : window;
    target.addEventListener("scroll", save, { passive: true });
    const restore = window.setTimeout(() => {
      const y = positions.current.get(pathname) ?? 0;
      if (usePanel) el.scrollTop = y;
      else window.scrollTo(0, y);
    }, 240);
    return () => {
      save();
      target.removeEventListener("scroll", save);
      window.clearTimeout(restore);
    };
  }, [pathname]);

  return (
    <div className="min-h-screen pt-[env(safe-area-inset-top)] lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:px-6 lg:py-8">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-white/[0.015] sm:border-x sm:border-white/[0.06] lg:h-[calc(100vh-4rem)] lg:max-h-[900px] lg:min-h-0 lg:w-[404px] lg:overflow-hidden lg:rounded-[42px] lg:border lg:border-white/15 lg:bg-[#070c15] lg:shadow-[0_50px_140px_-50px_rgba(0,240,255,0.45)]">
        <div ref={scroller} className="flex min-h-0 flex-1 flex-col lg:overflow-y-auto no-scrollbar">
          <main className="flex-1 px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-5 lg:pb-28">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="mx-auto w-full">{children}</div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <Dock />
      </div>
    </div>
  );
}
import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { NAV } from "@/components/vitaliq/nav";

const isTab = (tab, pathname) =>
  tab === "/" ? pathname === "/" : pathname === tab || pathname.startsWith(`${tab}/`);

function Dock({ pathname }) {
  const navigate = useNavigate();

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
            // Re-tapping the tab you are already on returns to that tab's root screen.
            onClick={(event) => {
              if (!isTab(to, pathname)) return;
              event.preventDefault();
              if (pathname !== to) navigate({ to });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex min-h-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-0.5 py-1 text-white/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
            activeProps={{ className: "text-cyan-300 bg-cyan-400/10" }}
          >
            <Icon className="h-5 w-5" />
            <span className="text-center text-[12px] font-medium leading-[1.15] tracking-tight">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const positions = useRef(new Map());
  const lastRoute = useRef(new Map());
  const scroller = useRef(null);

  // Remember the last screen opened inside each tab, so a re-tap can fall back to the tab root.
  useEffect(() => {
    const tab = NAV.find(({ to }) => isTab(to, pathname));
    if (tab) lastRoute.current.set(tab.to, pathname);
  }, [pathname]);

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
      <div className="dark app-canvas relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col lg:bg-none sm:border-x sm:border-white/[0.06] lg:h-[calc(100vh-4rem)] lg:max-h-[900px] lg:min-h-0 lg:w-[404px] lg:overflow-hidden lg:rounded-[42px] lg:border lg:border-white/15 lg:bg-[#070c15] lg:shadow-[0_50px_140px_-50px_rgba(0,240,255,0.45)]">
        <div ref={scroller} className="flex min-h-0 flex-1 flex-col lg:overflow-y-auto no-scrollbar">
          <main className="flex-1 px-4 pb-[calc(8rem+env(safe-area-inset-bottom))] pt-5 lg:pb-28">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <div className="mx-auto w-full">{children}</div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <Dock pathname={pathname} />
      </div>
    </div>
  );
}
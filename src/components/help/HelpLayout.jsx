import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { BRAND_LOGO } from "@/lib/brand";

/**
 * Standalone chrome for the public Help Centre, matching the catalog page so the
 * guide is readable before sign-in and does not need the member app shell.
 */
export default function HelpLayout({ children }) {
  return (
    <div className="dark app-canvas min-h-screen">
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#060b14]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <Link to="/help" className="flex min-w-0 items-center gap-2.5">
            <Image
              src={BRAND_LOGO}
              alt="VITALIQ AI"
              className="h-8 w-8 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10"
            />
            <span className="font-heading text-[13px] font-semibold tracking-[0.14em] text-white">
              VITALIQ <span className="text-cyan-300">AI</span>
            </span>
            <span className="hidden truncate text-[12px] text-white/45 sm:inline">Help centre</span>
          </Link>
          <Link
            to="/"
            className="flex min-h-[40px] shrink-0 items-center rounded-full border border-white/10 px-3.5 text-[11px] text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
          >
            Open my app
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1100px] px-4 py-6 lg:px-8 lg:py-10">{children}</main>

      <footer className="mx-auto w-full max-w-[1100px] px-4 pb-12 lg:px-8">
        <div className="border-t border-white/[0.07] pt-4">
          <p className="text-[11.5px] leading-relaxed text-white/40">
            VITALIQ AI offers wellness guidance, not medical advice. For symptoms, medication or
            anything urgent, contact a qualified healthcare professional, and in an emergency
            contact local emergency services.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/25">
            User guide · Version 1.0 · Reviewed 20 Nov 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/AuthContext";
import { Base44Scripts } from "base44:document";
import appCss from "@/index.css?url";

export const Route = createRootRoute({
  // Per-page <title>/meta come from each route's head(); this is the shared base.
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "color-scheme", content: "dark light" },
      { title: "VITALIQ AI — Your Intelligent Health & Fitness Companion" },
      {
        name: "description",
        content: "AI personal training, nutrition planning, body analysis and progress tracking in one health platform.",
      },
      { name: "theme-color", content: "#0B132B" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "VITALIQ AI" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "VITALIQ AI" },
      { property: "og:title", content: "VITALIQ AI — Your Intelligent Health & Fitness Companion" },
      {
        property: "og:description",
        content: "AI personal training, nutrition planning, body analysis and progress tracking in one health platform.",
      },
      {
        property: "og:image",
        content: "https://media.base44.com/images/public/6afbd52c2f8bd7e10d10de9b/0cd105d8b_appicon.webp",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    // No icon link: the platform adds the app's logo when serving.
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    // VITALIQ stays dark by default; the theme layer only follows the device preference
    // for screens built from design tokens (auth, dialogs, forms).
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

// The document. There is no index.html: the server renders <html> from here.
function RootDocument({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      {/* data-react-root: the builder's preview bridge looks for #root and falls back to this. */}
      <body data-react-root="true">
        {children}
        <Base44Scripts />
        <Scripts />
      </body>
    </html>
  );
}
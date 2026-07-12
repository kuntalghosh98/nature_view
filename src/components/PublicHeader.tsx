"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Trees, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";


export function PublicHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const prefetchedRoutesRef = useRef(new Set<string>());
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = pathname === "/";
  const isHeroMode = isHomePage && !isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const closeMenu = useCallback(() => setOpen(false), []);
  const links = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/projects", label: "Projects" },
      { href: "/attractions", label: "Attractions" },
      { href: "/news", label: "News" },
      { href: "/events", label: "Events" },
      { href: "/impact", label: "Impact" },
      { href: "/team", label: "Team" },
      { href: "/contact", label: "Contact" },
    ],
    []
  );

  const prefetchRoute = useCallback((href: string) => {
    if (href === pathname || prefetchedRoutesRef.current.has(href)) return;
    router.prefetch(href);
    prefetchedRoutesRef.current.add(href);
  }, [pathname, router]);

  const palette = {
    textPrimary: isHeroMode ? "#ffffff" : "#1f2f25",
    textMuted: isHeroMode ? "rgba(255,255,255,0.72)" : "#4d5d52",
    navBackground: isHeroMode ? "rgba(7, 20, 15, 0.46)" : "rgba(255, 255, 255, 0.92)",
    navBorder: isHeroMode ? "rgba(255,255,255,0.22)" : "rgba(23, 23, 23, 0.12)",
    activeBg: isHeroMode ? "rgba(255,255,255,0.16)" : "#d1fae5",
    activeText: isHeroMode ? "#ffffff" : "#065f46",
    chipBg: isHeroMode ? "rgba(255,255,255,0.1)" : "#f3f4f6",
    chipBorder: isHeroMode ? "rgba(255,255,255,0.28)" : "#e5e7eb",
    hoverBg: isHeroMode ? "rgba(255,255,255,0.14)" : "#f7f7f2",
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-xl focus:outline-none"
        style={{ backgroundColor: "#15803d" }}
      >
        Skip to content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 border-b backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300"
        style={{
          backgroundColor: palette.navBackground,
          borderColor: palette.navBorder,
          boxShadow: isHeroMode
            ? "0 1px 0 rgba(255,255,255,0.08) inset"
            : "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Nature View" className="group flex shrink-0 items-center gap-3">
            <span
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 backdrop-blur-md transition-all duration-300"
              style={{
                backgroundColor: isHeroMode ? "rgba(255,255,255,0.18)" : "#f7f7f2",
                color: isHeroMode ? "#ffffff" : "#15803d",
                borderColor: palette.navBorder,
                boxShadow: isHeroMode ? "none" : "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <Trees size={20} />
            </span>
            <span className="hidden text-lg font-bold tracking-tight sm:inline" style={{ color: palette.textPrimary }}>
              Nature View
            </span>
          </Link>

          <nav role="navigation" aria-label="Menu" className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-300"
                  style={{
                    color: active ? palette.activeText : palette.textMuted,
                    backgroundColor: active ? palette.activeBg : "transparent",
                  }}
                  onMouseEnter={(event) => {
                    prefetchRoute(link.href);
                    if (!active) event.currentTarget.style.backgroundColor = palette.hoverBg;
                  }}
                  onFocus={() => prefetchRoute(link.href)}
                  onMouseLeave={(event) => {
                    if (!active) event.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {link.label}
                  {active ? (
                    <span
                      className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                      style={{ backgroundColor: palette.activeText }}
                    />
                  ) : (
                    <span
                      className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 rounded-full transition-all duration-300 group-hover:w-1/2"
                      style={{ backgroundColor: palette.textMuted }}
                    />
                  )}
                </Link>
              );
            })}

          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              aria-label={open ? "Close" : "Menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((current) => !current)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300"
              style={{
                color: palette.textPrimary,
                borderColor: palette.navBorder,
                backgroundColor: palette.chipBg,
              }}
            >
              <>
                {open ? (
                  <span
                    key="close"
                  >
                    <X size={20} />
                  </span>
                ) : (
                  <span
                    key="menu"
                  >
                    <Menu size={20} />
                  </span>
                )}
              </>
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            role="navigation"
            aria-label="Menu"
            className="absolute inset-x-0 top-full z-50 border-t lg:hidden"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              backgroundColor: "rgba(7, 20, 15, 0.96)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div className="border-b px-5 py-4 text-center" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">Explore, Conserve, Sustain</p>
            </div>

            <nav className="max-h-[70vh] overflow-y-auto px-5 py-6">
              <div className="space-y-1.5">
                {links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <div key={link.href}>
                      <Link
                        href={link.href}
                        onClick={closeMenu}
                        onTouchStart={() => prefetchRoute(link.href)}
                        onFocus={() => prefetchRoute(link.href)}
                        aria-current={active ? "page" : undefined}
                        className="group flex items-center gap-4 rounded-2xl px-5 py-4 text-base font-medium transition-all duration-300"
                        style={{
                          color: active ? "#ffffff" : "rgba(255,255,255,0.72)",
                          backgroundColor: active ? "rgba(255,255,255,0.16)" : "transparent",
                          border: active ? "1px solid rgba(255,255,255,0.22)" : "1px solid transparent",
                        }}
                      >
                        <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                          <span
                            className="absolute inline-flex h-full w-full rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: active ? "#ffffff" : "rgba(255,255,255,0.35)",
                            }}
                          />
                        </span>
                        {link.label}
                        {active && <ArrowHint />}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </nav>

            <div className="border-t px-5 py-4 text-center" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
              <p className="text-xs text-white/40">© {new Date().getFullYear()} Nature View</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function ArrowHint() {
  return (
    <span className="ml-auto text-white/70">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}



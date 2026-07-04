"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Trees } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/providers/LocaleProvider";

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [isHome]);

  // On home page: transparent until scrolled; on other pages: always solid
  const solid = !isHome || scrolled;

  const links = [
    { href: "/", label: t('header.nav.home') },
    { href: "/search", label: t('header.nav.search') },
    { href: "/projects", label: t('header.nav.projects') },
    { href: "/attractions", label: t('header.nav.attractions') },
    { href: "/news", label: t('header.nav.news') },
    { href: "/events", label: t('header.nav.events') },
    { href: "/impact", label: t('header.nav.impact') },
    { href: "/team", label: t('header.nav.team') },
    { href: "/contact", label: t('header.nav.contact') }
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        solid
          ? "border-forest-900/10 bg-white/95 backdrop-blur"
          : "border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={`flex items-center gap-3 text-lg font-semibold transition-colors duration-300 ${
            solid ? "text-forest-900" : "text-white"
          }`}
        >
          <span
            className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl transition-colors duration-300 ${
              solid ? "bg-forest-700 text-white" : "bg-white/20 text-white backdrop-blur-sm"
            }`}
          >
            <Trees size={20} />
          </span>
          {t('header.title')}
        </Link>

        <div className="flex items-center gap-3 lg:hidden">
          <div
            className={`flex overflow-hidden rounded-full border p-0.5 transition-colors duration-300 ${
              solid ? "border-forest-900/10 bg-forest-50" : "border-white/25 bg-white/10"
            }`}
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                locale === "en"
                  ? "bg-forest-700 text-white"
                  : solid ? "bg-white text-forest-900" : "bg-transparent text-white"
              }`}
            >
              {t('header.language.en')}
            </button>
            <button
              type="button"
              onClick={() => setLocale("bn")}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                locale === "bn"
                  ? "bg-forest-700 text-white"
                  : solid ? "bg-white text-forest-900" : "bg-transparent text-white"
              }`}
            >
              {t('header.language.bn')}
            </button>
          </div>

          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-300 ${
              solid
                ? "border-forest-900/10 text-forest-900"
                : "border-white/25 text-white"
            }`}
            onClick={() => setOpen((current) => !current)}
            aria-label={t('header.toggle')}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-forest-700 text-white"
                    : solid
                    ? "text-forest-900/75 hover:bg-forest-50 hover:text-forest-900"
                    : "text-white/80 hover:bg-white/15 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div
            className={`ml-4 flex overflow-hidden rounded-full border transition-colors duration-300 ${
              solid ? "border-forest-900/10" : "border-white/25"
            }`}
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`px-3 py-2 text-sm transition ${
                locale === "en"
                  ? "bg-forest-700 text-white"
                  : solid ? "bg-white text-forest-900" : "bg-transparent text-white/80"
              }`}
            >
              {t('header.language.en')}
            </button>
            <button
              type="button"
              onClick={() => setLocale("bn")}
              className={`px-3 py-2 text-sm transition ${
                locale === "bn"
                  ? "bg-forest-700 text-white"
                  : solid ? "bg-white text-forest-900" : "bg-transparent text-white/80"
              }`}
            >
              {t('header.language.bn')}
            </button>
          </div>
        </nav>
      </div>

      {open ? (
        <div className={`border-t lg:hidden ${
          solid ? "border-forest-900/10 bg-white/95" : "border-white/15 bg-black/40 backdrop-blur-xl"
        }`}>
          <div className="space-y-1 px-4 py-4">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-forest-700 text-white"
                      : solid
                      ? "text-forest-900/75 hover:bg-forest-50 hover:text-forest-900"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}

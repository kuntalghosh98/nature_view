"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, Newspaper, Sparkles, Users, Mail, Folder, Trees } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/projects", label: "Projects" },
  { href: "/attractions", label: "Attractions" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/impact", label: "Impact" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" }
];

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest-900/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-forest-900">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-700 text-white">
            <Trees size={20} />
          </span>
          Nature View
        </Link>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-forest-900/10 text-forest-900 lg:hidden"
          onClick={() => setOpen((current) => !current)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "bg-forest-700 text-white" : "text-forest-900/75 hover:bg-forest-50 hover:text-forest-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {open ? (
        <div className="border-t border-forest-900/10 bg-white/95 lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-forest-700 text-white" : "text-forest-900/75 hover:bg-forest-50 hover:text-forest-900"
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

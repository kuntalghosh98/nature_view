"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Trees,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const socialLinks = [
  { key: "facebook", icon: Facebook, href: "#" },
  { key: "instagram", icon: Instagram, href: "#" },
  { key: "twitter", icon: Twitter, href: "#" },
  { key: "youtube", icon: Youtube, href: "#" },
  { key: "linkedin", icon: Linkedin, href: "#" },
];

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/attractions", label: "Attractions" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/search", label: "Search" },
];

const orgLinks = [
  { href: "/impact", label: "Impact" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export function PublicFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const prefetchedRoutesRef = useRef(new Set<string>());
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const prefetchRoute = useCallback((href: string) => {
    if (href === pathname || prefetchedRoutesRef.current.has(href)) return;
    router.prefetch(href);
    prefetchedRoutesRef.current.add(href);
  }, [pathname, router]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
    // Reset after 4 seconds
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <footer className="relative border-t border-forest-900/10 bg-forest-950 text-forest-50" role="contentinfo">
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forest-600/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand + Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-bold text-white hover:text-forest-200 transition-colors">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-700 text-white shadow-lg">
                <Trees size={20} />
              </span>
              Nature View
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-forest-100/70 max-w-sm">
              Protecting biodiversity and empowering communities through sustainable eco-tourism and conservation projects.
            </p>
            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ key, icon: Icon, href }) => (
                <a
                  key={key}
                  href={href}
                  aria-label={key}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-forest-800 bg-forest-900/50 text-forest-300 transition-all duration-300 hover:border-forest-600 hover:bg-forest-800 hover:text-white hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-forest-400">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onMouseEnter={() => prefetchRoute(href)}
                    onFocus={() => prefetchRoute(href)}
                    onTouchStart={() => prefetchRoute(href)}
                    className="group inline-flex items-center gap-2 text-sm text-forest-100/70 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-forest-600 transition-all duration-300 group-hover:bg-forest-400 group-hover:w-2" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Organization */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-forest-400">
              Organization
            </h3>
            <ul className="mt-5 space-y-3">
              {orgLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onMouseEnter={() => prefetchRoute(href)}
                    onFocus={() => prefetchRoute(href)}
                    onTouchStart={() => prefetchRoute(href)}
                    className="group inline-flex items-center gap-2 text-sm text-forest-100/70 transition-colors hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-forest-600 transition-all duration-300 group-hover:bg-forest-400 group-hover:w-2" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-forest-400">
              Newsletter
            </h3>
            <p className="mt-2 text-xs text-forest-100/60">
              Stay updated with our latest conservation news.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Email address"
                  aria-label="Email address"
                  className={`w-full rounded-xl border bg-forest-900/60 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-forest-400 transition-all duration-300 focus:outline-none focus:ring-2 ${
                    status === "error"
                      ? "border-red-500/50 focus:ring-red-500/30"
                      : "border-forest-800 focus:border-forest-600 focus:ring-forest-600/30"
                  }`}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-forest-700 text-white transition-all duration-300 hover:bg-forest-600 hover:scale-105"
                >
                  <Send size={13} />
                </button>
              </div>
              {/* Status feedback */}
              {status === "success" && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-400 animate-fade-in-up">
                  <CheckCircle2 size={13} />
                  Subscribed successfully!
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center gap-1.5 text-xs text-red-400 animate-fade-in-up">
                  <AlertCircle size={13} />
                  Invalid email.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-forest-800/60 pt-8 sm:flex-row">
          <p className="text-xs text-forest-400">
            © {new Date().getFullYear()} Nature View. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-xs">
            <Link href="/privacy" className="text-forest-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-forest-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <button type="button" className="text-forest-400 hover:text-white transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

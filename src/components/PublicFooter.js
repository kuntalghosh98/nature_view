/* eslint-disable no-unused-vars, unicode-bom, jsx-a11y/anchor-is-valid */
import { memo, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Trees,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const socialLinks = [
  { key: "facebook", href: "https://facebook.com", color: "#1877F2" },
  { key: "twitter", href: "https://twitter.com", color: "#1DA1F2" },
  { key: "linkedin", href: "https://linkedin.com", color: "#0A66C2" },
  { key: "instagram", href: "https://instagram.com", color: "#E4405F" },
  { key: "youtube", href: "https://youtube.com", color: "#FF0000" },
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

const PublicFooterInner = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isAdmin = pathname.startsWith("/admin");
  const prefetchedRoutesRef = useRef(new Set());
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  // Ensure hooks are called unconditionally before any early return

  const prefetchRoute = useCallback((href) => {
    if (href === pathname || prefetchedRoutesRef.current.has(href)) return;
    prefetchedRoutesRef.current.add(href);
  }, [pathname]);

  // Return early for admin routes after all hooks have been called
  if (isAdmin) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <footer className="w-full bg-white text-gray-600 font-sans antialiased" role="contentinfo">
      
     {/* 1. Large Top Banner Layout from Reference Image */}
<div className="w-full px-4 pt-12 pb-8 flex flex-col items-center justify-center overflow-hidden border-b border-gray-100">
  <div className="flex flex-row items-center justify-center gap-3 sm-6 md-8 max-w-full">
    
    {/* Nature Text with Background Image */}
    <span 
      className="text-6xl sm-7xl md-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-cover bg-center select-none"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dkhhjhpbc/image/upload/f_auto,q_auto/v1784298186/dima-solomin-1E20o4B6S9s-unsplash_1_xeltil.jpg')" }}
    >
      Nature
    </span>

    {/* Central Logo Graphic */}
    <div className="relative flex-shrink-0 w-16 h-16 sm-28 sm-28 md-36 md-36 flex items-center justify-center">
      <div className="absolute inset-0  rounded-full opacity-90" />
      {/* Dynamic leaf/people silhouettes can be an SVG or image here */}
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dkhhjhpbc/image/upload/f_auto,q_auto/charcoal_pn8u2w.png')] bg-contain bg-no-repeat bg-center scale-110" />
    </div>

    {/* Future Text with Background Image */}
    <span 
      className="text-6xl sm-7xl md-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-cover bg-center select-none"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dkhhjhpbc/image/upload/f_auto,q_auto/v1784298186/dima-solomin-1E20o4B6S9s-unsplash_1_xeltil.jpg')" }}
    >
      View
    </span>
  </div>
</div>

      {/* 2. Main Content Links Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12 md-16">
        {/* Mobile-focused responsive layout*/}
        <div className="grid grid-cols-1 gap-10 sm-cols-2 lg-cols-5 items-start">
          
          {/* Brand Info Column */}
          <div className="lg-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-gray-900 hover-green-700 transition-colors">
              <span className="text-emerald-600"><Trees size={22} /></span> 
              Nature View
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-sm">
              Protecting biodiversity and empowering communities through sustainable eco-tourism and conservation projects.
            </p>
            {/* Colorful Social Links directly matching reference image look */}
            <div className="flex items-center gap-3 pt-2">
                {socialLinks.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  aria-label={key}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                >
                  {key}
                </a>
                ))}
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onMouseEnter={() => prefetchRoute(href)}
                    className="text-sm text-gray-500 hover-green-600 transition-colors block py-0.5"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide">Organization</h3>
            <ul className="mt-4 space-y-2.5">
              {orgLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onMouseEnter={() => prefetchRoute(href)}
                    className="text-sm text-gray-500 hover-green-600 transition-colors block py-0.5"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wide">Newsletter</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Stay updated with our latest conservation news.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
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
                  className={`w-full rounded-xl border bg-gray-50 px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus-none focus-2 ${
                    status === "error"
                      ? "border-red-400 focus-red-100"
                      : "border-gray-200 focus-green-500 focus-green-100"
                  }`}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-green-600 text-white transition-all hover-green-700"
                >
                  <Send size={12} />
                </button>
              </div>
              {status === "success" && (
                <p className="flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 size={12} /> Subscribed successfully!
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle size={12} /> Invalid email.
                </p>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* 3. Bottom Copyright Bar */}
      <div className="bg-[#F8FAFC] border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            Ãƒâ€šÃ‚Â© {new Date().getFullYear()} Copywrite By Naturo
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover-green-600 transition-colors">
              Terms & Condition
            </Link>
            <Link href="/privacy" className="hover-green-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(PublicFooterInner);

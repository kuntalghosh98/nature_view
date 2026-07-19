// import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
// import { Menu, X } from "lucide-react";

// // Simple public header with navigation links
// export function PublicHeader() {
//   const location = useLocation();
//   // State to control mobile menu visibility
//   const [open, setOpen] = useState(false);

//   // Updated navigation links to use React Router's "to" prop instead of "href"
//   // This ensures proper client-side navigation without full page reloads.
//   const links = [
//     { to: "/", label: "Home" },
//     { to: "/projects", label: "Projects" },
//     { to: "/attractions", label: "Attractions" },
//     { to: "/news", label: "News" },
//     { to: "/events", label: "Events" },
//     { to: "/impact", label: "Impact" },
//     { to: "/team", label: "Team" },
//     { to: "/contact", label: "Contact" },
//   ];

//   return (
//     <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
//       <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
//         <Link to="/" className="text-xl font-bold text-forest-900">Nature View</Link>
//         {/* Desktop navigation */}
//         <ul className="hidden md:flex space-x-4">
//           {links.map((link) => (
//             <li key={link.to}>
//               <Link
//                 to={link.to}
//                 className={`text-sm font-medium ${location.pathname === link.to ? "text-forest-600" : "text-forest-400"}`}
//               >
//                 {link.label}
//               </Link>
//             </li>
//           ))}
//         </ul>
//         {/* Mobile menu button */}
//         <button
//           className="md:hidden text-forest-600 focus:outline-none"
//           onClick={() => setOpen(!open)}
//           aria-label="Toggle navigation"
//         >
//           {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </nav>
//       {/* Mobile navigation panel */}
//       {open && (
//         <div className="md:hidden bg-white border-t border-b border-neutral-200">
//           <ul className="flex flex-col space-y-2 p-4">
//             {links.map((link) => (
//               <li key={link.to}>
//                 <Link
//                   to={link.to}
//                   className={`block text-sm font-medium ${location.pathname === link.to ? "text-forest-600" : "text-forest-400"}`}
//                   onClick={() => setOpen(false)}
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </header>
//   );
// }

// export default PublicHeader;


import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Leaf } from "lucide-react";

/**
 * PublicHeader
 * -----------------------------------------------------------------------
 * Shares the Nature View design tokens with the homepage: ink / canopy /
 * moss / lichen / sand / ivory, Fraunces + Inter + JetBrains Mono.
 *
 * Behaviour:
 *   - On "/" (the hero route), the header starts fully transparent so the
 *     cinematic hero reads uninterrupted, then crossfades to a solid,
 *     blurred ink bar once the page scrolls past the hero.
 *   - On every other route (no full-bleed hero to protect), it's solid
 *     from the first frame so nav text stays legible over normal content.
 *
 * NOTE: the Google Fonts import lives in HomePage.jsx — if this header can
 * mount without the homepage (e.g. on a deep link), move that @import into
 * your global stylesheet / index.html so fonts are guaranteed to load.
 * -----------------------------------------------------------------------
 */

const links = [
  { to: "/", label: "Home" },
  { to: "/attractions", label: "Explore" },
  { to: "/projects", label: "Field Log" },
  { to: "/impact", label: "Conservation" },
  { to: "/events", label: "Events" },
  { to: "/news", label: "Dispatches" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";
  const solid = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "bg-[#0B1610]/92 backdrop-blur-md shadow-[0_1px_0_0_rgba(255,255,255,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <Link to="/" className="flex items-center gap-2 text-[#FAF6EE]">
          <Leaf className="h-4 w-4 text-[#B7E8A8]" />
          <span className="font-['Fraunces'] text-lg tracking-tight">Nature&nbsp;View</span>
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`relative font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-[#FAF6EE]" : "text-[#EAE6DA]/70 hover:text-[#FAF6EE]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#B7E8A8]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          to="/contact"
          className="hidden rounded-full bg-[#FAF6EE] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#0B1610] transition-colors hover:bg-[#B7E8A8] lg:inline-flex"
        >
          Plan a Trip
        </Link>

        {/* Mobile menu button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#FAF6EE] lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile navigation panel */}
      <div
        className={`fixed inset-0 top-16 z-40 bg-[#0B1610] transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-0 px-6 py-8">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <li key={link.to} className="border-b border-white/10">
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between py-4 font-['Fraunces'] text-2xl ${
                    active ? "text-[#B7E8A8]" : "text-[#FAF6EE]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          to="/contact"
          onClick={() => setOpen(false)}
          className="mx-6 mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#FAF6EE] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#0B1610]"
        >
          Plan a Trip
        </Link>
      </div>
    </header>
  );
}

export default PublicHeader;
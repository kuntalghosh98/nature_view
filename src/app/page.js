


import { Link } from "react-router-dom";
import { useLocale } from "@/providers/LocaleProvider";
import { apiRequest } from "@/lib/api";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { resolveMediaUrl } from "@/lib/media";
import { ArrowRight, ArrowUpRight, Calendar, MapPin, Leaf, Quote } from "lucide-react";
import { formatLocalizedDate } from "@/lib/utils";
import { loadInitialData } from "@/lib/initialLoad";
import { useEffect, useRef, useState } from "react";

/**
 * Nature View ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Homepage (bold pass)
 * -----------------------------------------------------------------------
 * Palette
 *   Ink     #0B1610  near-black emerald ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â primary dark ground
 *   Canopy  #1B2B20  a second, slightly lighter dark green for layering
 *   Moss    #78895A  quiet working accent ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â eyebrows, secondary links
 *   Lichen  #B7E8A8  a single pale, almost bioluminescent accent ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â spent
 *                    ONLY on the trail rail, waypoints, active states and
 *                    the masked stat numeral. Never used as a fill colour.
 *   Clay    #A85B34  warm ember ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â reserved for one CTA hover
 *   Sand    #EFE9DC  warm paper ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â light section backgrounds
 *   Ivory   #FAF6EE  text-on-dark / card surfaces
 *
 *   Display Fraunces Ãƒâ€šÃ‚Â· Body Inter Ãƒâ€šÃ‚Â· Utility JetBrains Mono
 *
 * Signature system (the "one real risk"):
 *   A scroll-drawn trail line runs down the left rail of the entire page
 *   (desktop only) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â a thin path that fills with the lichen accent as you
 *   scroll, with waypoint dots that light up as you pass each section.
 *   It's the same visual idea as the wayfinding markers hikers actually
 *   use, made literal as the page's navigation spine.
 *
 * NOTE: PublicHeader is now a separate, shared component ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â this file no
 * longer renders its own nav. Google Fonts are still injected locally for
 * portability; move the @import into index.html in production.
 * -----------------------------------------------------------------------
 */

const fallbacks = {
  project: "/fallbacks/project.jpg",
  attraction: "/fallbacks/attraction.jpg",
  story: "/fallbacks/story.jpg",
};

const BRAND_IMG =
  "https://res.cloudinary.com/dkhhjhpbc/image/upload/f_auto,q_auto/v1783278022/nature_view/home/tn7v79buqhisnzttngkx.jpg";

// ---------------------------------------------------------------------------
// Data helpers (unchanged behaviour)
// ---------------------------------------------------------------------------
async function getProjects() {
  try {
    const res = await apiRequest("/projects");
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    return [];
  } catch {
    return [];
  }
}
async function getAttractions() {
  try {
    const res = await apiRequest("/attractions");
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    return [];
  } catch {
    return [];
  }
}
async function getNews() {
  try {
    const res = await apiRequest("/news");
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    return [];
  } catch {
    return [];
  }
}
async function getEvents() {
  try {
    const res = await apiRequest("/events");
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.items)) return res.items;
    return [];
  } catch {
    return [];
  }
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------
function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1100ms] ease-out motion-reduce:transition-none motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

// The one orchestrated moment: an image starts zoomed on a texture detail
// and pulls back to the full landscape as the section enters view.
function ZoomReveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className={`h-full w-full transition-transform duration-[2200ms] ease-out motion-reduce:transition-none motion-reduce:scale-100 ${
          visible ? "scale-100" : "scale-[1.4]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

// Counts up once in view. Skips the animation entirely if the visitor has
// asked the OS for reduced motion.
function Counter({ to, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(prefersReducedMotion() ? to : 0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min(1, (now - start) / duration);
            setValue(Math.floor(p * to));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

function TrailDivider() {
  return (
    <div className="w-full overflow-hidden" aria-hidden="true">
      <svg viewBox="0 0 400 44" preserveAspectRatio="none" className="h-9 w-full">
        <path
          d="M0,22 C55,2 95,42 150,22 C205,2 245,42 300,22 C330,10 365,34 400,20"
          fill="none"
          stroke="#78895A"
          strokeWidth="1.25"
          strokeDasharray="1 7"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx="150" cy="22" r="3" fill="#78895A" />
      </svg>
    </div>
  );
}

function Eyebrow({ children, tone = "dark" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.24em] ${
        tone === "light" ? "text-[#CBD6BE]" : "text-[#5E6E4C]"
      }`}
    >
      <span className={`h-1 w-1 rounded-full ${tone === "light" ? "bg-[#CBD6BE]" : "bg-[#5E6E4C]"}`} />
      {children}
    </span>
  );
}

// Signature element: fixed left rail, draws itself as the whole page scrolls,
// with waypoint dots that light up once you've scrolled past each section.
function ScrollTrail({ sectionCount = 6 }) {
  const [progress, setProgress] = useState(0);
  const reduced = useRef(prefersReducedMotion());

  useEffect(() => {
    if (reduced.current) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const p = scrollable > 0 ? window.scrollY / scrollable : 0;
        setProgress(Math.min(1, Math.max(0, p)));
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (reduced.current) return null;

  const waypoints = Array.from({ length: sectionCount }, (_, i) => i / (sectionCount - 1));
  const PATH =
    "M12,0 C4,90 20,180 12,270 C4,360 20,450 12,540 C4,630 20,720 12,810 C4,900 20,950 12,1000";

  return (
    <div
      className="pointer-events-none fixed left-6 top-0 z-30 hidden h-screen w-6 xl:block"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 1000" preserveAspectRatio="none" className="h-full w-full">
        <path d={PATH} fill="none" stroke="rgba(183,232,168,0.16)" strokeWidth="1.5" />
        <path
          d={PATH}
          fill="none"
          stroke="#B7E8A8"
          strokeWidth="1.5"
          strokeDasharray="1400"
          strokeDashoffset={1400 * (1 - progress)}
          style={{ transition: "stroke-dashoffset 150ms linear" }}
        />
        {waypoints.map((wp, i) => (
          <circle
            key={i}
            cx="12"
            cy={wp * 1000}
            r={progress >= wp - 0.015 ? 4 : 2.5}
            fill={progress >= wp - 0.015 ? "#B7E8A8" : "rgba(183,232,168,0.3)"}
            style={{ transition: "r 200ms ease, fill 200ms ease" }}
          />
        ))}
      </svg>
    </div>
  );
}

// Fixed, curated positions for the expedition map ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â sized and placed like
// pins hand-set on a field map rather than cells in a grid. Falls back to a
// simple horizontal filmstrip below xl, where irregular absolute layout
// stops making sense on a narrow screen.
const MAP_PINS = [
  { top: "4%", left: "6%", w: "w-40", h: "h-52", z: 3 },
  { top: "0%", left: "40%", w: "w-28", h: "h-36", z: 2 },
  { top: "30%", left: "64%", w: "w-64", h: "h-44", z: 4 },
  { top: "56%", left: "16%", w: "w-36", h: "h-48", z: 2 },
  { top: "64%", left: "52%", w: "w-28", h: "h-36", z: 1 },
];
const MAP_PATH_POINTS = "13,30 54,18 96,52 34,80 66,82";

// ---------------------------------------------------------------------------
// Main homepage component
// ---------------------------------------------------------------------------
export default function HomePage() {
  const { locale } = useLocale();
  const [projects, setProjects] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function init() {
      await loadInitialData();
      const [proj, attr, nw, ev] = await Promise.all([
        getProjects(),
        getAttractions(),
        getNews(),
        getEvents(),
      ]);
      setProjects(proj);
      setAttractions(attr);
      setNews(nw);
      setEvents(ev);
    }
    init();
  }, []);

  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeAttractions = Array.isArray(attractions) ? attractions : [];
  const safeNews = Array.isArray(news) ? news : [];
  const safeEvents = Array.isArray(events) ? events : [];

  const spotlightProject = safeProjects[0];
  const galleryProjects = safeProjects.slice(0, 6);
  const featuredAttractions = safeAttractions.slice(0, 5);
  const headlineNews = safeNews.slice(0, 3);
  const upComingEvents = safeEvents.slice(0, 4);
  const heroImage = resolveMediaUrl(spotlightProject?.featuredImage, BRAND_IMG || fallbacks.project);

  return (
    <main
      id="main-content"
      className="relative overflow-x-hidden bg-[#EFE9DC] font-['Inter'] text-[#0B1610] selection:bg-[#0B1610] selection:text-[#FAF6EE]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>

      <ScrollTrail sectionCount={7} />

      {/* ============================================================= */}
      {/* 1 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â HERO ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â layered parallax canopy, minimal text               */}
      {/* ============================================================= */}
      <ParallaxHero heroImage={heroImage} />

      {/* ============================================================= */}
      {/* 2 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â MANIFESTO                                                   */}
      {/* ============================================================= */}
      <section className="px-5 py-24 sm:px-8 sm:py-32 xl:pl-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>The Idea</Eyebrow>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-8">
            <p className="font-['Fraunces'] text-[8vw] font-normal leading-[1.05] tracking-tight text-[#0B1610] sm:text-4xl lg:text-5xl">
              Every trail we open is a place we help protect ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â
              <span className="text-[#5E6E4C]"> tourism that pays its way back into the ground it stands on.</span>
            </p>
          </Reveal>
        </div>
      </section>

      <TrailDivider />

      {/* ============================================================= */}
      {/* 3 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â EXPEDITION MAP ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â destinations pinned, not gridded          */}
      {/* ============================================================= */}
      {featuredAttractions.length > 0 && (
        <section className="px-5 py-20 sm:px-8 sm:py-28 xl:pl-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-end justify-between">
              <Reveal>
                <Eyebrow>See &amp; Do</Eyebrow>
                <h2 className="font-['Fraunces'] mt-2 text-3xl font-normal tracking-tight text-[#0B1610] sm:text-4xl">
                  Pinned on the field map
                </h2>
              </Reveal>
              <Link
                to="/attractions"
                className="hidden items-center gap-1 font-['JetBrains_Mono'] text-xs uppercase tracking-[0.15em] text-[#0B1610] transition-colors hover:text-[#5E6E4C] sm:flex"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Desktop: irregular pinned map */}
            <Reveal className="relative hidden h-[760px] w-full xl:block">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <polyline
                  points={MAP_PATH_POINTS}
                  fill="none"
                  stroke="#78895A"
                  strokeWidth="0.3"
                  strokeDasharray="0.6 1.6"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
              {featuredAttractions.map((attraction, i) => {
                const pin = MAP_PINS[i % MAP_PINS.length];
                return (
                  <Link
                    key={attraction._id}
                    to={`/attractions/${attraction.slug}`}
                    style={{ top: pin.top, left: pin.left, zIndex: pin.z }}
                    className={`group absolute ${pin.w} ${pin.h} overflow-hidden rounded-2xl border-4 border-[#EFE9DC] shadow-xl transition-transform duration-500 hover:-translate-y-1.5`}
                  >
                    <img
                      src={resolveMediaUrl(attraction.featuredImage, fallbacks.attraction)}
                      alt={getLocalizedText(attraction.title, locale)}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610]/80 via-transparent to-transparent" />
                    <div className="absolute inset-x-3 bottom-3">
                      {attraction.location && (
                        <span className="mb-1 flex items-center gap-1 font-['JetBrains_Mono'] text-[9px] uppercase tracking-wider text-[#B7E8A8]">
                          <MapPin className="h-2.5 w-2.5" /> {attraction.location}
                        </span>
                      )}
                      <span className="font-['Fraunces'] text-sm leading-snug text-[#FAF6EE]">
                        {getLocalizedText(attraction.title, locale)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </Reveal>

            {/* Below xl: quiet horizontal filmstrip fallback */}
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4 pt-2 sm:gap-6 xl:hidden">
              {featuredAttractions.map((attraction) => (
                <Link
                  key={attraction._id}
                  to={`/attractions/${attraction.slug}`}
                  className="group relative aspect-[3/4] w-[64vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#e4ddcc] sm:w-64"
                >
                  <img
                    src={resolveMediaUrl(attraction.featuredImage, fallbacks.attraction)}
                    alt={getLocalizedText(attraction.title, locale)}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610]/75 to-transparent" />
                  {attraction.location && (
                    <span className="absolute left-4 top-4 flex items-center gap-1 font-['JetBrains_Mono'] text-[10px] uppercase tracking-wider text-[#B7E8A8]">
                      <MapPin className="h-3 w-3" /> {attraction.location}
                    </span>
                  )}
                  <h3 className="font-['Fraunces'] absolute inset-x-4 bottom-4 text-lg leading-snug text-[#FAF6EE]">
                    {getLocalizedText(attraction.title, locale)}
                  </h3>
                  <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-[#FAF6EE] opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* 4 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â MISSION + LIVE IMPACT ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â image-masked numeral, live ticker  */}
      {/* ============================================================= */}
      <section id="mission" className="bg-[#0B1610] px-5 py-24 sm:px-8 sm:py-32 xl:pl-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-7">
              <Eyebrow tone="light">Our Mission</Eyebrow>
              <h2 className="font-['Fraunces'] mt-3 text-4xl font-normal tracking-tight text-[#FAF6EE] sm:text-5xl">
                Protecting nature,
                <br /> one journey at a time.
              </h2>
            </Reveal>
            <Reveal delay={100} className="flex items-center gap-4 lg:col-span-5 lg:justify-end">
              <Link
                to="/contact"
                className="rounded-full bg-[#FAF6EE] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#0B1610] transition-colors hover:bg-[#B7E8A8]"
              >
                About Us
              </Link>
              <Link
                to="/projects"
                className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#EAE6DA] transition-colors hover:text-[#B7E8A8]"
              >
                View Campaigns <ArrowRight className="h-3 w-3" />
              </Link>
            </Reveal>
          </div>

          {/* Image-masked stat numeral */}
          <div className="mt-16 grid grid-cols-1 gap-5 sm:mt-20 lg:grid-cols-12">
            <Reveal className="relative overflow-hidden rounded-[2rem] bg-[#1B2B20] lg:col-span-7">
              <div className="relative aspect-[4/3] w-full lg:aspect-[16/10]">
                <img src={BRAND_IMG} alt="Coastline restoration underway" className="absolute inset-0 h-full w-full object-cover opacity-25" />
                <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                  <span
                    className="font-['Fraunces'] block bg-clip-text text-[24vw] font-semibold leading-none text-transparent sm:text-8xl"
                    style={{
                      backgroundImage: `url(${BRAND_IMG})`,
                      backgroundSize: "cover",
                      backgroundPosition: "60% 40%",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    70%
                  </span>
                  <p className="mt-3 max-w-xs text-sm text-[#EAE6DA]/85">
                    of every trip's proceeds fund conservation and coastline restoration work.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-5 lg:col-span-5 lg:grid-cols-1">
              <Reveal delay={80} className="flex flex-col justify-between rounded-[2rem] bg-[#1B2B20] p-6 sm:p-8">
                <span className="font-['Fraunces'] text-4xl font-light text-[#FAF6EE]">100%</span>
                <h3 className="font-['Fraunces'] mt-6 text-lg font-normal text-[#FAF6EE]">Traveller satisfaction</h3>
              </Reveal>
              <Reveal delay={140} className="flex flex-col justify-between rounded-[2rem] bg-[#FAF6EE] p-6 sm:p-8">
                <span className="font-['Fraunces'] text-4xl font-light text-[#0B1610]">
                  <Counter to={24000} suffix="+" />
                </span>
                <h3 className="font-['Fraunces'] mt-6 text-lg font-normal text-[#0B1610]">Travellers reached</h3>
              </Reveal>
            </div>
          </div>

          {/* Live impact ticker ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â swap sample figures for real metrics from the API */}
          <Reveal delay={100} className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-8">
            {[
              { to: 1240, label: "Trees planted", suffix: "" },
              { to: 38, label: "Km of coastline restored", suffix: "km" },
              { to: 312, label: "Species tracked", suffix: "" },
            ].map((m) => (
              <div key={m.label} className="flex items-baseline gap-2 font-['JetBrains_Mono']">
                <span className="text-xl text-[#B7E8A8]">
                  <Counter to={m.to} suffix={m.suffix} />
                </span>
                <span className="text-[11px] uppercase tracking-[0.15em] text-[#EAE6DA]/60">{m.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============================================================= */}
      {/* 5 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â THE GROUND WE STAND ON ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â the one orchestrated zoom moment */}
      {/* ============================================================= */}
      <section className="relative h-[70vh] min-h-[420px] w-full">
        <ZoomReveal className="absolute inset-0">
          <img src={BRAND_IMG} alt="Canopy texture pulling back to reveal the wider landscape" className="h-full w-full object-cover" />
        </ZoomReveal>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610]/80 via-[#0B1610]/10 to-[#0B1610]/30" />
        <Reveal delay={300} className="absolute inset-x-0 bottom-10 px-5 text-center sm:px-8">
          <p className="font-['Fraunces'] mx-auto max-w-xl text-2xl font-normal leading-snug text-[#FAF6EE] sm:text-3xl">
            Look closely enough at any leaf, and you're already looking at the whole forest.
          </p>
        </Reveal>
      </section>

      {/* ============================================================= */}
      {/* 6 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â FIELD LOG                                                   */}
      {/* ============================================================= */}
      {galleryProjects.length > 0 && (
        <section className="pb-20 pt-16 sm:pb-28 sm:pt-20 xl:pl-24">
          <div className="mx-auto mb-10 max-w-7xl px-5 sm:px-8">
            <Reveal>
              <Eyebrow>Field Log</Eyebrow>
              <h2 className="font-['Fraunces'] mt-2 text-3xl font-normal tracking-tight text-[#0B1610] sm:text-4xl">
                From recent expeditions
              </h2>
            </Reveal>
          </div>
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
            {galleryProjects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project.slug}`}
                className="group relative aspect-[3/4] w-[72vw] shrink-0 snap-start overflow-hidden rounded-[1.75rem] bg-[#e4ddcc] shadow-sm sm:w-[320px]"
              >
                <img
                  src={resolveMediaUrl(project.featuredImage, fallbacks.project)}
                  alt={getLocalizedText(project.title, locale)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610]/75 to-transparent" />
                <span className="absolute left-5 top-5 flex items-center gap-1.5 font-['JetBrains_Mono'] text-[10px] uppercase tracking-widest text-[#EAE6DA]/80">
                  <span className="h-1 w-1 rounded-full bg-[#B7E8A8]" /> waypoint
                </span>
                <h3 className="font-['Fraunces'] absolute inset-x-5 bottom-5 text-lg font-normal leading-snug text-[#FAF6EE]">
                  {getLocalizedText(project.title, locale)}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* 7 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â QUOTE                                                       */}
      {/* ============================================================= */}
      <section className="px-5 py-24 sm:py-28">
        <Reveal className="mx-auto max-w-2xl space-y-5 text-center">
          <Quote className="mx-auto h-7 w-7 text-[#78895A]" />
          <p className="font-['Fraunces'] text-2xl font-normal leading-snug tracking-tight text-[#0B1610] sm:text-3xl">
            A rare kind of travel ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â one that leaves the place better than it found it.
          </p>
          <p className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.2em] text-[#5E6E4C]">
            Outside Magazine, 2025
          </p>
        </Reveal>
      </section>

      {/* ============================================================= */}
      {/* 8 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â EVENTS                                                      */}
      {/* ============================================================= */}
      {upComingEvents.length > 0 && (
        <section className="bg-white/60 px-5 py-20 sm:px-8 sm:py-24 xl:pl-24">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-10 text-center">
              <Eyebrow>Calendar</Eyebrow>
              <h2 className="font-['Fraunces'] mt-2 text-3xl font-normal tracking-tight text-[#0B1610] sm:text-4xl">
                Upcoming field operations
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {upComingEvents.map((event, i) => (
                <Reveal delay={i * 60} key={event._id}>
                  <Link
                    to={`/events/${event.slug}`}
                    className="group relative block aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[#0B1610] shadow-sm"
                  >
                    <img
                      src={resolveMediaUrl(event.featuredImage, fallbacks.attraction)}
                      alt={getLocalizedText(event.title, locale)}
                      className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610]/90 to-[#0B1610]/10" />
                    <div className="absolute left-3 top-3 flex min-w-[52px] flex-col items-center justify-center rounded-xl bg-[#FAF6EE]/95 px-2.5 py-2">
                      <Calendar className="mb-0.5 h-3.5 w-3.5 text-[#5E6E4C]" />
                      <span className="text-center font-['JetBrains_Mono'] text-[10px] font-semibold uppercase text-[#0B1610]">
                        {event.startDate
                          ? formatLocalizedDate(event.startDate, locale, { day: "numeric", month: "short" })
                          : "TBA"}
                      </span>
                    </div>
                    <div className="absolute inset-x-3 bottom-3 space-y-1 sm:inset-x-4 sm:bottom-4">
                      <h3 className="font-['Fraunces'] text-sm leading-snug text-[#FAF6EE] sm:text-base">
                        {getLocalizedText(event.title, locale)}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-[#EAE6DA]/70">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location || "Territory Outpost"}</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* 9 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â DISPATCHES                                                  */}
      {/* ============================================================= */}
      {headlineNews.length > 0 && (
        <section className="px-5 py-20 sm:px-8 sm:py-28 xl:pl-24">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-12">
              <Eyebrow>Field Dispatch</Eyebrow>
              <h2 className="font-['Fraunces'] mt-2 text-3xl font-normal tracking-tight text-[#0B1610] sm:text-4xl">
                Stories from the outposts
              </h2>
            </Reveal>
            <div className="grid gap-10 lg:grid-cols-12">
              {headlineNews[0] && (
                <Reveal className="lg:col-span-7">
                  <Link to={`/news/${headlineNews[0].slug}`} className="group block space-y-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-[#e4ddcc] shadow-sm">
                      <img
                        src={resolveMediaUrl(headlineNews[0].featuredImage, fallbacks.story)}
                        alt={getLocalizedText(headlineNews[0].title, locale)}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                    <span className="font-['JetBrains_Mono'] block text-[11px] uppercase tracking-wider text-[#5E6E4C]">
                      Featured Dispatch
                    </span>
                    <h3 className="font-['Fraunces'] text-2xl leading-snug tracking-tight text-[#0B1610] transition-colors group-hover:text-[#5E6E4C]">
                      {getLocalizedText(headlineNews[0].title, locale)}
                    </h3>
                  </Link>
                </Reveal>
              )}
              <div className="flex flex-col justify-between gap-6 border-t border-[#0B1610]/10 pt-8 lg:col-span-5">
                {headlineNews.slice(1).map((item, i) => (
                  <Reveal delay={i * 80} key={item._id}>
                    <Link to={`/news/${item.slug}`} className="group flex items-center gap-4 border-b border-[#0B1610]/10 pb-6">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#e4ddcc]">
                        <img
                          src={resolveMediaUrl(item.featuredImage, fallbacks.story)}
                          alt={getLocalizedText(item.title, locale)}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="font-['JetBrains_Mono'] block text-[11px] uppercase tracking-wider text-[#5E6E4C]">
                          Field Report
                        </span>
                        <h4 className="font-['Fraunces'] text-lg font-normal leading-snug text-[#0B1610] transition-colors group-hover:text-[#5E6E4C]">
                          {getLocalizedText(item.title, locale)}
                        </h4>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* 10 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â FINAL CTA                                                  */}
      {/* ============================================================= */}
      <section className="relative flex w-full items-center justify-center overflow-hidden py-28 sm:py-36">
        <div className="absolute inset-0">
          <img src={BRAND_IMG} alt="The trail ahead, at dusk" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#0B1610]/78" />
        </div>
        <Reveal className="relative z-10 mx-auto max-w-2xl space-y-8 px-5 text-center sm:px-8">
          <Eyebrow tone="light">Come See for Yourself</Eyebrow>
          <h2 className="font-['Fraunces'] text-4xl font-normal leading-tight tracking-tight text-[#FAF6EE] sm:text-5xl">
            The wild is waiting.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center rounded-full bg-[#FAF6EE] px-8 py-3.5 text-sm font-semibold text-[#0B1610] shadow-sm transition-colors hover:bg-[#B7E8A8]"
            >
              Start Your Journey
            </Link>
            <Link
              to="/contact?intent=partnership"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-semibold text-[#FAF6EE] backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Partner With Us <Leaf className="h-4 w-4 text-[#B7E8A8]" />
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Hero ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â three loosely parallaxing layers: base photo, a darker mid wash,
// and a soft foreground leaf silhouette that drifts slower than scroll,
// giving the canopy a sense of depth without shipping a video file.
// ---------------------------------------------------------------------------
function ParallaxHero({ heroImage }) {
  const [offset, setOffset] = useState(0);
  const reduced = useRef(prefersReducedMotion());

  useEffect(() => {
    if (reduced.current) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setOffset(window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bgShift = reduced.current ? 0 : offset * 0.25;
  const fgShift = reduced.current ? 0 : offset * 0.55;

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#0B1610]">
      {/* Video background replacing static hero image */}
      <video
        src="https://res.cloudinary.com/dkhhjhpbc/video/upload/c_limit,w_1920/f_auto/q_auto/v1784444076/16089157_3840_2160_25fps_wz8i9g.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{ transform: `translateY(${bgShift}px) scale(1.15)` }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1610] via-[#0B1610]/15 to-[#0B1610]/55" />

      {/* Foreground canopy silhouette ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â drifts faster, softly out of focus */}
      <svg
        aria-hidden="true"
        style={{ transform: `translateY(${-fgShift * 0.15}px)` }}
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full opacity-70 blur-[1px] sm:h-56"
      >
        <path
          d="M0,0 L0,90 C40,60 60,110 90,80 C120,50 150,100 190,70 C230,45 260,95 300,65 C330,45 360,80 400,55 L400,0 Z"
          fill="#0B1610"
        />
      </svg>

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 sm:px-8 sm:pb-28 xl:pl-24">
        <Reveal>
          <Eyebrow tone="light">The Last Wild Places</Eyebrow>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-['Fraunces'] mt-4 max-w-4xl text-[13vw] font-normal leading-[0.96] tracking-tight text-[#FAF6EE] sm:text-[7.5vw] lg:text-[5.6vw]">
            Where the wild
            <br />
            still leads.
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#EAE6DA]/85 sm:text-base">
            Journeys into Earth's last untamed corners ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â built to protect the ground they cover.
          </p>
        </Reveal>
        <Reveal delay={340} className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/attractions"
            className="inline-flex min-h-11 items-center rounded-full bg-[#FAF6EE] px-7 py-3 text-sm font-semibold text-[#0B1610] shadow-sm transition-colors hover:bg-[#B7E8A8]"
          >
            Explore Destinations
          </Link>
          <a
            href="#mission"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3 text-sm font-semibold text-[#FAF6EE] backdrop-blur-md transition-colors hover:bg-white/10"
          >
            Our Mission <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex">
        <span className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em] text-[#EAE6DA]/70">Scroll</span>
        <span className="h-9 w-px animate-pulse bg-[#EAE6DA]/50 motion-reduce:animate-none" />
      </div>
    </section>
  );
}

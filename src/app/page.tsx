"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/types/project";
import type { Attraction } from "@/types/attraction";
import type { NewsItem } from "@/types/news";
import type { EventItem } from "@/types/event";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { resolveMediaUrl } from "@/lib/media";
import { useLocale } from "@/providers/LocaleProvider";
import {
  ArrowRight,
  Calendar,
  Compass,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Trees,
  Users,
  Mountain,
} from "lucide-react";
import { formatLocalizedDate } from "@/lib/utils";

const featureCards = [
  {
    icon: ShieldCheck,
    title: "Protecting Biodiversity",
    description:
      "We restore fragile habitats, monitor species, and partner with local communities to preserve ecosystems that matter.",
  },
  {
    icon: Compass,
    title: "Sustainable Eco-Tourism",
    description:
      "Responsible travel experiences that generate local income while keeping conservation outcomes at the center.",
  },
];

const heroBackground =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2200&q=80";

const fallbackProjectImage =
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=80";
const fallbackAttractionImage =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80";
const fallbackNewsImage =
  "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=900&q=80";

export default function HomePage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [projectRes, attractionRes, newsRes, eventRes] = await Promise.all([
          apiRequest<{ success: boolean; data: Project[] }>("/projects"),
          apiRequest<{ success: boolean; data: Attraction[] | { items: Attraction[] } }>("/attractions"),
          apiRequest<{ success: boolean; data: NewsItem[] | { items: NewsItem[] } }>("/news"),
          apiRequest<{ success: boolean; data: EventItem[] | { items: EventItem[] } }>("/events"),
        ]);

        setProjects(projectRes.data || []);

        const attractionData = attractionRes.data;
        setAttractions(Array.isArray(attractionData) ? attractionData : attractionData?.items || []);

        const newsData = newsRes.data;
        setNews(Array.isArray(newsData) ? newsData : newsData?.items || []);

        const eventData = eventRes.data;
        setEvents(Array.isArray(eventData) ? eventData : eventData?.items || []);
      } catch {
        setProjects([]);
        setAttractions([]);
        setNews([]);
        setEvents([]);
      }
    })();
  }, []);

  const heroStats = useMemo(
    () => [
      { icon: Trees, label: "Species Protected", value: `${Math.max(50, projects.length * 4)}+` },
      { icon: Users, label: "Communities Engaged", value: `${Math.max(20, attractions.length + 12)}+` },
      { icon: Mountain, label: "Protected Zones", value: `${Math.max(30, projects.length + attractions.length)}+` },
    ],
    [projects.length, attractions.length]
  );

  const spotlightProject = projects[0];
  const spotlightAttraction = attractions[0];
  const headlineNews = news.slice(0, 2);
  const headlineEvents = events.slice(0, 2);

  return (
    <main id="main-content" className="text-forest-950 bg-[#f7f7f2]">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 animate-ken-burns"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,22,17,0.55)_0%,rgba(8,22,17,0.76)_50%,rgba(8,22,17,0.9)_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-24">
          <div
            className="mx-auto max-w-4xl rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center backdrop-blur-md sm:p-12"
            style={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Sparkles className="h-3.5 w-3.5" />
              Conservation Platform
            </p>
            <h1 className="text-balance text-5xl font-bold leading-[1.03] text-white sm:text-6xl lg:text-7xl">
              Nature View
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-white/80 sm:text-xl">
              Experience Nature, Preserve the Future
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition bg-[#e9e2bd] text-[#0d241b]"
              >
                Explore Our Conservation Projects
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={() => router.push("/contact")}
                className="inline-flex min-h-11 items-center rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Partner With Us
              </button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-white/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/45" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" style={{ backgroundColor: "#f7f7f2" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-[#1c2f25] sm:text-5xl">Why Nature View</h2>
            <p className="mt-3 text-sm text-[#5b665d] sm:text-base">Designed for impact, grounded in science, powered by communities.</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {featureCards.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-[#e4e0d5] bg-white p-6 shadow-[0_18px_45px_-30px_rgba(24,40,31,0.35)]"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#e9e5d9]" />
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e1dcc4] text-[#223328]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold text-[#1f2f25]">{title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#4d5d52]">{description}</p>
                  <Link
                    href="/impact"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#223328] transition group-hover:gap-2.5"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-[#f7f7f2]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <article
            className="lg:col-span-5"
          >
            <div className="overflow-hidden rounded-3xl border border-[#dedbcf] bg-white shadow-[0_20px_55px_-32px_rgba(16,28,22,0.4)]">
              <Image
                src={resolveMediaUrl(spotlightProject?.featuredImage, fallbackProjectImage)}
                alt={spotlightProject ? getLocalizedText(spotlightProject.title, locale) || spotlightProject.slug : "Featured conservation project"}
                width={1400}
                height={800}
                className="h-64 w-full object-cover sm:h-80"
                loading="lazy"
                unoptimized
              />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6a766d]">Featured Project</p>
                <h3 className="mt-2 text-3xl font-semibold text-[#1f3025]">
                  {spotlightProject ? getLocalizedText(spotlightProject.title, locale) || spotlightProject.slug : "Explore Our Conservation in Future"}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#516057]">
                  {spotlightProject
                    ? getLocalizedText(spotlightProject.summary, locale)
                    : "A long-term conservation model connecting habitat protection, tourism, and local stewardship across biodiversity zones."}
                </p>
                <Link
                  href={spotlightProject ? `/projects/${spotlightProject.slug}` : "/projects"}
                  className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#d9d3b0] px-5 py-2.5 text-sm font-semibold text-[#263227] transition hover:bg-[#e9e2bd]"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </article>

          <article
            className="lg:col-span-7"
          >
            <div className="h-full rounded-3xl border border-[#ddd9ce] bg-white p-6 shadow-[0_20px_55px_-32px_rgba(16,28,22,0.4)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d786f]">Program Snapshot</p>
              <h3 className="mt-3 text-3xl font-semibold text-[#203126] sm:text-4xl">From Forest Trails to Community Resilience</h3>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#4c5b52] sm:text-base">
                We combine climate-smart conservation, species monitoring, and community-led tourism to create sustainable outcomes that scale.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e3dfd4] bg-[#f7f7f2] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d776f]">Location</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f3025]">Eastern Green Belt</p>
                </div>
                <div className="rounded-2xl border border-[#e3dfd4] bg-[#f7f7f2] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6d776f]">Active Programs</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f3025]">{Math.max(6, projects.length)}</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link href="/attractions" className="flex items-center justify-between rounded-xl border-b border-[#ece8de] pb-3 text-sm font-medium text-[#2b3b31]">
                  <span>Location Highlights</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/events" className="flex items-center justify-between rounded-xl border-b border-[#ece8de] pb-3 text-sm font-medium text-[#2b3b31]">
                  <span>Events and Expeditions</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="flex items-center justify-between rounded-xl text-sm font-medium text-[#2b3b31]">
                  <span>Join the Conservation Network</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#11352a] via-[#1a4739] to-[#295a46] p-6 text-white sm:p-8"
        >
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {heroStats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <span className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                    <Icon className="h-5 w-5 text-white/90" />
                  </span>
                  <p className="mt-2 text-3xl font-bold sm:text-4xl">{item.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/70">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-12">
            <article
              className="relative overflow-hidden rounded-3xl lg:col-span-5"
            >
                <Image
                src={resolveMediaUrl(spotlightAttraction?.featuredImage, fallbackAttractionImage)}
                alt={spotlightAttraction ? getLocalizedText(spotlightAttraction.title, locale) || spotlightAttraction.slug : "Rainforest attraction"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                className="h-full min-h-[320px] w-full object-cover"
                loading="lazy"
                  unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d241b]/90 via-[#0d241b]/45 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Explore Route</p>
                <h3 className="mt-2 text-3xl font-semibold leading-tight">
                  {spotlightAttraction
                    ? getLocalizedText(spotlightAttraction.title, locale) || spotlightAttraction.slug
                    : "Discover Hidden Rainforest Corridors"}
                </h3>
                <Link href={spotlightAttraction ? `/attractions/${spotlightAttraction.slug}` : "/attractions"} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  View Attraction
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            <article
              className="rounded-3xl border border-[#e1ddd2] bg-white p-6 lg:col-span-7"
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  resolveMediaUrl(projects[1]?.featuredImage, fallbackProjectImage),
                  resolveMediaUrl(attractions[1]?.featuredImage, fallbackAttractionImage),
                  resolveMediaUrl(projects[2]?.featuredImage, fallbackNewsImage),
                ].map((image, index) => (
                  <Image
                    key={`${image}-${index}`}
                    src={image}
                    alt="Nature collage"
                    width={640}
                    height={320}
                    className="h-28 w-full rounded-2xl object-cover sm:h-32"
                    loading="lazy"
                    unoptimized
                  />
                ))}
              </div>

              <h3 className="mt-6 text-3xl font-semibold text-[#1f3025]">Latest Stories and Upcoming Events</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4f5d54]">
                Discover field updates, restoration wins, and upcoming experiences that connect people directly with living landscapes.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {headlineNews.map((item) => (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug}`}
                    className="group rounded-2xl border border-[#e7e2d8] bg-[#f9f8f4] p-4 transition hover:border-[#cdc6ad]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a746c]">Story</p>
                    <h4 className="mt-2 line-clamp-2 text-lg font-semibold text-[#26362c]">
                      {getLocalizedText(item.title, locale) || item.slug}
                    </h4>
                    <p className="mt-2 line-clamp-2 text-sm text-[#526157]">{getLocalizedText(item.summary, locale)}</p>
                    <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#27382d]">
                      Read Story
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </p>
                  </Link>
                ))}

                {headlineEvents.map((item) => {
                  const dateStr = item.startDate
                    ? formatLocalizedDate(item.startDate, locale, {
                        month: "short",
                        day: "numeric",
                      })
                    : "Date TBA";
                  return (
                    <Link
                      key={item._id}
                      href={`/events/${item.slug}`}
                      className="group rounded-2xl border border-[#e7e2d8] bg-[#f9f8f4] p-4 transition hover:border-[#cdc6ad]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a746c]">Event</p>
                      <h4 className="mt-2 line-clamp-2 text-lg font-semibold text-[#26362c]">
                        {getLocalizedText(item.title, locale) || item.slug}
                      </h4>
                      <div className="mt-3 space-y-1 text-sm text-[#506057]">
                        <p className="inline-flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {dateStr}
                        </p>
                        <p className="inline-flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{item.location || "Conservation Site"}</span>
                        </p>
                      </div>
                      <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#27382d]">
                        View Event
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </p>
                    </Link>
                  );
                })}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8 lg:pb-24" style={{ backgroundColor: "#eef1e8" }}>
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#d9d8cb] bg-white p-8 text-center shadow-[0_25px_55px_-35px_rgba(18,30,24,0.4)] sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6b776d]">Get Involved</p>
          <h2 className="mt-4 text-balance text-4xl font-bold text-[#1f3026] sm:text-5xl">Make Conservation a Shared Future</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#4f5e55] sm:text-base">
            Support field programs, collaborate with communities, or experience eco-tourism that funds biodiversity restoration.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition bg-[#1a4739]"
            >
              Start Collaborating
            </Link>
            <Link
              href="/impact"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition border-[#e3dfd4] text-[#11352a] bg-[#f7f7f2]"
            >
              View Impact Report
              <Leaf className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}



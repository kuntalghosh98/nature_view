"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { FormEvent, useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import type { Project } from "@/types/project";
import type { Attraction } from "@/types/attraction";
import type { NewsItem } from "@/types/news";
import type { EventItem } from "@/types/event";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";
import { ArrowRight, Calendar, MapPin, Search } from "lucide-react";

export default function HomePage() {
  const { locale } = useLocale();
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [projectRes, attractionRes, newsRes, eventRes] = await Promise.all([
          apiRequest<{ success: boolean; data: Project[] }>("/projects"),
          apiRequest<{ success: boolean; data: any }>("/attractions"),
          apiRequest<{ success: boolean; data: any }>("/news"),
          apiRequest<{ success: boolean; data: any }>("/events")
        ]);

        setProjects(projectRes.data || []);
        
        const attrData = attractionRes.data;
        setAttractions(Array.isArray(attrData) ? attrData : (attrData?.items || []));

        const newsData = newsRes.data;
        setNews(Array.isArray(newsData) ? newsData : (newsData?.items || []));

        const evtData = eventRes.data;
        setEvents(Array.isArray(evtData) ? evtData : (evtData?.items || []));
      } catch (_err) {
        setProjects([]);
        setAttractions([]);
        setNews([]);
        setEvents([]);
      }
    })();
  }, []);

  function handleHeroSearch(e: FormEvent) {
    e.preventDefault();
    const q = heroQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <main className="space-y-16 overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      {/* ── Immersive Hero ────────────────────────────────────────── */}
      <section className="relative -mx-4 -mt-10 flex min-h-[88vh] flex-col justify-end overflow-hidden rounded-b-[2.5rem] sm:-mx-6 sm:rounded-b-[3rem] lg:-mx-8">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-dense-forest-with-sunlight-rays-4677-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-view-of-a-misty-forest-from-above-4670-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Gradient overlay — lighter at top, dense at bottom */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

        {/* Frosted glass content card */}
        <div className="relative px-4 pb-6 sm:px-8 sm:pb-10 lg:px-12 lg:pb-12">
          <div
            className="mx-auto max-w-lg rounded-2xl border border-white/15 p-6 shadow-2xl sm:max-w-xl sm:p-8"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)" }}
          >
            {/* Brand tag */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              Nature View
              <span className="mx-2 text-white/30">·</span>
              Discover the Wild
            </p>

            {/* Headline */}
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Explore Sustainable<br />
              Adventures
            </h1>

            {/* Inline search */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-5 flex items-center gap-3 rounded-full bg-white/90 px-5 py-3 shadow-inner"
            >
              <Search className="h-4 w-4 shrink-0 text-forest-900/35" />
              <input
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Search destinations, trails, lodges..."
                className="flex-1 bg-transparent text-sm text-forest-900 placeholder:text-forest-900/40 outline-none"
              />
            </form>

            {/* CTA */}
            <Link
              href="/projects"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-forest-700 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-forest-800 hover:shadow-lg active:scale-[0.98]"
            >
              Explore Nature View
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-forest-900/10 bg-white p-5 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-forest-700">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-700/10 text-forest-700 font-bold">01</span>
            <h2 className="text-xl font-semibold">Featured projects</h2>
          </div>
          <div className="mt-6 space-y-3">
            {projects.slice(0, 3).map((project) => {
              const imageUrl = (project.featuredImage as any)?.url || "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80";
              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group flex gap-3 overflow-hidden rounded-2xl border border-forest-900/5 bg-forest-50/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-700/20 hover:bg-white hover:shadow-md"
                >
                  <div className="relative h-16 w-16 sm:h-20 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-forest-100">
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <h3 className="line-clamp-1 text-sm font-semibold text-forest-900 group-hover:text-forest-700 transition">
                      {getLocalizedText(project.title, locale) || project.slug}
                    </h3>
                    <StatusBadge status={project.status} />
                    <p className="line-clamp-1 text-xs text-forest-900/60">
                      {getLocalizedText(project.summary, locale)}
                    </p>
                  </div>
                </Link>
              );
            })}
            {projects.length === 0 ? <p className="text-sm text-forest-900/70">No projects available yet.</p> : null}
          </div>
        </article>

        <article className="rounded-3xl border border-forest-900/10 bg-white p-5 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 text-forest-700">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-700/10 text-forest-700 font-bold">02</span>
            <h2 className="text-xl font-semibold">Popular attractions</h2>
          </div>
          <div className="mt-6 space-y-3">
            {attractions.slice(0, 3).map((item) => {
              const imageUrl = (item.featuredImage as any)?.url || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80";
              return (
                <Link
                  key={item.slug}
                  href={`/attractions/${item.slug}`}
                  className="group flex gap-3 overflow-hidden rounded-2xl border border-forest-900/5 bg-forest-50/50 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-700/20 hover:bg-white hover:shadow-md"
                >
                  <div className="relative h-16 w-16 sm:h-20 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-forest-100">
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                    <h3 className="line-clamp-1 text-sm font-semibold text-forest-900 group-hover:text-forest-700 transition">
                      {getLocalizedText(item.title, locale) || item.slug}
                    </h3>
                    <StatusBadge status={item.status} />
                    <p className="line-clamp-1 text-xs text-forest-900/60">
                      {getLocalizedText(item.summary, locale)}
                    </p>
                  </div>
                </Link>
              );
            })}
            {attractions.length === 0 ? <p className="text-sm text-forest-900/70">No attractions available yet.</p> : null}
          </div>
        </article>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-forest-900">Latest stories and events</h2>
            <p className="text-sm text-forest-900/65">Stay up to date with news and upcoming events.</p>
          </div>
          <Link href="/news" className="text-sm font-semibold text-forest-700 hover:text-forest-900 inline-flex items-center gap-1">
            View all news
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {news.slice(0, 2).map((item) => {
            const imageUrl = (item.featuredImage as any)?.url || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80";
            return (
              <Link
                key={item._id}
                href={`/news/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-forest-100">
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-forest-900/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    Story
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-base font-semibold text-forest-900 group-hover:text-forest-700 transition">
                    {getLocalizedText(item.title, locale) || item.slug}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs text-forest-900/65 flex-1">
                    {getLocalizedText(item.summary, locale)}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-forest-700">
                    Read story
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}

          {events.slice(0, 2).map((item) => {
            const imageUrl = (item.featuredImage as any)?.url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80";
            const dateStr = item.startDate ? new Date(item.startDate).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric" }) : "";
            return (
              <Link
                key={item._id}
                href={`/events/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-forest-100">
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-forest-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Event
                  </span>
                  <StatusBadge status={item.status} className="absolute right-3 top-3 scale-90" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-base font-semibold text-forest-900 group-hover:text-forest-700 transition">
                    {getLocalizedText(item.title, locale) || item.slug}
                  </h3>
                  <div className="mt-3 space-y-1 text-xs text-forest-900/65 flex-1">
                    {dateStr && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-forest-600" />
                        <span>{dateStr}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-forest-600" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs font-semibold text-forest-700">
                    View details
                    <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

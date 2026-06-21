"use client";

import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import type { Project } from "@/types/project";
import type { Attraction } from "@/types/attraction";
import type { NewsItem } from "@/types/news";
import type { EventItem } from "@/types/event";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [projectRes, attractionRes, newsRes, eventRes] = await Promise.all([
          apiRequest<{ success: boolean; data: Project[] }>("/projects"),
          apiRequest<{ success: boolean; data: Attraction[] }>("/attractions"),
          apiRequest<{ success: boolean; data: NewsItem[] }>("/news"),
          apiRequest<{ success: boolean; data: EventItem[] }>("/events")
        ]);

        setProjects(projectRes.data || []);
        setAttractions(attractionRes.data || []);
        setNews(newsRes.data || []);
        setEvents(eventRes.data || []);
      } catch (_err) {
        setProjects([]);
        setAttractions([]);
        setNews([]);
        setEvents([]);
      }
    })();
  }, []);

  return (
    <main className="space-y-16 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl rounded-[2rem] border border-forest-900/10 bg-forest-700/5 p-10 text-center shadow-sm">
        <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-forest-700/80">Search</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-forest-900/75">
          Find projects, attractions, news, and events by keyword.
        </p>
        <div className="mt-8">
          <SearchBar />
        </div>
      </section>
      <section className="mx-auto max-w-6xl rounded-[2rem] border border-forest-900/10 bg-forest-700/5 p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-forest-700/80">Nature View</p>
        <h1 className="mt-4 text-4xl font-semibold text-forest-900 sm:text-5xl">Conservation travel with measurable impact</h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-forest-900/75">
          Explore community-led conservation projects, eco attractions, and the team behind meaningful environmental experiences.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/projects" className="rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-forest-800">
            Explore projects
          </Link>
          <Link href="/contact" className="rounded-full border border-forest-700 bg-white px-6 py-3 text-sm font-semibold text-forest-900 hover:bg-forest-50">
            Contact us
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-forest-900/10 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-forest-700">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-700/10 text-forest-700">01</span>
            <h2 className="text-xl font-semibold">Featured projects</h2>
          </div>
          <div className="mt-6 space-y-4">
            {projects.slice(0, 3).map((project) => (
              <Link key={project.slug} href={`/projects/${project.slug}`} className="block rounded-3xl border border-forest-900/5 p-4 transition hover:border-forest-700/20 hover:bg-forest-50">
                <h3 className="font-semibold text-forest-900">{project.title?.en || project.slug}</h3>
                <p className="mt-2 text-sm text-forest-900/65">{project.summary?.en}</p>
              </Link>
            ))}
            {projects.length === 0 ? <p className="text-sm text-forest-900/70">No projects available yet.</p> : null}
          </div>
        </article>

        <article className="rounded-3xl border border-forest-900/10 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-forest-700">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-700/10 text-forest-700">02</span>
            <h2 className="text-xl font-semibold">Popular attractions</h2>
          </div>
          <div className="mt-6 space-y-4">
            {attractions.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/attractions/${item.slug}`} className="block rounded-3xl border border-forest-900/5 p-4 transition hover:border-forest-700/20 hover:bg-forest-50">
                <h3 className="font-semibold text-forest-900">{item.title?.en || item.slug}</h3>
                <p className="mt-2 text-sm text-forest-900/65">{item.summary?.en}</p>
              </Link>
            ))}
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
          <Link href="/news" className="text-sm font-semibold text-forest-700 hover:text-forest-900">
            View all news
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {news.slice(0, 2).map((item) => (
            <Link key={item._id} href={`/news/${item.slug}`} className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-lg font-semibold text-forest-900">{item.title?.en || item.slug}</h3>
              <p className="mt-3 text-sm text-forest-900/65">{item.summary?.en}</p>
            </Link>
          ))}
          {events.slice(0, 2).map((item) => (
            <Link key={item._id} href={`/events/${item.slug}`} className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <h3 className="text-lg font-semibold text-forest-900">{item.title?.en || item.slug}</h3>
              <p className="mt-3 text-sm text-forest-900/65">{item.location}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

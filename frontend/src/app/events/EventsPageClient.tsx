"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Star } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { EventItem, EventListResponse } from "@/types/event";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";
import { StatusBadge } from "@/components/StatusBadge";

export default function EventsPageClient() {
  const { locale } = useLocale();
  const [featured, setFeatured] = useState<EventItem[]>([]);
  const [items, setItems] = useState<EventItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<EventListResponse>("/events");
        const data = res.data;

        if (Array.isArray(data)) {
          setFeatured([]);
          setItems(data);
        } else {
          setFeatured(data.featured || []);
          setItems(data.items || []);
        }
      } catch {
        setFeatured([]);
        setItems([]);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-forest-900 sm:text-5xl">Events</h1>
        <p className="mt-3 max-w-2xl text-base text-forest-900/75">
          Join community campaigns, hands-on workshops, and educational programs held in our nature reserve.
        </p>
      </div>

      {featured.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-forest-900/10 pb-3">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <h2 className="text-2xl font-bold text-forest-900 font-semibold">Featured Events</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((item) => {
              const imageUrl = (item.featuredImage as any)?.url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";
              const dateStr = item.startDate ? new Date(item.startDate).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
              return (
                <article
                  key={item._id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <Link href={`/events/${item.slug}`} className="relative aspect-video w-full overflow-hidden bg-forest-100 block">
                    <img
                      src={imageUrl}
                      alt={getLocalizedText(item.title, locale) || item.slug}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <StatusBadge status={item.status} className="absolute right-4 top-4" />
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold text-forest-900 group-hover:text-forest-700 transition line-clamp-1">
                      <Link href={`/events/${item.slug}`}>
                        {getLocalizedText(item.title, locale) || item.slug}
                      </Link>
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-forest-900/65 flex-1">
                      {getLocalizedText(item.summary, locale)}
                    </p>

                    <div className="mt-4 space-y-1.5 text-xs text-forest-900/60 font-medium">
                      {dateStr && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-forest-600" />
                          <span>{dateStr}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-forest-600" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-forest-900/5">
                      <Link
                        href={`/events/${item.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-900"
                      >
                        Event Details
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-forest-900">Upcoming & Past Events</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imageUrl = (item.featuredImage as any)?.url || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80";
            const dateStr = item.startDate ? new Date(item.startDate).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
            return (
              <article
                key={item._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <Link href={`/events/${item.slug}`} className="relative aspect-video w-full overflow-hidden bg-forest-100 block">
                  <img
                    src={imageUrl}
                    alt={getLocalizedText(item.title, locale) || item.slug}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <StatusBadge status={item.status} className="absolute right-4 top-4" />
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-forest-900 group-hover:text-forest-700 transition line-clamp-1">
                    <Link href={`/events/${item.slug}`}>
                      {getLocalizedText(item.title, locale) || item.slug}
                    </Link>
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-forest-900/65 flex-1">
                    {getLocalizedText(item.summary, locale)}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-forest-900/60 font-medium">
                    {dateStr && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-forest-600" />
                        <span>{dateStr}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-forest-600" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-forest-900/5">
                    <Link
                      href={`/events/${item.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-900"
                    >
                      Event Details
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
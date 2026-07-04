"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Attraction, AttractionListResponse } from "@/types/attraction";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";
import { StatusBadge } from "@/components/StatusBadge";

export default function AttractionsPageClient() {
  const { locale } = useLocale();
  const [featured, setFeatured] = useState<Attraction[]>([]);
  const [items, setItems] = useState<Attraction[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<AttractionListResponse>("/attractions");
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
        <h1 className="text-4xl font-bold tracking-tight text-forest-900 sm:text-5xl">Attractions</h1>
        <p className="mt-3 max-w-2xl text-base text-forest-900/75">
          Discover natural lookout points, conservation sanctuaries, and highlights across the conservation reserve.
        </p>
      </div>

      {featured.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-forest-900/10 pb-3">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <h2 className="text-2xl font-bold text-forest-900">Featured Highlights</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((item) => {
              const imageUrl = (item.featuredImage as any)?.url || "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80";
              return (
                <article
                  key={item._id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <Link href={`/attractions/${item.slug}`} className="relative aspect-video w-full overflow-hidden bg-forest-100 block">
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
                      <Link href={`/attractions/${item.slug}`}>
                        {getLocalizedText(item.title, locale) || item.slug}
                      </Link>
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-forest-900/65 flex-1">
                      {getLocalizedText(item.summary, locale)}
                    </p>

                    <div className="mt-6 pt-5 border-t border-forest-900/5">
                      <Link
                        href={`/attractions/${item.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-900"
                      >
                        Explore Attraction
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
        <h2 className="text-2xl font-bold text-forest-900">All Attractions</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imageUrl = (item.featuredImage as any)?.url || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80";
            return (
              <article
                key={item._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <Link href={`/attractions/${item.slug}`} className="relative aspect-video w-full overflow-hidden bg-forest-100 block">
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
                    <Link href={`/attractions/${item.slug}`}>
                      {getLocalizedText(item.title, locale) || item.slug}
                    </Link>
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-forest-900/65 flex-1">
                    {getLocalizedText(item.summary, locale)}
                  </p>

                  <div className="mt-6 pt-5 border-t border-forest-900/5">
                    <Link
                      href={`/attractions/${item.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-900"
                    >
                      Explore Attraction
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
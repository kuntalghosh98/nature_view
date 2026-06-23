"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import type { NewsItem, NewsListResponse } from "@/types/news";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

export default function NewsPageClient() {
  const { locale } = useLocale();
  const [featured, setFeatured] = useState<NewsItem[]>([]);
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<NewsListResponse>("/news");
        const data = Array.isArray(res.data) ? res.data : res.data;

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
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold">News</h1>
        <p className="text-sm text-forest-900/65">
          Read the latest updates and stories from our conservation work.
        </p>
      </section>

      {featured.length > 0 && (
        <section className="grid gap-4 lg:grid-cols-2">
          {featured.map((item) => (
            <article
              key={item._id}
              className="rounded-3xl border bg-white p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                <Link href={`/news/${item.slug}`}>
                  {getLocalizedText(item.title, locale) || item.slug}
                </Link>
              </h2>

              <p className="mt-2 text-sm text-forest-900/65">
                {getLocalizedText(item.summary, locale)}
              </p>
            </article>
          ))}
        </section>
      )}

      <section className="grid gap-4">
        {items.map((item) => (
          <article
            key={item._id}
            className="rounded-lg border bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              <Link href={`/news/${item.slug}`}>
                {getLocalizedText(item.title, locale) || item.slug}
              </Link>
            </h2>

            <p className="mt-2 text-sm text-forest-900/65">
              {getLocalizedText(item.summary, locale)}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
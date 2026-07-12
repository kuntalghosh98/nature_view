"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { apiRequest } from "@/lib/api";
import type { NewsItem } from "@/types/news";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocale();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: NewsItem }>(`/news/slug/${slug}`);
        setItem(res.data);
      } catch {
        setItem(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Not found</p>;

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold">{getLocalizedText(item.title, locale)}</h1>
      <p className="text-sm text-forest-900/65">{getLocalizedText(item.summary, locale)}</p>
      {item.featuredImage && typeof item.featuredImage !== "string" ? (
        <Image
          src={item.featuredImage.url}
          alt={getLocalizedText(item.title, locale) || "Featured"}
          width={1400}
          height={788}
          className="w-full rounded-3xl object-cover"
          unoptimized
        />
      ) : null}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: getLocalizedText(item.body, locale) }} />
    </article>
  );
}

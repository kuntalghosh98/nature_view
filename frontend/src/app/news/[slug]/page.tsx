"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { NewsItem } from "@/types/news";

export default function NewsDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: NewsItem }>(`/news/slug/${slug}`);
        setItem(res.data);
      } catch (_err) {
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
      <h1 className="text-3xl font-semibold">{item.title?.en}</h1>
      <p className="text-sm text-forest-900/65">{item.summary?.en}</p>
      {item.featuredImage && typeof item.featuredImage !== "string" ? (
        <img src={item.featuredImage.url} alt={item.title?.en || "Featured"} className="w-full rounded-3xl object-cover" />
      ) : null}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: item.body?.en || "" }} />
    </article>
  );
}

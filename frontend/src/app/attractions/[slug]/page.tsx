"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { Attraction } from "@/types/attraction";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

export default function AttractionDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState<Attraction | null>(null);
  const { locale } = useLocale();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: Attraction }>(`/attractions/slug/${slug}`);
        setItem(res.data);
      } catch (_err) {
        setItem(null);
      }
    })();
  }, [slug]);

  if (!item) return <p>Not found</p>;

  return (
    <article className="space-y-6">
      <h1 className="text-3xl font-semibold">{getLocalizedText(item.title, locale)}</h1>
      <p className="text-sm text-forest-900/65">{getLocalizedText(item.summary, locale)}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: getLocalizedText(item.body, locale) }} />
    </article>
  );
}

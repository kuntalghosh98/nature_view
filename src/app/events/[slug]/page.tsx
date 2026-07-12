"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { apiRequest } from "@/lib/api";
import type { EventItem } from "@/types/event";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

export default function EventDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocale();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    (async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: EventItem }>(`/events/slug/${slug}`);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{getLocalizedText(item.title, locale)}</h1>
          <p className="text-sm text-forest-900/65">{item.location}</p>
        </div>
        {item.registrationUrl ? (
          <Link href={item.registrationUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white">
            Register now
          </Link>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-700">Starts</p>
          <p className="mt-2 text-forest-900/80">{item.startDate ? new Date(item.startDate).toLocaleString() : "TBD"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-700">Ends</p>
          <p className="mt-2 text-forest-900/80">{item.endDate ? new Date(item.endDate).toLocaleString() : "TBD"}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-700">Status</p>
          <p className="mt-2 text-forest-900/80">{item.isPublished ? "Published" : "Draft"}</p>
        </div>
      </div>

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

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: item.body?.en || "" }} />
    </article>
  );
}

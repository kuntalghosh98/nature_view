"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { Project } from "@/types/project";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

export default function ProjectDetailPage() {
    const { locale } = useLocale();
  const { slug } = useParams();
  const [item, setItem] = useState<Project | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: Project }>(`/projects/slug/${slug}`);
        setItem(res.data);
      } catch (_err) {
        setItem(null);
      }
    })();
  }, [slug]);

  if (!item) return <p>Not found</p>;

  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-semibold">{getLocalizedText(item.title, locale)}</h1>
    <div className="text-sm text-forest-900/65">
      {getLocalizedText(item.summary, locale)}
    </div>

    <div
      className="prose mt-4"
      dangerouslySetInnerHTML={{
        __html: getLocalizedText(item.body, locale),
      }}
    />
    </article>
  );
}

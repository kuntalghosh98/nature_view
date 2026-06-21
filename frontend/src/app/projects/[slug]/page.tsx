"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { Project } from "@/types/project";

export default function ProjectDetailPage() {
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
      <h1 className="text-3xl font-semibold">{item.title?.en}</h1>
      <div className="text-sm text-forest-900/65">{item.summary?.en}</div>
      <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: item.body?.en || "" }} />
    </article>
  );
}

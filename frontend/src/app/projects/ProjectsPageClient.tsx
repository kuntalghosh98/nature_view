"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Project } from "@/types/project";
import { useLocale } from "@/providers/LocaleProvider";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { StatusBadge } from "@/components/StatusBadge";

export default function ProjectsPageClient() {
  const { locale } = useLocale();
  const [items, setItems] = useState<Project[]>([]);

  useEffect(() => {
    (async function () {
      try {
        const res = await apiRequest<{
          success: boolean;
          data: Project[];
        }>("/projects");

        setItems(res.data || []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-forest-900 sm:text-5xl">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-base text-forest-900/75">
          Explore community-driven conservation initiatives, agricultural programs, and eco-tourism projects.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const imageUrl = (p.featuredImage as any)?.url || "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80";
          return (
            <article
              key={p.slug}
              className="group flex flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <Link href={`/projects/${p.slug}`} className="relative aspect-video w-full overflow-hidden bg-forest-100 block">
                <img
                  src={imageUrl}
                  alt={getLocalizedText(p.title, locale) || p.slug}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <StatusBadge status={p.status} className="absolute right-4 top-4" />
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold text-forest-900 group-hover:text-forest-700 transition line-clamp-1">
                  <Link href={`/projects/${p.slug}`}>
                    {getLocalizedText(p.title, locale) || p.slug}
                  </Link>
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-forest-900/65 flex-1">
                  {getLocalizedText(p.summary, locale)}
                </p>

                <div className="mt-6 pt-5 border-t border-forest-900/5">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-900 transition-colors"
                  >
                    View project
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
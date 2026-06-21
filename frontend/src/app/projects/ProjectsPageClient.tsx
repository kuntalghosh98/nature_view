"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { apiRequest } from "@/lib/api";
import type { Project } from "@/types/project";

export default function ProjectsPageClient() {
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
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">
        Projects
      </h1>

      <div className="grid gap-4">
        {items.map((p) => (
          <article
            key={p.slug}
            className="rounded-lg border bg-white p-4"
          >
            <h2 className="text-xl font-semibold">
              <Link href={`/projects/${p.slug}`}>
                {p.title?.en || p.slug}
              </Link>
            </h2>

            <p className="text-sm text-forest-900/65">
              {p.summary?.en}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
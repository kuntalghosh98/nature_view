"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, SlidersHorizontal, Sprout, CheckCircle2, Loader2, CalendarClock } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Project } from "@/types/project";
import { useLocale } from "@/providers/LocaleProvider";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { resolveMediaUrl } from "@/lib/media";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonGrid";

/** Map API statuses to filter categories */
const statusMap: Record<string, string> = {
  demo: "planning",
  upcoming: "planning",
  "on-going": "active",
  completed: "completed",
};

/** Filter options */
type FilterKey = "all" | "active" | "completed" | "planning";

const filters: { key: FilterKey; labelKey: string; icon: React.ReactNode }[] = [
  { key: "all", labelKey: "pages.projects.filters.all", icon: <SlidersHorizontal className="w-4 h-4" /> },
  { key: "active", labelKey: "pages.projects.filters.active", icon: <Loader2 className="w-4 h-4" /> },
  { key: "completed", labelKey: "pages.projects.filters.completed", icon: <CheckCircle2 className="w-4 h-4" /> },
  { key: "planning", labelKey: "pages.projects.filters.planning", icon: <CalendarClock className="w-4 h-4" /> },
];

const fallbackProjectImage =
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80";

export default function ProjectsPageClient() {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  useEffect(() => {
    (async function () {
      try {
        const res = await apiRequest<{ success: boolean; data: Project[] }>("/projects");
        setItems(res.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** Filtered & sorted projects */
  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((p) => {
      const mapped = statusMap[p.status || ""] || "planning";
      return mapped === activeFilter;
    });
  }, [items, activeFilter]);

  /** Count per filter for badges */
  const filterCounts = useMemo(() => {
    const counts: Record<FilterKey, number> = { all: items.length, active: 0, completed: 0, planning: 0 };
    items.forEach((p) => {
      const mapped = statusMap[p.status || ""] || "planning";
      counts[mapped as FilterKey]++;
    });
    return counts;
  }, [items]);

  /** Empty state */
  const renderEmpty = () => (
    <EmptyState
      icon={Search}
      title={activeFilter === "all" ? t("pages.projects.noProjects") : t("pages.projects.noProjectsFiltered")}
      description={activeFilter !== "all" ? t("common.filterHint") : t("common.checkBackSoon")}
      actionLabel={activeFilter !== "all" ? t("common.clearFilter") : undefined}
      onAction={activeFilter !== "all" ? () => setActiveFilter("all") : undefined}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-forest-50/30 to-white">
      <PageHero
        icon={Sprout}
        eyebrow={t("header.tagline")}
        title={t("pages.projects.title")}
        subtitle={t("pages.projects.subtitle")}
        stats={[
          { label: t("pages.projects.stats.total"), value: items.length },
          { label: t("pages.projects.filters.active"), value: filterCounts.active },
          { label: t("pages.projects.filters.completed"), value: filterCounts.completed },
        ]}
      />

      {/* Content Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
        {/* Filter Bar */}
        <div
          className="sticky top-20 z-30 mb-12"
        >
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-md p-3 shadow-sm">
            <div className="flex items-center gap-2 px-3 text-forest-700">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-semibold hidden sm:inline">{t("pages.projects.filterLabel")}:</span>
            </div>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === f.key
                    ? "bg-forest-600 text-white shadow-md shadow-forest-200"
                    : "text-forest-700 hover:bg-forest-50"
                }`}
              >
                {f.icon}
                {t(f.labelKey)}
                <span
                  className={`ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold ${
                    activeFilter === f.key ? "bg-white/20 text-white" : "bg-forest-100 text-forest-600"
                  }`}
                >
                  {filterCounts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : (
          <>
            <div
              key={activeFilter}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredItems.length === 0
                ? renderEmpty()
                : filteredItems.map((p) => {
                    const imageUrl = resolveMediaUrl(p.featuredImage, fallbackProjectImage);
                    const title = getLocalizedText(p.title, locale) || p.slug;
                    const summary = getLocalizedText(p.summary, locale);
                    const mappedStatus = statusMap[p.status || ""] || "planning";
                    return (
                      <div key={p.slug} className="group flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <a href={`/projects/${p.slug}`} className="block flex-col h-full text-neutral-900 text-decoration-none">
                          <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                            {imageUrl ? (
                              <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            ) : null}
                            <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full border bg-white shadow-sm">
                              {mappedStatus === "planning" ? "Planning" : mappedStatus === "active" ? "Active" : mappedStatus === "completed" ? "Completed" : "On Hold"}
                            </span>
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold mb-2 line-clamp-1">{title}</h3>
                            <p className="text-neutral-600 text-base line-clamp-3 mb-4 flex-1">{summary}</p>
                            <div className="mt-auto pt-4 border-t border-neutral-100 text-sm font-medium text-forest-700 flex items-center gap-2 group-hover:text-forest-800">
                              View Project
                              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}



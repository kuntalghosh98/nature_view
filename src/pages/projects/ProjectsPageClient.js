
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Sprout,
  CheckCircle2,
  Loader2,
  CalendarClock,
} from "lucide-react";

import { useLocale } from "@/providers/LocaleProvider";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects } from "@/store/slices/projectsSlice";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import ItemCard from "@/components/ItemCard";

/** Map API statuses to filter categories */
const statusMap = {
  demo: "planning",
  upcoming: "planning",
  "on-going": "active",
  completed: "completed",
};

/** Filter options – plain JavaScript array */
const filters = [
  {
    key: "all",
    labelKey: "pages.projects.filters.all",
    icon: <SlidersHorizontal className="w-4 h-4" />,
  },
  {
    key: "active",
    labelKey: "pages.projects.filters.active",
    icon: <Loader2 className="w-4 h-4" />,
  },
  {
    key: "completed",
    labelKey: "pages.projects.filters.completed",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    key: "planning",
    labelKey: "pages.projects.filters.planning",
    icon: <CalendarClock className="w-4 h-4" />,
  },
];

const fallbackProjectImage =
  "https://res.cloudinary.com/dkhhjhpbc/image/upload/v1783278022/nature_view/home/tn7v79buqhisnzttngkx.jpg";

export default function ProjectsPageClient() {
  const { locale, t } = useLocale();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.projects.items);
  const loading = useAppSelector((state) => state.projects.loading);

  // Fetch projects on mount if not already loaded
  useEffect(() => {
    if (!items.length && !loading) {
      dispatch(fetchProjects());
    }
  }, [items.length, loading, dispatch]);

  const [activeFilter, setActiveFilter] = useState("all");

  /** Filtered projects based on active filter */
  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((p) => {
      const mapped = statusMap[p.status] || "planning";
      return mapped === activeFilter;
    });
  }, [items, activeFilter]);

  /** Compute counts for each filter badge */
  const filterCounts = useMemo(() => {
    const counts = { all: items.length, active: 0, completed: 0, planning: 0 };
    items.forEach((p) => {
      const mapped = statusMap[p.status] || "planning";
      if (counts[mapped] !== undefined) {
        counts[mapped]++;
      }
    });
    return counts;
  }, [items]);

  /** Render empty state when no projects match filter */
  const renderEmpty = () => (
    <EmptyState
      Icon={Search}
      title={
        activeFilter === "all"
          ? t("pages.projects.noProjects")
          : t("pages.projects.noProjectsFiltered")
      }
      description={
        activeFilter !== "all"
          ? t("common.filterHint")
          : t("common.checkBackSoon")
      }
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

      <section className="relative mx-auto max-w-7xl px-6 py-16 lg-24">
        {/* Filter Bar */}
        <div className="sticky top-20 z-30 mb-12">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-md p-3 shadow-sm">
            <div className="flex items-center gap-2 px-3 text-forest-700">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-semibold hidden sm">{t("pages.projects.filterLabel")}: </span>
            </div>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeFilter === f.key
                    ? "bg-forest-600 text-white shadow-md shadow-forest-200"
                    : "text-forest-700 hover-forest-50"
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
        {loading && items.length === 0 ? (
          <SkeletonGrid />
        ) : (
          <div key={activeFilter} className="grid gap-8 sm-cols-2 lg-cols-3">
            {filteredItems.length === 0
              ? renderEmpty()
              : filteredItems.map((p) => {
                  const title = getLocalizedText(p.title, locale) || p.slug;
                  const summary = getLocalizedText(p.summary, locale);
                  return (
                    <ItemCard
                      key={p.slug}
                      slug={p.slug}
                      title={title}
                      summary={summary}
                      imageUrl={p.featuredImage}
                      fallbackImage={fallbackProjectImage}
                      href={`/projects/${p.slug}`}
                      status={p.status}
                      actionLabel={t("common.viewDetails")}
                    />
                  );
                })}
          </div>
        )}
      </section>
    </div>
  );
}




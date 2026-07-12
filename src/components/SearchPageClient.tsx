"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, AlertCircle, Loader2, ArrowRight, FileText, MapPin, Calendar, Newspaper, Leaf } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { SearchItem, SearchResponse } from "@/types/search";
import { useLocale } from "@/providers/LocaleProvider";

const typeIcon: Record<SearchItem["type"], typeof Leaf> = {
  project: Leaf,
  attraction: MapPin,
  news: Newspaper,
  event: Calendar,
};

const typeColor: Record<SearchItem["type"], string> = {
  project: "bg-forest-100 text-forest-700",
  attraction: "bg-accent-100 text-accent-700",
  news: "bg-blue-100 text-blue-700",
  event: "bg-amber-100 text-amber-700",
};

export function SearchPageClient() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await apiRequest<SearchResponse>(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data || []);
      } catch (err) {
        setResults([]);
        setError(err instanceof Error ? err.message : t("pages.search.error"));
      } finally {
        setLoading(false);
      }
    })();
  }, [query, t]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 to-forest-950 py-20 lg:py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-forest-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-forest-100 backdrop-blur-sm"
          >
            <Search className="h-3.5 w-3.5" />
            {t("pages.search.title")}
          </div>

          <h1
            className="mt-6 text-4xl font-bold text-white font-display lg:text-5xl"
          >
            {query ? (
              <>
                {t("pages.search.resultsFor")} <span className="text-accent-300">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              t("pages.search.title")
            )}
          </h1>

          <p
            className="mx-auto mt-4 max-w-2xl text-base text-forest-100/70 leading-relaxed"
          >
            {t("pages.search.subtitle")}
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-5xl px-4 py-16 lg:py-20">
        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-forest-600" />
            <p className="mt-4 text-sm text-forest-900/60">{t("pages.search.loading")}</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            className="flex flex-col items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 p-12 text-center"
          >
            <AlertCircle className="h-12 w-12 text-rose-500" />
            <p className="mt-4 text-base font-medium text-rose-800">{error}</p>
          </div>
        )}

        {/* No query state */}
        {!loading && !error && !query && (
          <div
            className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-sm"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50">
              <Search className="h-8 w-8 text-forest-600" />
            </div>
            <p className="mt-6 max-w-md text-base text-forest-900/60 leading-relaxed">
              {t("pages.search.noQuery")}
            </p>
          </div>
        )}

        {/* No results state */}
        {!loading && !error && query && results.length === 0 && (
          <div
            className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-sm"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
              <FileText className="h-8 w-8 text-neutral-400" />
            </div>
            <p className="mt-6 text-base font-medium text-forest-900">
              {t("pages.search.noResults")}
            </p>
          </div>
        )}

        {/* Results list */}
        {!loading && !error && results.length > 0 && (
          <div
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-forest-900/60">
                <span className="font-semibold text-forest-900">{results.length}</span> {t("pages.search.resultsCount")}
              </p>
            </div>

            <div className="grid gap-4">
              {results.map((item) => {
                const Icon = typeIcon[item.type] || FileText;
                const colorClass = typeColor[item.type] || "bg-neutral-100 text-neutral-700";

                return (
                  <div key={`${item.type}-${item._id}`}>
                    <Link
                      href={item.url}
                      className="group flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest-200 hover:shadow-xl lg:flex-row lg:items-center lg:p-7"
                    >
                      {/* Icon */}
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colorClass}`}>
                        <Icon className="h-6 w-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${colorClass}`}>
                            {item.type}
                          </span>
                          {item.location && (
                            <span className="inline-flex items-center gap-1 text-xs text-forest-900/50">
                              <MapPin className="h-3 w-3" />
                              {item.location}
                            </span>
                          )}
                        </div>
                        <h2 className="mt-2 text-lg font-semibold text-forest-900 transition-colors group-hover:text-forest-700">
                          {item.title}
                        </h2>
                        <p className="mt-1.5 text-sm text-forest-900/60 leading-relaxed line-clamp-2">
                          {item.summary}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="flex shrink-0 items-center self-end lg:self-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-50 text-forest-600 transition-all duration-300 group-hover:bg-forest-700 group-hover:text-white">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


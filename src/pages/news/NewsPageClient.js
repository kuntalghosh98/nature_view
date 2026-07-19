
import { useState, useMemo, useEffect } from "react";
import { Calendar, Star, Search, X, Sparkles } from "lucide-react";

import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/slices/newsSlice";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import ItemCard from "@/components/ItemCard";
import { resolveMediaUrl } from "@/lib/media";

const fallbackNewsImage =
  "https://res.cloudinary.com/dkhhjhpbc/image/upload/v1783278022/nature_view/home/tn7v79buqhisnzttngkx.jpg";

export default function NewsPageClient() {
  const { locale, t } = useLocale();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.news.items);
  const loading = useAppSelector((state) => state.news.loading);
  const featured = []; // No featured handling in Redux slice

  // Load news on mount if not present
  useEffect(() => {
    if (!items.length && !loading) {
      dispatch(fetchNews());
    }
  }, [items.length, loading, dispatch]);
  const [searchQuery, setSearchQuery] = useState("");

  /** Filter news by search query */
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      const title = getLocalizedText(item.title, locale) || "";
      const summary = getLocalizedText(item.summary, locale) || "";
      return title.toLowerCase().includes(q) || summary.toLowerCase().includes(q);
    });
  }, [items, searchQuery, locale]);

  /** Empty state */
  const renderEmpty = () => (
    <EmptyState
      Icon={Search}
      title={t("pages.news.noNews")}
      description={searchQuery ? t("common.searchHint") : t("common.checkBackSoon")}
      actionLabel={searchQuery ? t("common.clearSearch") : undefined}
      onAction={searchQuery ? () => setSearchQuery("") : undefined}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-forest-50/30 to-white">
      <PageHero
        icon={Sparkles}
        eyebrow={t("header.tagline")}
        title={t("pages.news.title")}
        subtitle={t("pages.news.subtitle")}
        stats={[
          { label: t("pages.news.stats.featured"), value: featured.length },
          { label: t("pages.news.stats.total"), value: items.length },
          { label: t("pages.news.stats.categories"), value: "4+" },
        ]}
      />

      {/* Content Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 lg-24">
        {/* Search Bar */}
        <div
          className="relative mb-16"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("pages.news.searchPlaceholder")}
              className="w-full pl-12 pr-10 py-3.5 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-sm text-forest-900 placeholder-forest-400 focus-none focus-2 focus-forest-500/20 focus-forest-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-forest-400 hover-forest-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {loading && items.length === 0 ? (
          <>
            {/* Featured skeletons */}
            <div className="space-y-4 mb-16">
              <div className="h-8 bg-neutral-200 rounded-full w-48 animate-pulse" />
              <SkeletonGrid variant="featured" />
            </div>
            {/* All news skeletons */}
            <div className="space-y-4">
              <div className="h-8 bg-neutral-200 rounded-full w-48 animate-pulse" />
              <SkeletonGrid />
            </div>
          </>
        ) : (
          <>
            {/* Featured Stories */}
            {featured.length > 0 && (
              <section
                className="mb-20"
              >
                <div className="flex items-center gap-3 mb-10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <h2 className="text-2xl sm-3xl font-bold text-forest-900 font-display">{t("pages.news.featured")}</h2>
                </div>
                <div
                  className="grid gap-8 sm-cols-2"
                >
                  {featured.map((item) => {
                    const imageUrl = resolveMediaUrl(item.featuredImage, fallbackNewsImage);
                    const title = getLocalizedText(item.title, locale) || item.slug;
                    const summary = getLocalizedText(item.summary, locale);
                    return (
                      <div key={item._id || item.slug} className="group flex flex-col sm-row bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover-xl hover:-translate-y-1 transition-all duration-300">
                        <a href={`/news/${item.slug}`} className="block flex sm-row flex-col h-full text-neutral-900 text-decoration-none">
                          <div className="relative aspect-[4/3] sm-auto sm-1/2 bg-neutral-100 overflow-hidden shrink-0">
                            {imageUrl ? (
                              <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover-105" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-center">
                            <div className="text-sm text-forest-600 font-medium mb-2">
                              {new Date(item.publishedAt || new Date()).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <h3 className="text-xl sm-2xl font-bold mb-3 line-clamp-2">{title}</h3>
                            <p className="text-neutral-600 text-base line-clamp-3 mb-4">{summary}</p>
                            <div className="mt-auto text-sm font-medium text-forest-700 flex items-center gap-2 group-hover-forest-800">
                              Read Full Story
                              <svg className="w-4 h-4 transition-transform group-hover-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* All Updates */}
            <section>
              <div className="flex items-center gap-3 mb-10">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-forest-100">
                  <Calendar className="w-5 h-5 text-forest-600" />
                </div>
                <h2 className="text-2xl sm-3xl font-bold text-forest-900 font-display">{t("pages.news.allUpdates")}</h2>
              </div>
              <>
                <div
                  key={searchQuery}
                  className="grid gap-8 sm-cols-2 lg-cols-3"
                >
                  {filteredItems.length === 0 ? (
                    renderEmpty()
                  ) : (
                    filteredItems.map((item) => {
                      const title = getLocalizedText(item.title, locale) || item.slug;
                      const summary = getLocalizedText(item.summary, locale);
                      const date = new Date(item.publishedAt || new Date()).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                      return (
                        <ItemCard
                          key={item._id || item.slug}
                          slug={item.slug}
                          title={title}
                          summary={summary}
                          imageUrl={item.featuredImage}
                          fallbackImage={fallbackNewsImage}
                          href={`/news/${item.slug}`}
                          date={date}
                          actionLabel="Read More"
                        />
                      );
                    })
                  )}
                </div>
              </>
            </section>
          </>
        )}
      </section>
    </div>
  );
}



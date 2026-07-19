
import { useState, useMemo, useEffect } from "react";
import { Sparkles, Star, MapPin, Search, X } from "lucide-react";

import { resolveMediaUrl } from "@/lib/media";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAttractions } from "@/store/slices/attractionsSlice";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import ItemCard from "@/components/ItemCard";

const fallbackAttractionImage =
  "https://res.cloudinary.com/dkhhjhpbc/image/upload/v1783278022/nature_view/home/tn7v79buqhisnzttngkx.jpg";

export default function AttractionsPageClient() {
  const { locale, t } = useLocale();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.attractions.items);
  const loading = useAppSelector((state) => state.attractions.loading);
  const featured = []; // No separate featured handling in Redux slice; keep empty for now

  // Load attractions on mount if not present
  useEffect(() => {
    if (!items.length && !loading) {
      dispatch(fetchAttractions());
    }
  }, [items.length, loading, dispatch]);
  const [searchQuery, setSearchQuery] = useState("");

  /** Filter attractions by search query */
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
      title={t("pages.attractions.noAttractions")}
      description={searchQuery ? t("common.searchHint") : t("common.checkBackSoon")}
      actionLabel={searchQuery ? t("common.clearSearch") : null}
      onAction={searchQuery ? () => setSearchQuery("") : null}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-forest-50/30 to-white">
      <PageHero
        icon={Sparkles}
        eyebrow={t("header.tagline")}
        title={t("pages.attractions.title")}
        subtitle={t("pages.attractions.subtitle")}
        stats={[
          { label: t("pages.attractions.stats.featured"), value: featured.length },
          { label: t("pages.attractions.stats.total"), value: items.length },
          { label: t("pages.attractions.stats.categories"), value: "5+" },
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
              placeholder={t("pages.attractions.searchPlaceholder")}
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
            {/* All attractions skeletons */}
            <div className="space-y-4">
              <div className="h-8 bg-neutral-200 rounded-full w-48 animate-pulse" />
              <SkeletonGrid />
            </div>
            </>
        ) : (
          <>
            {/* Featured Attractions */}
            {featured.length > 0 && (
              <section
                className="mb-20"
              >
                <div className="flex items-center gap-3 mb-10">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                    <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                  <h2 className="text-2xl sm-3xl font-bold text-forest-900 font-display">{t("pages.attractions.featured")}</h2>
                </div>
                <div
                  className="grid gap-8 sm-cols-2"
                >
                  {featured.map((item) => {
                    const imageUrl = resolveMediaUrl(item.featuredImage, fallbackAttractionImage);
                    const title = getLocalizedText(item.title, locale) || item.slug;
                    const summary = getLocalizedText(item.summary, locale);
                    return (
                      <div key={item._id || item.slug} className="group flex flex-col sm-row bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover-xl hover:-translate-y-1 transition-all duration-300">
                        <a href={`/attractions/${item.slug}`} className="block flex sm-row flex-col h-full text-neutral-900 text-decoration-none w-full">
                          <div className="relative aspect-[4/3] sm-[4/3] sm-1/2 bg-neutral-100 overflow-hidden shrink-0">
                            {imageUrl && (
                              <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover-105" />
                            )}
                            <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm bg-amber-400 text-amber-900 border-amber-300">
                              Featured
                            </span>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-center">
                            <h3 className="text-xl sm-2xl font-bold mb-3 line-clamp-2">{title}</h3>
                            <p className="text-neutral-600 text-base line-clamp-3 mb-4">{summary}</p>
                            <div className="mt-auto text-sm font-medium text-forest-700 flex items-center gap-2 group-hover-forest-800">
                              Explore Attraction
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

            {/* All Attractions */}
            <section>
              <div className="flex items-center gap-3 mb-10">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-forest-100">
                  <MapPin className="w-5 h-5 text-forest-600" />
                </div>
                <h2 className="text-2xl sm-3xl font-bold text-forest-900 font-display">{t("pages.attractions.allAttractions")}</h2>
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
                      return (
                        <ItemCard
                          key={item._id || item.slug}
                          slug={item.slug}
                          title={title}
                          summary={summary}
                          imageUrl={item.featuredImage}
                          fallbackImage={fallbackAttractionImage}
                          href={`/attractions/${item.slug}`}
                          actionLabel="View Details"
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




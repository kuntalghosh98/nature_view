"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Leaf, Award, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { ImpactMetric, ImpactListResponse } from "@/types/impact";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

const iconMap: Record<number, React.ReactNode> = {
  0: <Leaf className="w-6 h-6" />,
  1: <TrendingUp className="w-6 h-6" />,
  2: <Award className="w-6 h-6" />,
  3: <BarChart3 className="w-6 h-6" />,
};

function getIcon(index: number): React.ReactNode {
  return iconMap[index % 4] ?? <Leaf className="w-6 h-6" />;
}

export default function ImpactPage() {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<ImpactListResponse>("/impact");
        setItems(res.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const highlighted = items.filter((i) => i.isHighlighted);
  const regular = items.filter((i) => !i.isHighlighted);

  return (
    <div className="min-h-screen">
      <PageHero
        icon={BarChart3}
        eyebrow={t("pages.impact.metrics")}
        title={t("pages.impact.title")}
        subtitle={t("pages.impact.subtitle")}
        stats={[
          { label: t("pages.impact.stats.totalMetrics"), value: items.length },
          { label: t("pages.impact.stats.highlighted"), value: highlighted.length },
        ]}
      />

      {/* Content */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
        {loading ? (
          <SkeletonGrid />
        ) : items.length > 0 ? (
          <>
            {/* Highlighted Metrics */}
            {highlighted.length > 0 && (
              <div
                className="mb-16"
              >
                <div className="text-center mb-10">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent-300/60 bg-accent-50 px-4 py-1.5 text-sm font-semibold text-accent-700">
                    <Award className="w-4 h-4" />
                    {t("pages.impact.stories")}
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {highlighted.map((item, idx) => (
                    <div key={item._id}>
                      <div className="group flex flex-col items-center text-center bg-forest-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                          {getIcon(idx)}
                        </div>
                        <div className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
                          {item.value}
                        </div>
                        <h3 className="text-lg font-semibold text-white/90 mb-3">
                          {getLocalizedText(item.title, locale) || t("pages.impact.title")}
                        </h3>
                        <p className="text-white/80 text-sm leading-relaxed">
                          {getLocalizedText(item.description, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Metrics Grid */}
            <div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {regular.map((item, idx) => (
                <div key={item._id}>
                  <div className="group flex flex-col items-center text-center bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-forest-50 flex items-center justify-center mb-5 text-forest-600 group-hover:scale-110 group-hover:bg-forest-100 transition-all duration-300">
                      {getIcon(idx + highlighted.length)}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                      {item.value}
                    </div>
                    <h3 className="text-base font-semibold text-neutral-700 mb-2">
                      {getLocalizedText(item.title, locale) || t("pages.impact.title")}
                    </h3>
                    {getLocalizedText(item.description, locale) && (
                      <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
                        {getLocalizedText(item.description, locale)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={BarChart3}
            title={t("pages.impact.noImpact")}
            description={t("common.checkBackSoon")}
          />
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div
          >
            <p className="text-sm font-medium tracking-widest uppercase text-forest-600">
              {t("pages.impact.cta.eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-forest-900 font-display lg:text-4xl">
              {t("pages.impact.cta.title")}
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-forest-900/60 leading-relaxed">
              {t("pages.impact.cta.subtitle")}
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-forest-700/20 transition-all duration-300 hover:bg-forest-800 hover:shadow-xl hover:shadow-forest-700/25 hover:-translate-y-0.5"
            >
              {t("pages.impact.cta.button")}
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}




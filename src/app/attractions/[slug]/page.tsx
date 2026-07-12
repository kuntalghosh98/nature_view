"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Attraction } from "@/types/attraction";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { resolveMediaUrl } from "@/lib/media";
import { useLocale } from "@/providers/LocaleProvider";
import { StatusBadge } from "@/components/StatusBadge";

export default function AttractionDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState<Attraction | null>(null);
  const { locale, t } = useLocale();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: Attraction }>(`/attractions/slug/${slug}`);
        setItem(res.data);
      } catch {
        setItem(null);
      }
    })();
  }, [slug]);

  if (!item) return <div className="mx-auto max-w-xl py-12 text-center text-forest-900/60 font-medium">{t("pages.attractions.detail.notFound")}</div>;

  const featuredImgUrl = resolveMediaUrl(item.featuredImage);
  const galleryItems = (item.gallery || []).map((img) => {
    const url = resolveMediaUrl(img);
    return {
      url,
      isVideo: url.endsWith(".mp4") || (typeof img === "object" && img !== null && img.filename?.endsWith(".mp4"))
    };
  }).filter(x => x.url);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div>
        <Link
          href="/attractions"
          className="inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("pages.attractions.detail.back")}
        </Link>
      </div>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={item.status} className="py-1 px-3" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-forest-900 sm:text-4xl md:text-5xl">
          {getLocalizedText(item.title, locale)}
        </h1>
        <p className="text-lg text-forest-900/75 leading-relaxed font-medium">
          {getLocalizedText(item.summary, locale)}
        </p>
      </header>

      {featuredImgUrl && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-forest-100 shadow-sm border border-forest-900/5">
          <Image
            src={featuredImgUrl}
            alt={getLocalizedText(item.title, locale)}
            fill
            sizes="100vw"
            className="h-full w-full object-cover"
            unoptimized
            priority
          />
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div
            className="prose prose-forest max-w-none text-forest-900/80 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{
              __html: getLocalizedText(item.body, locale) || "",
            }}
          />

          {galleryItems.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-forest-900/10">
              <h3 className="text-xl font-bold text-forest-900">
                {t("pages.attractions.detail.mediaGallery")}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {galleryItems.map((media: { url: string; isVideo: boolean | undefined }, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-2xl bg-black/5 border border-forest-900/5"
                  >
                    {media.isVideo ? (
                      <video
                        src={media.url}
                        controls
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={media.url}
                        alt={`Gallery item ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="h-full w-full object-cover hover:scale-102 transition duration-300 animate-fade-in"
                        loading="lazy"
                        unoptimized
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-forest-900/10 bg-forest-50/50 p-6 space-y-4">
            <h4 className="font-bold text-forest-900">
              {t("pages.attractions.detail.visitorInfo")}
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-xs font-semibold text-forest-900/50 uppercase tracking-wider">
                  {t("pages.attractions.detail.status")}
                </span>
                <span className="font-medium text-forest-950 capitalize">{item.status || "demo"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-forest-900/50 uppercase tracking-wider">
                  {t("pages.attractions.detail.access")}
                </span>
                <span className="font-medium text-forest-950">
                  {t("pages.attractions.detail.accessValue")}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/contact"
                className="block text-center rounded-full bg-forest-700 hover:bg-forest-800 text-white font-semibold py-2.5 text-sm transition"
              >
                {t("pages.attractions.detail.planVisit")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

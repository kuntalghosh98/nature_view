"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";

import { apiRequest } from "@/lib/api";
import type { Project } from "@/types/project";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";
import { StatusBadge } from "@/components/StatusBadge";

export default function ProjectDetailPage() {
  const { locale } = useLocale();
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

  if (!item) return <div className="mx-auto max-w-xl py-12 text-center text-forest-900/60">Project not found</div>;

  const featuredImgUrl = (item.featuredImage as any)?.url || null;
  const galleryImages = (item.gallery || []).map((img: any) => img.url || img).filter(Boolean);
  const formattedDate = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center text-sm font-semibold text-forest-700 hover:text-forest-900 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {locale === "bn" ? "প্রকল্পগুলিতে ফিরে যান" : "Back to projects"}
        </Link>
      </div>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={item.status} className="py-1 px-3" />
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-forest-900/50 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
          )}
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
          <img
            src={featuredImgUrl}
            alt={getLocalizedText(item.title, locale)}
            className="h-full w-full object-cover"
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

          {galleryImages.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-forest-900/10">
              <h3 className="text-xl font-bold text-forest-900">
                {locale === "bn" ? "ছবি গ্যালারি" : "Photo Gallery"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {galleryImages.map((url: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-video overflow-hidden rounded-2xl bg-forest-100 border border-forest-900/5"
                  >
                    <img
                      src={url}
                      alt={`Gallery item ${index + 1}`}
                      className="h-full w-full object-cover hover:scale-102 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-forest-900/10 bg-forest-50/50 p-6 space-y-4">
            <h4 className="font-bold text-forest-900">
              {locale === "bn" ? "প্রকল্প তথ্য" : "Project Information"}
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-xs font-semibold text-forest-900/50 uppercase tracking-wider">
                  {locale === "bn" ? "অবস্থা" : "Status"}
                </span>
                <span className="font-medium text-forest-950 capitalize">{item.status || "demo"}</span>
              </div>
              {formattedDate && (
                <div>
                  <span className="block text-xs font-semibold text-forest-900/50 uppercase tracking-wider">
                    {locale === "bn" ? "প্রকাশের তারিখ" : "Published Date"}
                  </span>
                  <span className="font-medium text-forest-950">{formattedDate}</span>
                </div>
              )}
            </div>
            <div className="pt-2">
              <Link
                href="/contact"
                className="block text-center rounded-full bg-forest-700 hover:bg-forest-800 text-white font-semibold py-2.5 text-sm transition"
              >
                {locale === "bn" ? "আমাদের সাথে যোগাযোগ করুন" : "Get Involved"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

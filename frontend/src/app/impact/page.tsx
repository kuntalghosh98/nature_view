"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { ImpactMetric, ImpactListResponse } from "@/types/impact";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

export default function ImpactPage() {
  const { locale } = useLocale();
  const [items, setItems] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<ImpactListResponse>("/impact");
        setItems(res.data || []);
      } catch (_err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold">Impact</h1>
        <p className="text-sm text-forest-900/65">See the measurable outcomes from our conservation work.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-lg border bg-white p-5 shadow-sm">Loading...</div>
        ) : items.length > 0 ? (
          items.map((item) => (
            <article key={item._id} className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="text-4xl font-bold text-forest-700">{item.value}</div>
              <h2 className="mt-3 text-xl font-semibold">{getLocalizedText(item.title, locale) || "Impact"}</h2>
              <p className="mt-2 text-sm text-forest-900/70">{getLocalizedText(item.description, locale)}</p>
              {item.isHighlighted ? <span className="mt-4 inline-flex rounded-full bg-forest-50 px-3 py-1 text-xs text-forest-900">Highlighted</span> : null}
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-lg border bg-white p-5 shadow-sm">No impact metrics are available yet.</div>
        )}
      </section>
    </div>
  );
}

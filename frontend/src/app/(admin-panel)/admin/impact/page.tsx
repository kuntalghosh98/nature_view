"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { ImpactMetric } from "@/types/impact";
import { useAppSelector } from "@/store/hooks";
import { ImpactMetricForm } from "@/components/admin/ImpactMetricForm";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

export default function AdminImpactPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocale();
  const [editing, setEditing] = useState<ImpactMetric | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: ImpactMetric[] }>("/impact/admin", { token });
      setItems(res.data || []);
    } catch (_err) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id?: string) {
    if (!id) return;
    await apiRequest(`/impact/${id}`, { method: "DELETE", token });
    await load();
  }

  function clearEditing() {
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Impact Metrics</h2>
        <p className="text-sm text-forest-900/65">Manage impact cards shown to visitors.</p>
      </section>

      <section className="rounded-lg border bg-white p-5">
        <ImpactMetricForm
          impact={editing || undefined}
          onSaved={() => {
            load();
            clearEditing();
          }}
          onCancel={clearEditing}
        />
      </section>

      <section>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">{item.value}</div>
                    <div className="text-xs text-forest-900/60">{getLocalizedText(item.title, locale)}</div>
                    <div className="mt-2 text-xs text-forest-900/70">{getLocalizedText(item.description, locale)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setEditing(item)} className="rounded-lg border px-3 py-1 text-sm">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="rounded-lg border px-3 py-1 text-sm text-red-700">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

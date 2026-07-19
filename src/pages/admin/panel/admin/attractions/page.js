"use client";
import React from "react";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
// Types are omitted for plain JavaScript implementation.
import { useAppSelector } from "@/store/hooks";
import { AttractionForm } from "@/components/admin/AttractionForm";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { useLocale } from "@/providers/LocaleProvider";

export default function AdminAttractionsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useLocale();
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/attractions/admin', { token });
      setItems(res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id?: string) {
    if (!id) return;
    await apiRequest(`/attractions/${id}`, { method: "DELETE", token });
    await load();
  }

  function clearEditing() {
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Attractions</h2>
        <p className="text-sm text-forest-900/65">Create and manage featured visitor attractions.</p>
      </section>

      <section className="rounded-lg border bg-white p-5">
        <AttractionForm
          attraction={editing || undefined}
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
            // @ts-ignore: item._id may be undefined in plain JS
            // @ts-ignore: item._id may be undefined in plain JS
            {items.map((item) => (
              // @ts-ignore
              <div key={item._id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    // @ts-ignore
                    <div className="font-medium">{getLocalizedText((item as any).title, locale) || (item as any).slug}</div>
                    <div className="text-xs text-forest-900/60">{getLocalizedText((item as any).summary, locale)}</div>
                    <div className="mt-1 text-xs text-forest-900/70">{(item as any).isFeatured ? "Featured" : "Standard"} • {(item as any).isPublished ? "Published" : "Draft"}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setEditing(item)} className="rounded-lg border px-3 py-1 text-sm">Edit</button>
                    <button onClick={() => handleDelete((item as any)._id)} className="rounded-lg border px-3 py-1 text-sm text-red-700">Delete</button>
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

"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { NewsItem } from "@/types/news";
import { useAppSelector } from "@/store/hooks";
import { NewsForm } from "@/components/admin/NewsForm";

export default function AdminNewsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsItem | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: NewsItem[] }>("/news/admin", { token });
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
    await apiRequest(`/news/${id}`, { method: "DELETE", token });
    await load();
  }

  function clearEditing() {
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">News</h2>
        <p className="text-sm text-forest-900/65">Create and manage news and stories.</p>
      </section>

      <section className="rounded-lg border bg-white p-5">
        <NewsForm
          news={editing || undefined}
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
                    <div className="font-medium">{item.title?.en || item.slug}</div>
                    <div className="text-xs text-forest-900/60">{item.summary?.en}</div>
                    <div className="mt-2 text-xs text-forest-900/70">{item.isFeatured ? "Featured" : "Standard"} • {item.isPublished ? "Published" : "Draft"}</div>
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

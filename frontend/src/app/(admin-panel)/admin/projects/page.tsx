"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { Project } from "@/types/project";
import { useAppSelector } from "@/store/hooks";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function AdminProjectsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: Project[] }>("/projects/admin", { token });
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
    await apiRequest(`/projects/${id}`, { method: "DELETE", token });
    await load();
  }

  function clearEditing() {
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-sm text-forest-900/65">Create and manage projects.</p>
      </section>

      <section className="rounded-lg border bg-white p-5">
        <ProjectForm
          project={editing || undefined}
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
            {items.map((p) => (
              <div key={p._id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">{p.title?.en || p.slug}</div>
                    <div className="text-xs text-forest-900/60">{p.summary?.en}</div>
                    <div className="mt-2 text-xs text-forest-900/70">{p.isPublished ? "Published" : "Draft"}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setEditing(p)} className="rounded-lg border px-3 py-1 text-sm">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="rounded-lg border px-3 py-1 text-sm text-red-700">Delete</button>
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

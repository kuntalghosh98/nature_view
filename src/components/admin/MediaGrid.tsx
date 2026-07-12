"use client";

import { useState } from "react";
import Image from "next/image";
import { apiRequest } from "@/lib/api";
import type { MediaItem } from "@/types/media";
import { useAppSelector } from "@/store/hooks";

export function MediaGrid({ items, onChanged }: { items: MediaItem[]; onChanged?: () => void }) {
  const { token } = useAppSelector((state) => state.auth);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!token) return;
    setDeleting(id);
    try {
      await apiRequest(`/media/${id}`, { method: "DELETE", token });
      onChanged?.();
    } catch {
      // swallow for now
    } finally {
      setDeleting(null);
    }
  }

  if (!items.length) {
    return <p className="rounded-lg bg-white p-6">No media yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-forest-50 text-left text-xs text-forest-700 uppercase">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Filename</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Uploaded</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((m) => (
              <tr key={m._id}>
                <td className="px-4 py-3">
                  <Image src={m.url} alt={m.alt || m.filename} width={80} height={48} className="h-12 w-20 object-cover" unoptimized />
                </td>
                <td className="px-4 py-3">{m.filename}</td>
                <td className="px-4 py-3">{m.type}</td>
                <td className="px-4 py-3">{m.createdAt ? new Date(m.createdAt).toLocaleString() : "-"}</td>
                <td className="px-4 py-3">
                  <button disabled={deleting === m._id} onClick={() => handleDelete(m._id)} className="rounded-lg border px-3 py-1 text-xs">
                    {deleting === m._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

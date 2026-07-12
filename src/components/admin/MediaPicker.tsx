"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiRequest } from "@/lib/api";
import type { MediaItem } from "@/types/media";
import { useAppSelector } from "@/store/hooks";

export function MediaPicker({ onSelect }: { onSelect: (item: MediaItem) => void }) {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await apiRequest<{ success: boolean; data: MediaItem[] }>("/media", { token });
        setItems(res.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  if (loading) return <p>Loading media...</p>;

  return (
    <div className="grid gap-3">
      {items.map((m) => (
        <button key={m._id} onClick={() => onSelect(m)} className="flex items-center gap-3 rounded-lg border p-2 text-left">
          <Image src={m.url} alt={m.alt || m.filename} width={80} height={48} className="h-12 w-20 object-cover" unoptimized />
          <div>
            <div className="font-medium">{m.filename}</div>
            <div className="text-xs text-forest-900/60">{m.type}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

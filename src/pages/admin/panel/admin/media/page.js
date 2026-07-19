"use client";
import React from "react";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaGrid } from "@/components/admin/MediaGrid";
import { apiRequest } from "@/lib/api";
// Types are omitted for plain JavaScript implementation.

// Pagination interface omitted for plain JavaScript.

export default function MediaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);

  async function load(p = 1) {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest(`/media?page=${p}`, { token });
      if (p === 1) setItems(response.data || []);
      else setItems((prev) => [...prev, ...(response.data || [])]);
      setPage(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-forest-900">Media Library</h2>
        <p className="mt-2 text-sm text-forest-900/65">Upload and manage images and videos used across the site.</p>
      </section>

      <section className="rounded-lg border bg-white p-5">
        <MediaUploader onUploaded={load} />
      </section>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section>
        {loading && items.length === 0 ? <p>Loading...</p> : <MediaGrid items={items} onChanged={() => load(1)} />}
        <div className="mt-3">
          <button onClick={() => load(page + 1)} className="rounded-lg border px-3 py-2 text-sm">
            Load more
          </button>
        </div>
      </section>
    </div>
  );
}

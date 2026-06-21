"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import type { SearchItem, SearchResponse } from "@/types/search";

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await apiRequest<SearchResponse>(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data || []);
      } catch (err) {
        setResults([]);
        setError(err instanceof Error ? err.message : "Unable to search now.");
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  const title = query ? `Results for "${query}"` : "Search";

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm text-forest-900/65">Search across projects, attractions, news, and events.</p>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-forest-900/10 bg-white p-8 text-center text-forest-900 shadow-sm">Loading search results...</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-900/10 bg-rose-50 p-8 text-center text-rose-900 shadow-sm">{error}</div>
      ) : results.length === 0 ? (
        <div className="rounded-3xl border border-forest-900/10 bg-white p-8 text-center text-forest-900 shadow-sm">No results found. Try a different term.</div>
      ) : (
        <div className="grid gap-4">
          {results.map((item) => (
            <Link
              key={`${item.type}-${item._id}`}
              href={item.url}
              className="group rounded-3xl border border-forest-900/10 bg-white p-6 transition hover:-translate-y-0.5 hover:border-forest-700/20 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-forest-700">{item.type}</p>
                  <h2 className="mt-2 text-xl font-semibold text-forest-900">{item.title}</h2>
                </div>
                {item.location ? <span className="rounded-full bg-forest-100 px-3 py-1 text-xs text-forest-900">{item.location}</span> : null}
              </div>
              <p className="mt-4 text-sm text-forest-900/75">{item.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
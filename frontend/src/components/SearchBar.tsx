"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTerm = searchParams?.get("q") || "";
  const [query, setQuery] = useState(initialTerm);

  const buttonDisabled = useMemo(() => query.trim().length === 0, [query]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-forest-500" />
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search projects, attractions, news, events"
        className="w-full rounded-full border border-forest-900/10 bg-white py-4 pl-12 pr-36 text-sm text-forest-900 shadow-sm outline-none transition focus:border-forest-700 focus:ring-4 focus:ring-forest-100"
      />
      <button
        type="submit"
        disabled={buttonDisabled}
        className="absolute right-1.5 top-1/2 inline-flex h-10 items-center rounded-full bg-forest-700 px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-forest-300 disabled:text-forest-500 disabled:hover:bg-forest-300"
      >
        Search
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </form>
  );
}
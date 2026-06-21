import { buildMetadata } from "@/components/SeoMeta";
import { SearchPageClient } from "@/components/SearchPageClient";

export const metadata = buildMetadata({
  title: "Search | Nature View",
  description: "Search across the Nature View projects, attractions, events, and news.",
  keywords: "search, projects, attractions, news, events"
});

export default function SearchPage() {
  return <SearchPageClient />;
}
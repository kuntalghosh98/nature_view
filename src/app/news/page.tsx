import { buildMetadata } from "@/components/SeoMeta";
import NewsPageClient from "./NewsPageClient";

export const metadata = buildMetadata({
  title: "News | Nature View",
  description:
    "Read the latest updates, stories, and announcements from Nature View.",
  keywords: "news, updates, stories, conservation",
});

export default function NewsPage() {
  return <NewsPageClient />;
}
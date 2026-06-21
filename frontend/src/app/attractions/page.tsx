import { buildMetadata } from "@/components/SeoMeta";
import AttractionsPageClient from "./AttractionsPageClient";

export const metadata = buildMetadata({
  title: "Attractions | Nature View",
  description:
    "Discover featured attractions and visitor experiences at Nature View.",
  keywords: "attractions, visitor experiences, nature, eco-tourism",
});

export default function AttractionsPage() {
  return <AttractionsPageClient />;
}
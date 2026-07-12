import { buildMetadata } from "@/components/SeoMeta";
import EventsPageClient from "./EventsPageClient";

export const metadata = buildMetadata({
  title: "Events | Nature View",
  description: "Browse upcoming conservation events and community programs.",
  keywords: "events, community, conservation, programs"
});

export default function EventsPage() {
  return <EventsPageClient />;
}
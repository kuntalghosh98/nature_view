import { buildMetadata } from "@/components/SeoMeta";
import ProjectsPageClient from "./ProjectsPageClient";

export const metadata = buildMetadata({
  title: "Projects | Nature View",
  description:
    "Explore published conservation projects and eco-tourism initiatives.",
  keywords: "projects, conservation, eco-tourism, nature",
});

export default function Page() {
  return <ProjectsPageClient />;
}
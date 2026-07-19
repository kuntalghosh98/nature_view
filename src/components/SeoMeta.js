export function buildMetadata({ title, description, keywords, image }) {
  const baseUrl = import.meta.env.VITE_SITE_URL || "http://localhost:3000";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    metadataBase: baseUrl,
    keywords: keywords ? keywords.split(",").map((t) => t.trim()) : [],
  };
}

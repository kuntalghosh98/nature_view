import type { Metadata } from "next";

export function buildMetadata({
  title,
  description,
  keywords,
  image
}: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    keywords: keywords ? keywords.split(",").map((token) => token.trim()) : undefined
  };
}
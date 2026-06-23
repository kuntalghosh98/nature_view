

import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { PublicShell } from "@/components/PublicShell";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Nature View",
  description: "Nature View conservation tourism and environmental impact site"
  ,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Nature View",
    description: "Nature View conservation tourism and environmental impact site",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Nature View",
    description: "Nature View conservation tourism and environmental impact site"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

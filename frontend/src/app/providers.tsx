"use client";

import { StoreProvider } from "@/store/StoreProvider";
import { PublicShell } from "@/components/PublicShell";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <PublicShell>{children}</PublicShell>
    </StoreProvider>
  );
}
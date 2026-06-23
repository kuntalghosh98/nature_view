"use client";

import { StoreProvider } from "@/store/StoreProvider";
import { PublicShell } from "@/components/PublicShell";
import { LocaleProvider } from "@/providers/LocaleProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <LocaleProvider>
        <PublicShell>{children}</PublicShell>
      </LocaleProvider>
    </StoreProvider>
  );
}
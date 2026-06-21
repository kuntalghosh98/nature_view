"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin ? <PublicHeader /> : null}
      <div className={!isAdmin ? "min-h-screen bg-[#f7f4ed]" : "min-h-screen bg-[#f7f4ed]"}>{children}</div>
      {!isAdmin ? <PublicFooter /> : null}
    </>
  );
}

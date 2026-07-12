"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ProtectedRoute } from "./ProtectedRoute";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f4ed] text-[#172018]">
        <Sidebar />
        <div className="min-h-screen lg:pl-72">
          <Header />
          <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

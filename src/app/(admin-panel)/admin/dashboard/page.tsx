"use client";

import { useAppSelector } from "@/store/hooks";

export default function AdminDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-forest-900/10 bg-white p-6 shadow-panel">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-forest-700">Sprint 1</p>
        <h2 className="mt-3 text-3xl font-semibold text-forest-900">Welcome back, {user?.name}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-forest-900/65">
          This dashboard is intentionally lean for the first sprint. Authentication, roles, and audit visibility are the base every future CMS module will use.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard label="Role" value={user?.role || "-"} />
        <InfoCard label="Email" value={user?.email || "-"} />
        <InfoCard label="Last Login" value={user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "First session"} />
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-forest-900/10 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-700">{label}</p>
      <p className="mt-2 break-words text-lg font-semibold text-forest-900">{value}</p>
    </div>
  );
}

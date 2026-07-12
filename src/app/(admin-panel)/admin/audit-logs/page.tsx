"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import type { AuditLog } from "@/types/audit";

type AuditResponse = {
  success: boolean;
  data: AuditLog[];
};

export default function AuditLogsPage() {
  const { token, user } = useAppSelector((state) => state.auth);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      if (!token || user?.role !== "SUPER_ADMIN") return;

      try {
        const response = await apiRequest<AuditResponse>("/audit-logs", { token });
        setLogs(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, [token, user?.role]);

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className="rounded-lg border border-forest-900/10 bg-white p-6">
        <h2 className="text-xl font-semibold text-forest-900">Access denied</h2>
        <p className="mt-2 text-sm text-forest-900/65">Only super admins can view audit logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-forest-900">Audit Logs</h2>
        <p className="mt-2 text-sm text-forest-900/65">Authentication and admin-management activity is recorded here.</p>
      </section>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="overflow-hidden rounded-lg border border-forest-900/10 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-forest-900/10 text-sm">
            <thead className="bg-forest-50 text-left text-xs uppercase tracking-[0.12em] text-forest-700">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/10">
              {loading ? (
                <tr><td className="px-4 py-4" colSpan={5}>Loading...</td></tr>
              ) : logs.map((log) => (
                <tr key={log._id}>
                  <td className="whitespace-nowrap px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{log.userName}</td>
                  <td className="px-4 py-3">{log.module}</td>
                  <td className="px-4 py-3 font-medium">{log.action}</td>
                  <td className="px-4 py-3">{log.entityTitle || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import type { AdminRole, AdminUser } from "@/types/auth";

type AdminsResponse = {
  success: boolean;
  data: AdminUser[];
};

export default function AdminsPage() {
  const { token, user } = useAppSelector((state) => state.auth);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ADMIN" as AdminRole });

  async function loadAdmins() {
    if (!token || user?.role !== "SUPER_ADMIN") return;
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<AdminsResponse>("/admins", { token });
      setAdmins(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    try {
      await apiRequest("/admins", {
        method: "POST",
        token,
        body: JSON.stringify(form)
      });
      setForm({ name: "", email: "", password: "", role: "ADMIN" });
      await loadAdmins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create admin");
    }
  }

  async function handleDisable(id: string) {
    if (!token) return;
    await apiRequest(`/admins/${id}`, { method: "DELETE", token });
    await loadAdmins();
  }

  if (user?.role !== "SUPER_ADMIN") {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold text-forest-900">Admins</h2>
        <p className="mt-2 text-sm text-forest-900/65">Create admins and manage active access. Deletes are soft disables.</p>
      </section>

      <form onSubmit={handleCreate} className="grid gap-3 rounded-lg border border-forest-900/10 bg-white p-5 md:grid-cols-5">
        <input className="rounded-lg border border-forest-900/15 px-3 py-2.5" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <input className="rounded-lg border border-forest-900/15 px-3 py-2.5" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <input className="rounded-lg border border-forest-900/15 px-3 py-2.5" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={8} />
        <select className="rounded-lg border border-forest-900/15 px-3 py-2.5" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AdminRole })}>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
        <button className="rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-900" type="submit">
          Create
        </button>
      </form>

      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <section className="overflow-hidden rounded-lg border border-forest-900/10 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-forest-900/10 text-sm">
            <thead className="bg-forest-50 text-left text-xs uppercase tracking-[0.12em] text-forest-700">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-900/10">
              {loading ? (
                <tr><td className="px-4 py-4" colSpan={5}>Loading...</td></tr>
              ) : admins.map((admin) => (
                <tr key={admin._id}>
                  <td className="px-4 py-3 font-medium">{admin.name}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.role}</td>
                  <td className="px-4 py-3">{admin.isActive ? "Active" : "Disabled"}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={!admin.isActive || admin._id === user?._id}
                      onClick={() => handleDisable(admin._id)}
                      className="rounded-lg border border-forest-900/15 px-3 py-1.5 text-xs font-semibold text-forest-900 disabled:opacity-45"
                    >
                      Disable
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="rounded-lg border border-forest-900/10 bg-white p-6">
      <h2 className="text-xl font-semibold text-forest-900">Access denied</h2>
      <p className="mt-2 text-sm text-forest-900/65">Only super admins can manage admin accounts.</p>
    </div>
  );
}

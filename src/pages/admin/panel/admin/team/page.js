"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
// Types are omitted for plain JavaScript implementation.
import { useAppSelector } from "@/store/hooks";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export default function AdminTeamPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/team/admin', { token });
      setItems(res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id) {
    if (!id) return;
    await apiRequest(`/team/${id}`, { method: "DELETE", token });
    await load();
  }

  function clearEditing() {
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Team Members</h2>
        <p className="text-sm text-forest-900/65">Create and manage public team profiles.</p>
      </section>

      <section className="rounded-lg border bg-white p-5">
        <TeamMemberForm
          member={editing || undefined}
          onSaved={() => {
            load();
            clearEditing();
          }}
          onCancel={clearEditing}
        />
      </section>

      <section>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-3">
            // @ts-ignore: member._id may be undefined in plain JS
            // @ts-ignore: member._id may be undefined in plain JS
            {items.map((member) => (
              // @ts-ignore
              <div key={member._id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-medium">{typeof member.name === "object" ? member.name.en : member.name}</div>
                    <div className="text-xs text-forest-900/60">{typeof member.role === "object" ? member.role.en : member.role}</div>
                    <div className="mt-2 text-xs text-forest-900/70">{member.isPublished ? "Published" : "Draft"}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setEditing(member)} className="rounded-lg border px-3 py-1 text-sm">Edit</button>
                    <button onClick={() => handleDelete(member._id)} className="rounded-lg border px-3 py-1 text-sm text-red-700">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { TeamMember } from "@/types/team";

export default function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: TeamMember[] }>("/team");
        setItems(res.data || []);
      } catch (_err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold">Our Team</h1>
        <p className="text-sm text-forest-900/65">Meet the people who make conservation work possible.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-lg border bg-white p-5 shadow-sm">Loading...</div>
        ) : items.length > 0 ? (
          items.map((member) => (
            <article key={member._id} className="rounded-3xl border bg-white p-5 shadow-sm">
              {member.photo ? (
                <img src={typeof member.photo === "string" ? member.photo : member.photo.url} alt={member.name?.en || "Team member"} className="mb-4 h-44 w-full rounded-2xl object-cover" />
              ) : null}
              <h2 className="text-xl font-semibold">{member.name?.en || "Team member"}</h2>
              <p className="text-sm text-forest-900/65">{member.role?.en}</p>
              <p className="mt-3 text-sm text-forest-900/70">{member.bio?.en}</p>
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-lg border bg-white p-5 shadow-sm">No team members found.</div>
        )}
      </section>
    </div>
  );
}

"use client";
import React from "react";

import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
// Types are omitted for plain JavaScript implementation.
import { useAppSelector } from "@/store/hooks";

export default function AdminContactSubmissionsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/contact/admin', { token });
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

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Contact Submissions</h2>
        <p className="text-sm text-forest-900/65">Review messages submitted through the contact form.</p>
      </section>

      <section>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-3">
            // @ts-ignore: submission._id may be undefined in plain JS
            // @ts-ignore: submission._id may be undefined in plain JS
            {items.map((submission:any) => (
              // @ts-ignore
              <div key={submission._id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-2">
                  <div className="font-medium">{submission.name}</div>
                  <p className="text-xs text-forest-900/60">{submission.email} {submission.phone ? `• ${submission.phone}` : ""}</p>
                  <p className="mt-2 text-sm text-forest-900/75">{submission.message}</p>
                  <p className="text-xs text-forest-900/60">{submission.createdAt ? new Date(submission.createdAt).toLocaleString() : "Unknown"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

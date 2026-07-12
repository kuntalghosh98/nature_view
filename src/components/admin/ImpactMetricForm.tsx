"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { ImpactMetric } from "@/types/impact";
import { useAppSelector } from "@/store/hooks";

export function ImpactMetricForm({
  impact,
  onSaved,
  onCancel
}: {
  impact?: ImpactMetric;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const [titleEn, setTitleEn] = useState(impact?.title?.en || "");
  const [titleBn, setTitleBn] = useState(impact?.title?.bn || "");
  const [value, setValue] = useState(impact?.value || "");
  const [descriptionEn, setDescriptionEn] = useState(impact?.description?.en || "");
  const [descriptionBn, setDescriptionBn] = useState(impact?.description?.bn || "");
  const [isHighlighted, setIsHighlighted] = useState(Boolean(impact?.isHighlighted));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitleEn(impact?.title?.en || "");
    setTitleBn(impact?.title?.bn || "");
    setValue(impact?.value || "");
    setDescriptionEn(impact?.description?.en || "");
    setDescriptionBn(impact?.description?.bn || "");
    setIsHighlighted(Boolean(impact?.isHighlighted));
    setError("");
  }, [impact]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload: Record<string, unknown> = {
        title: { en: titleEn, bn: titleBn },
        value,
        description: { en: descriptionEn, bn: descriptionBn },
        isHighlighted
      };

      if (!value) {
        throw new Error("Value is required");
      }

      if (impact?._id) {
        await apiRequest(`/impact/${impact._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest("/impact", {
          method: "POST",
          token,
          body: JSON.stringify(payload)
        });
      }

      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save impact metric");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <input
          placeholder="Value"
          className="rounded-lg border px-3 py-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <input
          placeholder="Title (English)"
          className="rounded-lg border px-3 py-2"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <input
          placeholder="Title (Bangla)"
          className="rounded-lg border px-3 py-2"
          value={titleBn}
          onChange={(e) => setTitleBn(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isHighlighted} onChange={(e) => setIsHighlighted(e.target.checked)} />
          Highlighted
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          placeholder="Description (English)"
          className="min-h-[120px] rounded-lg border px-3 py-2"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
        />
        <textarea
          placeholder="Description (Bangla)"
          className="min-h-[120px] rounded-lg border px-3 py-2"
          value={descriptionBn}
          onChange={(e) => setDescriptionBn(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {onCancel ? (
            <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm text-forest-900">
              Cancel
            </button>
          ) : null}
          <button type="submit" className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white" disabled={saving}>
            {saving ? "Saving..." : impact?._id ? "Update metric" : "Create metric"}
          </button>
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </form>
  );
}

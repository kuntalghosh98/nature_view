import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

/** Simple impact metric form for admin panel */
export function ImpactMetricForm({ impact, onSaved, onCancel }) {
  const { token } = useAppSelector((state) => state.auth);

  const [titleEn, setTitleEn] = useState(impact?.title?.en || "");
  const [value, setValue] = useState(impact?.value || "");
  const [descriptionEn, setDescriptionEn] = useState(impact?.description?.en || "");
  const [isHighlighted, setIsHighlighted] = useState(Boolean(impact?.isHighlighted));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset fields when the `impact` prop changes
  useEffect(() => {
    setTitleEn(impact?.title?.en || "");
    setValue(impact?.value || "");
    setDescriptionEn(impact?.description?.en || "");
    setIsHighlighted(Boolean(impact?.isHighlighted));
    setError("");
  }, [impact]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title: { en: titleEn },
      value,
      description: { en: descriptionEn },
      isHighlighted,
    };

    try {
      if (impact && impact._id) {
        await apiRequest(`/impact/${impact._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/impact", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save impact metric");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Value and Title */}
      <div className="grid gap-3 lg-cols-2">
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

      {/* Highlight toggle */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isHighlighted}
          onChange={(e) => setIsHighlighted(e.target.checked)}
        />
        Highlighted
      </label>

      {/* Description */}
      <textarea
        placeholder="Description (English)"
        className="min-h-[120px] rounded-lg border px-3 py-2"
        value={descriptionEn}
        onChange={(e) => setDescriptionEn(e.target.value)}
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm text-forest-900">
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white"
          disabled={saving}
        >
          {saving ? "Saving..." : impact && impact._id ? "Update metric" : "Create metric"}
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}

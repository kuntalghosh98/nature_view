import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { MediaPicker } from "@/components/admin/MediaPicker";

/**
 * Simple attraction form used in the admin panel.
 * It supports creating a new attraction or editing an existing one.
 */
export function AttractionForm({ attraction, onSaved, onCancel }) {
  const { token } = useAppSelector((state) => state.auth);

  // Initialize form fields ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ fall back to empty strings for a new attraction
  const [titleEn, setTitleEn] = useState(attraction?.title?.en || "");
  const [summaryEn, setSummaryEn] = useState(attraction?.summary?.en || "");
  const [bodyEn, setBodyEn] = useState(attraction?.body?.en || "");
  const [slug, setSlug] = useState(attraction?.slug || "");
  const [isFeatured, setIsFeatured] = useState(Boolean(attraction?.isFeatured));
  const [isPublished, setIsPublished] = useState(Boolean(attraction?.isPublished));
  const [status, setStatus] = useState(attraction?.status || "demo");
  const [featuredImageId, setFeaturedImageId] = useState(
    typeof attraction?.featuredImage === "string" ? attraction.featuredImage : null
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    typeof attraction?.featuredImage === "object" && attraction?.featuredImage ? attraction.featuredImage.url : ""
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset fields when the `attraction` prop changes (e.g., editing a different item)
  useEffect(() => {
    setTitleEn(attraction?.title?.en || "");
    setSummaryEn(attraction?.summary?.en || "");
    setBodyEn(attraction?.body?.en || "");
    setSlug(attraction?.slug || "");
    setIsFeatured(Boolean(attraction?.isFeatured));
    setIsPublished(Boolean(attraction?.isPublished));
    setStatus(attraction?.status || "demo");
    setFeaturedImageId(
      typeof attraction?.featuredImage === "string" ? attraction.featuredImage : null
    );
    setFeaturedImageUrl(
      typeof attraction?.featuredImage === "object" && attraction?.featuredImage ? attraction.featuredImage.url : ""
    );
    setError("");
  }, [attraction]);

  // Compute a slug preview based on title if the user hasn't typed a custom slug
  const slugPreview = useMemo(
    () =>
      slug ||
      titleEn
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    [slug, titleEn]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title: { en: titleEn },
      summary: { en: summaryEn },
      body: { en: bodyEn },
      slug: slug || slugPreview,
      status,
      isFeatured,
      isPublished,
      featuredImage: featuredImageId,
    };

    try {
      if (attraction && attraction._id) {
        await apiRequest(`/attractions/${attraction._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/attractions", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save attraction");
    } finally {
      setSaving(false);
    }
  }

  function handleMediaSelect(item) {
    setFeaturedImageId(item._id || null);
    setFeaturedImageUrl(item.url || "");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Title */}
      <input
        placeholder="Title (English)"
        className="rounded-lg border px-3 py-2"
        value={titleEn}
        onChange={(e) => setTitleEn(e.target.value)}
        required
      />

      {/* Slug */}
      <input
        placeholder="Slug"
        className="rounded-lg border px-3 py-2"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <p className="text-xs text-forest-900/60">
        Preview: <span className="font-medium">{slugPreview}</span>
      </p>

      {/* Status */}
      <select
        className="rounded-lg border px-3 py-2"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="demo">Demo</option>
        <option value="upcoming">Upcoming</option>
        <option value="on-going">OnÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Ëœgoing</option>
        <option value="completed">Completed</option>
      </select>

      {/* Feature & Publish toggles */}
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Featured attraction
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Publish now
      </label>

      {/* Summary */}
      <textarea
        placeholder="Summary (English)"
        className="min-h-[120px] rounded-lg border px-3 py-2"
        value={summaryEn}
        onChange={(e) => setSummaryEn(e.target.value)}
      />

      {/* Body */}
      <textarea
        placeholder="Body (English)"
        className="min-h-[160px] rounded-lg border px-3 py-2"
        value={bodyEn}
        onChange={(e) => setBodyEn(e.target.value)}
      />

      {/* Featured image preview */}
      <div>
        <div className="mb-2 text-sm font-medium text-forest-900">Featured image</div>
        {featuredImageUrl ? (
          <img src={featuredImageUrl} alt="Featured" className="h-40 w-full rounded-lg object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-forest-700/30 bg-forest-50 text-sm text-forest-900/70">
            No featured image selected
          </div>
        )}
      </div>

      {/* Media picker */}
      <div className="rounded-lg border bg-white p-3">
        <div className="mb-2 text-sm font-medium text-forest-900">Choose featured media</div>
        <MediaPicker onSelect={handleMediaSelect} />
      </div>

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
          {saving ? "Saving..." : attraction && attraction._id ? "Update attraction" : "Create attraction"}
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}

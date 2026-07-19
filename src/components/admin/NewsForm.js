import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { MediaPicker } from "@/components/admin/MediaPicker";
// Using standard img tag instead of Next.js Image component for compatibility

/** Simple news form for admin panel */
export function NewsForm({ news, onSaved, onCancel }) {
  const { token } = useAppSelector((state) => state.auth);

  const [titleEn, setTitleEn] = useState(news?.title?.en || "");
  const [summaryEn, setSummaryEn] = useState(news?.summary?.en || "");
  const [bodyEn, setBodyEn] = useState(news?.body?.en || "");
  const [slug, setSlug] = useState(news?.slug || "");
  const [isFeatured, setIsFeatured] = useState(Boolean(news?.isFeatured));
  const [isPublished, setIsPublished] = useState(Boolean(news?.isPublished));
  const [featuredImageId, setFeaturedImageId] = useState(
    typeof news?.featuredImage === "string" ? news.featuredImage : null
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    typeof news?.featuredImage === "object" && news?.featuredImage ? news.featuredImage.url : ""
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset when `news` prop changes
  useEffect(() => {
    setTitleEn(news?.title?.en || "");
    setSummaryEn(news?.summary?.en || "");
    setBodyEn(news?.body?.en || "");
    setSlug(news?.slug || "");
    setIsFeatured(Boolean(news?.isFeatured));
    setIsPublished(Boolean(news?.isPublished));
    setFeaturedImageId(
      typeof news?.featuredImage === "string" ? news.featuredImage : null
    );
    setFeaturedImageUrl(
      typeof news?.featuredImage === "object" && news?.featuredImage ? news.featuredImage.url : ""
    );
    setError("");
  }, [news]);

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
      isFeatured,
      isPublished,
      featuredImage: featuredImageId,
    };

    try {
      if (news && news._id) {
        await apiRequest(`/news/${news._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/news", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save news");
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
      <div>
        <input
          placeholder="Slug"
          className="rounded-lg border px-3 py-2 w-full"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <p className="mt-1 text-xs text-forest-900/60">
          Preview: <span className="font-medium">{slugPreview}</span>
        </p>
      </div>

      {/* Feature & Publish */}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Featured news
      </label>
      <label className="flex items-center gap-2 text-sm">
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
          {saving ? "Saving..." : news && news._id ? "Update news" : "Create news"}
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}

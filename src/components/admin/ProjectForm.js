
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { MediaPicker } from "@/components/admin/MediaPicker";

/**
 * Simple form for creating or updating a project.
 * All TypeScript specific syntax has been removed to keep the file valid JavaScript.
 */
export function ProjectForm({ project, onSaved, onCancel }) {
  const { token } = useAppSelector((state) => state.auth);

  const [titleEn, setTitleEn] = useState(project?.title?.en || "");
  const [summaryEn, setSummaryEn] = useState(project?.summary?.en || "");
  const [bodyEn, setBodyEn] = useState(project?.body?.en || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [featuredImageId, setFeaturedImageId] = useState(
    typeof project?.featuredImage === "string" ? project.featuredImage : null
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    typeof project?.featuredImage === "object" && project?.featuredImage ? project.featuredImage.url : ""
  );
  const [isPublished, setIsPublished] = useState(Boolean(project?.isPublished));
  const [status, setStatus] = useState(project?.status || "demo");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync form state when the `project` prop changes
  useEffect(() => {
    setTitleEn(project?.title?.en || "");
    setSummaryEn(project?.summary?.en || "");
    setBodyEn(project?.body?.en || "");
    setSlug(project?.slug || "");
    setFeaturedImageId(typeof project?.featuredImage === "string" ? project.featuredImage : null);
    setFeaturedImageUrl(
      typeof project?.featuredImage === "object" && project?.featuredImage ? project.featuredImage.url : ""
    );
    setIsPublished(Boolean(project?.isPublished));
    setStatus(project?.status || "demo");
    setError("");
  }, [project]);

  const slugPreview = useMemo(
    () => slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    [slug, titleEn]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        title: { en: titleEn },
        summary: { en: summaryEn },
        body: { en: bodyEn },
        slug: slug || slugPreview,
        status,
        isPublished,
        featuredImage: featuredImageId,
      };

      if (!titleEn) {
        throw new Error("Title is required");
      }

      if (project && project._id) {
        await apiRequest(`/projects/${project._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/projects", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      }

      if (onSaved) onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function handleMediaSelect(item) {
    setFeaturedImageId(item._id || null);
    setFeaturedImageUrl(item.url);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Title */}
      <div className="grid gap-3 lg-cols-2">
        <input
          placeholder="Title (English)"
          className="rounded-lg border px-3 py-2"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          required
        />
      </div>

      {/* Slug and status */}
      <div className="grid gap-3 lg-cols-2">
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
        <div>
          <select
            className="rounded-lg border px-3 py-2 w-full bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="demo">Demo</option>
            <option value="upcoming">Upcoming</option>
            <option value="on-going">On-going</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm pb-2">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Publish now
        </label>
      </div>

      {/* Summary */}
      <div className="grid gap-3 lg-cols-2">
        <textarea
          placeholder="Summary (English)"
          className="min-h-[120px] rounded-lg border px-3 py-2"
          value={summaryEn}
          onChange={(e) => setSummaryEn(e.target.value)}
        />
      </div>

      {/* Body */}
      <div className="grid gap-3 lg-cols-2">
        <textarea
          placeholder="Body (English)"
          className="min-h-[160px] rounded-lg border px-3 py-2"
          value={bodyEn}
          onChange={(e) => setBodyEn(e.target.value)}
        />
      </div>

      {/* Featured image preview */}
      <div className="grid gap-3">
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
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm text-forest-900">
            Cancel
          </button>
        )}
        <button type="submit" className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white" disabled={saving}>
          {saving ? "Saving..." : project && project._id ? "Update project" : "Create project"}
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}


import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { MediaPicker } from "@/components/admin/MediaPicker";

/** Simple event form for admin panel */
export function EventForm({ event, onSaved, onCancel }) {
  const { token } = useAppSelector((state) => state.auth);

  const [titleEn, setTitleEn] = useState(event?.title?.en || "");
  const [summaryEn, setSummaryEn] = useState(event?.summary?.en || "");
  const [bodyEn, setBodyEn] = useState(event?.body?.en || "");
  const [slug, setSlug] = useState(event?.slug || "");
  const [location, setLocation] = useState(event?.location || "");
  const [startDate, setStartDate] = useState(event?.startDate || "");
  const [endDate, setEndDate] = useState(event?.endDate || "");
  const [registrationUrl, setRegistrationUrl] = useState(event?.registrationUrl || "");
  const [isFeatured, setIsFeatured] = useState(Boolean(event?.isFeatured));
  const [isPublished, setIsPublished] = useState(Boolean(event?.isPublished));
  const [status, setStatus] = useState(event?.status || "demo");
  const [featuredImageId, setFeaturedImageId] = useState(
    typeof event?.featuredImage === "string" ? event.featuredImage : null
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    typeof event?.featuredImage === "object" && event?.featuredImage ? event.featuredImage.url : ""
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Reset when `event` prop changes
  useEffect(() => {
    setTitleEn(event?.title?.en || "");
    setSummaryEn(event?.summary?.en || "");
    setBodyEn(event?.body?.en || "");
    setSlug(event?.slug || "");
    setLocation(event?.location || "");
    setStartDate(event?.startDate || "");
    setEndDate(event?.endDate || "");
    setRegistrationUrl(event?.registrationUrl || "");
    setIsFeatured(Boolean(event?.isFeatured));
    setIsPublished(Boolean(event?.isPublished));
    setStatus(event?.status || "demo");
    setFeaturedImageId(
      typeof event?.featuredImage === "string" ? event.featuredImage : null
    );
    setFeaturedImageUrl(
      typeof event?.featuredImage === "object" && event?.featuredImage ? event.featuredImage.url : ""
    );
    setError("");
  }, [event]);

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
      location,
      startDate: startDate || null,
      endDate: endDate || null,
      registrationUrl,
      status,
      isFeatured,
      isPublished,
      featuredImage: featuredImageId,
    };

    try {
      if (event && event._id) {
        await apiRequest(`/events/${event._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/events", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
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

      {/* Feature & Publish */}
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Featured event
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

      {/* Location */}
      <input
        placeholder="Location"
        className="rounded-lg border px-3 py-2"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* Dates */}
      <input
        type="datetime-local"
        className="rounded-lg border px-3 py-2"
        value={startDate || ""}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="datetime-local"
        className="rounded-lg border px-3 py-2"
        value={endDate || ""}
        onChange={(e) => setEndDate(e.target.value)}
      />

      {/* Registration URL */}
      <input
        placeholder="Registration URL"
        className="rounded-lg border px-3 py-2"
        value={registrationUrl}
        onChange={(e) => setRegistrationUrl(e.target.value)}
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
          {saving ? "Saving..." : event && event._id ? "Update event" : "Create event"}
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </form>
  );
}

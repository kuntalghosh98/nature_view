"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { EventItem } from "@/types/event";
import type { MediaItem } from "@/types/media";
import { useAppSelector } from "@/store/hooks";
import { MediaPicker } from "@/components/admin/MediaPicker";

export function EventForm({
  event,
  onSaved,
  onCancel
}: {
  event?: EventItem;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const [titleEn, setTitleEn] = useState(event?.title?.en || "");
  const [titleBn, setTitleBn] = useState(event?.title?.bn || "");
  const [summaryEn, setSummaryEn] = useState(event?.summary?.en || "");
  const [summaryBn, setSummaryBn] = useState(event?.summary?.bn || "");
  const [bodyEn, setBodyEn] = useState(event?.body?.en || "");
  const [bodyBn, setBodyBn] = useState(event?.body?.bn || "");
  const [slug, setSlug] = useState(event?.slug || "");
  const [location, setLocation] = useState(event?.location || "");
  const [startDate, setStartDate] = useState(event?.startDate || "");
  const [endDate, setEndDate] = useState(event?.endDate || "");
  const [registrationUrl, setRegistrationUrl] = useState(event?.registrationUrl || "");
  const [isFeatured, setIsFeatured] = useState(Boolean(event?.isFeatured));
  const [isPublished, setIsPublished] = useState(Boolean(event?.isPublished));
  const [featuredImageId, setFeaturedImageId] = useState<string | null>(
    typeof event?.featuredImage === "string" ? event.featuredImage : event?.featuredImage?._id || null
  );
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(
    typeof event?.featuredImage === "object" && event?.featuredImage ? event.featuredImage.url : null
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitleEn(event?.title?.en || "");
    setTitleBn(event?.title?.bn || "");
    setSummaryEn(event?.summary?.en || "");
    setSummaryBn(event?.summary?.bn || "");
    setBodyEn(event?.body?.en || "");
    setBodyBn(event?.body?.bn || "");
    setSlug(event?.slug || "");
    setLocation(event?.location || "");
    setStartDate(event?.startDate || "");
    setEndDate(event?.endDate || "");
    setRegistrationUrl(event?.registrationUrl || "");
    setIsFeatured(Boolean(event?.isFeatured));
    setIsPublished(Boolean(event?.isPublished));
    setFeaturedImageId(typeof event?.featuredImage === "string" ? event.featuredImage : event?.featuredImage?._id || null);
    setFeaturedImageUrl(typeof event?.featuredImage === "object" && event?.featuredImage ? event.featuredImage.url : null);
    setError("");
  }, [event]);

  const slugPreview = useMemo(
    () => slug || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    [slug, titleEn]
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload: any = {
        title: { en: titleEn, bn: titleBn },
        summary: { en: summaryEn, bn: summaryBn },
        body: { en: bodyEn, bn: bodyBn },
        slug: slug || slugPreview,
        location,
        startDate: startDate || null,
        endDate: endDate || null,
        registrationUrl,
        isFeatured,
        isPublished,
        featuredImage: featuredImageId
      };

      if (!payload.title.en) {
        throw new Error("English title is required");
      }

      if (event?._id) {
        await apiRequest(`/events/${event._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest("/events", {
          method: "POST",
          token,
          body: JSON.stringify(payload)
        });
      }

      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setSaving(false);
    }
  }

  function handleMediaSelect(item: MediaItem) {
    setFeaturedImageId(item._id || null);
    setFeaturedImageUrl(item.url);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <input
          placeholder="Title (English)"
          className="rounded-lg border px-3 py-2"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          required
        />
        <input
          placeholder="Title (Bangla)"
          className="rounded-lg border px-3 py-2"
          value={titleBn}
          onChange={(e) => setTitleBn(e.target.value)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
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
        <div className="grid gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured event
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Publish now
          </label>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          placeholder="Summary (English)"
          className="min-h-[120px] rounded-lg border px-3 py-2"
          value={summaryEn}
          onChange={(e) => setSummaryEn(e.target.value)}
        />
        <textarea
          placeholder="Summary (Bangla)"
          className="min-h-[120px] rounded-lg border px-3 py-2"
          value={summaryBn}
          onChange={(e) => setSummaryBn(e.target.value)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          placeholder="Body (English)"
          className="min-h-[160px] rounded-lg border px-3 py-2"
          value={bodyEn}
          onChange={(e) => setBodyEn(e.target.value)}
        />
        <textarea
          placeholder="Body (Bangla)"
          className="min-h-[160px] rounded-lg border px-3 py-2"
          value={bodyBn}
          onChange={(e) => setBodyBn(e.target.value)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <input
          placeholder="Location"
          className="rounded-lg border px-3 py-2 w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <div className="grid gap-3 lg:grid-cols-2">
          <input
            type="datetime-local"
            className="rounded-lg border px-3 py-2 w-full"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="datetime-local"
            className="rounded-lg border px-3 py-2 w-full"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <input
        placeholder="Registration URL"
        className="rounded-lg border px-3 py-2 w-full"
        value={registrationUrl}
        onChange={(e) => setRegistrationUrl(e.target.value)}
      />

      <div className="grid gap-4 lg:grid-cols-2">
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

        <div className="rounded-lg border bg-white p-3">
          <div className="mb-2 text-sm font-medium text-forest-900">Choose featured media</div>
          <MediaPicker onSelect={handleMediaSelect} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {onCancel ? (
            <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm text-forest-900">
              Cancel
            </button>
          ) : null}
          <button type="submit" className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white" disabled={saving}>
            {saving ? "Saving..." : event?._id ? "Update event" : "Create event"}
          </button>
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </form>
  );
}

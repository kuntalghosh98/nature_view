"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { TeamMember } from "@/types/team";
import type { MediaItem } from "@/types/media";
import { useAppSelector } from "@/store/hooks";
import { MediaPicker } from "@/components/admin/MediaPicker";

export function TeamMemberForm({
  member,
  onSaved,
  onCancel
}: {
  member?: TeamMember;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const { token } = useAppSelector((state) => state.auth);
  const [nameEn, setNameEn] = useState(member?.name?.en || "");
  const [nameBn, setNameBn] = useState(member?.name?.bn || "");
  const [roleEn, setRoleEn] = useState(member?.role?.en || "");
  const [roleBn, setRoleBn] = useState(member?.role?.bn || "");
  const [bioEn, setBioEn] = useState(member?.bio?.en || "");
  const [bioBn, setBioBn] = useState(member?.bio?.bn || "");
  const [photoId, setPhotoId] = useState<string | null>(typeof member?.photo === "string" ? member.photo : member?.photo?._id || null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(typeof member?.photo === "object" && member?.photo ? member.photo.url : null);
  const [isPublished, setIsPublished] = useState(Boolean(member?.isPublished));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNameEn(member?.name?.en || "");
    setNameBn(member?.name?.bn || "");
    setRoleEn(member?.role?.en || "");
    setRoleBn(member?.role?.bn || "");
    setBioEn(member?.bio?.en || "");
    setBioBn(member?.bio?.bn || "");
    setPhotoId(typeof member?.photo === "string" ? member.photo : member?.photo?._id || null);
    setPhotoUrl(typeof member?.photo === "object" && member?.photo ? member.photo.url : null);
    setIsPublished(Boolean(member?.isPublished));
    setError("");
  }, [member]);

  const namePreview = useMemo(() => nameEn || "Team member", [nameEn]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload: any = {
        name: { en: nameEn, bn: nameBn },
        role: { en: roleEn, bn: roleBn },
        bio: { en: bioEn, bn: bioBn },
        photo: photoId,
        isPublished
      };

      if (!payload.name.en) {
        throw new Error("English name is required");
      }

      if (member?._id) {
        await apiRequest(`/team/${member._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest("/team", {
          method: "POST",
          token,
          body: JSON.stringify(payload)
        });
      }

      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team member");
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoSelect(item: MediaItem) {
    setPhotoId(item._id || null);
    setPhotoUrl(item.url);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <input
          placeholder="Name (English)"
          className="rounded-lg border px-3 py-2"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          required
        />
        <input
          placeholder="Name (Bangla)"
          className="rounded-lg border px-3 py-2"
          value={nameBn}
          onChange={(e) => setNameBn(e.target.value)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <input
          placeholder="Role (English)"
          className="rounded-lg border px-3 py-2"
          value={roleEn}
          onChange={(e) => setRoleEn(e.target.value)}
          required
        />
        <input
          placeholder="Role (Bangla)"
          className="rounded-lg border px-3 py-2"
          value={roleBn}
          onChange={(e) => setRoleBn(e.target.value)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <textarea
          placeholder="Bio (English)"
          className="min-h-[120px] rounded-lg border px-3 py-2"
          value={bioEn}
          onChange={(e) => setBioEn(e.target.value)}
        />
        <textarea
          placeholder="Bio (Bangla)"
          className="min-h-[120px] rounded-lg border px-3 py-2"
          value={bioBn}
          onChange={(e) => setBioBn(e.target.value)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <div className="mb-2 text-sm font-medium text-forest-900">Photo</div>
          {photoUrl ? (
            <img src={photoUrl} alt={namePreview} className="h-40 w-full rounded-lg object-cover" />
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-forest-700/30 bg-forest-50 text-sm text-forest-900/70">
              No photo selected
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-white p-3">
          <div className="mb-2 text-sm font-medium text-forest-900">Choose photo</div>
          <MediaPicker onSelect={handlePhotoSelect} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Publish member
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {onCancel ? (
            <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm text-forest-900">
              Cancel
            </button>
          ) : null}
          <button type="submit" className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white" disabled={saving}>
            {saving ? "Saving..." : member?._id ? "Update member" : "Create member"}
          </button>
        </div>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </form>
  );
}

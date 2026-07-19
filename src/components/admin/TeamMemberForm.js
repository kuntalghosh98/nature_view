
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { MediaPicker } from "@/components/admin/MediaPicker";

/** Simple team member form ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ all TypeScript syntax removed. */
export function TeamMemberForm({ member, onSaved, onCancel }) {
  const { token } = useAppSelector((state) => state.auth);

  const [nameEn, setNameEn] = useState(member?.name?.en || member?.name || "");
  const [roleEn, setRoleEn] = useState(member?.role?.en || member?.role || "");
  const [bioEn, setBioEn] = useState(member?.bio?.en || member?.bio || "");
  const [photoId, setPhotoId] = useState(
    typeof member?.photo === "string" ? member.photo : member?.photo?.id || null
  );
  const [photoUrl, setPhotoUrl] = useState(
    typeof member?.photo === "object" && member?.photo ? member.photo.url : ""
  );
  const [isPublished, setIsPublished] = useState(Boolean(member?.isPublished));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync when `member` prop changes
  useEffect(() => {
    setNameEn(member?.name?.en || member?.name || "");
    setRoleEn(member?.role?.en || member?.role || "");
    setBioEn(member?.bio?.en || member?.bio || "");
    setPhotoId(typeof member?.photo === "string" ? member.photo : member?.photo?.id || null);
    setPhotoUrl(typeof member?.photo === "object" && member?.photo ? member.photo.url : "");
    setIsPublished(Boolean(member?.isPublished));
    setError("");
  }, [member]);

  const namePreview = useMemo(() => nameEn || "Team member", [nameEn]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: nameEn,
        role: roleEn,
        bio: bioEn,
        photo: photoId,
        isPublished,
      };

      if (!payload.name.trim()) {
        throw new Error("English name is required");
      }

      if (member && member._id) {
        await apiRequest(`/team/${member._id}`, {
          method: "PATCH",
          token,
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/team", {
          method: "POST",
          token,
          body: JSON.stringify(payload),
        });
      }

      if (onSaved) onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team member");
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoSelect(item) {
    setPhotoId(item._id || null);
    setPhotoUrl(item.url);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Name */}
      <div className="grid gap-3 lg-cols-2">
        <input
          placeholder="Name (English)"
          className="rounded-lg border px-3 py-2"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          required
        />
      </div>

      {/* Role */}
      <div className="grid gap-3 lg-cols-2">
        <input
          placeholder="Role (English)"
          className="rounded-lg border px-3 py-2"
          value={roleEn}
          onChange={(e) => setRoleEn(e.target.value)}
          required
        />
      </div>

      {/* Bio */}
      <div className="grid gap-3 lg-cols-2">
        <textarea
          placeholder="Bio (English)"
          className="min-h-[120px] rounded-lg border px-3 py-2"
          value={bioEn}
          onChange={(e) => setBioEn(e.target.value)}
        />
      </div>

      {/* Photo preview */}
      <div className="grid gap-3">
        <div>
          <div className="mb-2 text-sm font-medium text-forest-900">Photo</div>
          {photoUrl ? (
            <img src={photoUrl} alt="Photo" className="h-40 w-full rounded-lg object-cover" />
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

      {/* Publish toggle */}
      <label className="flex items-center gap-2 text-sm pb-2">
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Publish now
      </label>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm text-forest-900">
            Cancel
          </button>
        )}
        <button type="submit" className="rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white" disabled={saving}>
          {saving ? "Saving..." : member && member._id ? "Update member" : "Create member"}
        </button>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
        </form>
      );
    }


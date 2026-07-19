
import { FormEvent, useRef, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/lib/cloudinary";

export function MediaUploader({ onUploaded }: { onUploaded?: () => void }) {
  const { token } = useAppSelector((state) => state.auth);
  const [filename, setFilename] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  async function handleUrlSubmit(e) {
    e.preventDefault();
    setError("");
    if (!token) return setError("Not authenticated");
    setSubmitting(true);
    try {
      await apiRequest("/media", {
        method: "POST",
        token,
        body.stringify({ filename, url })
      });
      setFilename("");
      setUrl("");
      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    setError("");
    if (!token) return setError("Not authenticated");
    const file = fileRef.current?.files?.[0];
    if (!file) return setError("Select a file to upload");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch((import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api") + "/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Upload failed");

      fileRef.current!.value = "";
      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCloudinaryUpload(e) {
    e.preventDefault();
    setError("");
    const file = fileRef.current?.files?.[0];
    if (!file) return setError("Select a file to upload");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      fd.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST",
        body
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");

      // Save the Cloudinary URL to our backend
      await apiRequest("/media", {
        method: "POST",
        token,
        body.stringify({
          filename.original_filename || file.name,
          url.secure_url,
          public_id.public_id,
          format.format,
          width.width,
          height.height,
          bytes.bytes
        })
      });

      fileRef.current!.value = "";
      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cloudinary upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4">
        <h4 className="mb-3 font-medium text-forest-900">Upload File</h4>
        <form onSubmit={handleFileUpload} className="grid gap-3 md-cols-3">
          <input ref={fileRef} type="file" accept="image/*,video/*" className="rounded-lg border px-3 py-2" />
          <div>
            <button type="submit" disabled={submitting} className="rounded-lg bg-forest-700 px-4 py-2 text-white">
              {submitting ? "Uploading..." : "Upload via Backend"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h4 className="mb-3 font-medium text-forest-900">Direct Cloudinary Upload</h4>
        <p className="mb-3 text-sm text-forest-900/65">Upload directly to Cloudinary CDN (faster, no backend bandwidth)</p>
        <form onSubmit={handleCloudinaryUpload} className="grid gap-3 md-cols-3">
          <input ref={fileRef} type="file" accept="image/*,video/*" className="rounded-lg border px-3 py-2" />
          <div>
            <button type="submit" disabled={submitting} className="rounded-lg bg-accent-600 px-4 py-2 text-white">
              {submitting ? "Uploading..." : "Upload to Cloudinary"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h4 className="mb-3 font-medium text-forest-900">Upload by Remote URL</h4>
        <p className="mb-3 text-sm text-forest-900/65">Add an image/video by providing a remote URL</p>
        <form onSubmit={handleUrlSubmit} className="grid gap-3 md-cols-3">
          <input placeholder="Filename" className="rounded-lg border px-3 py-2" value={filename} onChange={(e) => setFilename(e.target.value)} />
          <input placeholder="Remote URL (https://...)" className="rounded-lg border px-3 py-2" value={url} onChange={(e) => setUrl(e.target.value)} />
          <div>
            <button type="submit" disabled={submitting} className="rounded-lg bg-forest-700 px-4 py-2 text-white">
              {submitting ? "Uploading..." : "Add by URL"}
            </button>
          </div>
        </form>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> }
    </div>
  );
}


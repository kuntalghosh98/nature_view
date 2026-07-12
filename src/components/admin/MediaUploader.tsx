"use client";

import { FormEvent, useRef, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";

export function MediaUploader({ onUploaded }: { onUploaded?: () => void }) {
  const { token } = useAppSelector((state) => state.auth);
  const [filename, setFilename] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleUrlSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!token) return setError("Not authenticated");
    setSubmitting(true);
    try {
      await apiRequest("/media", {
        method: "POST",
        token,
        body: JSON.stringify({ filename, url })
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

  async function handleFileUpload(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!token) return setError("Not authenticated");
    const file = fileRef.current?.files?.[0];
    if (!file) return setError("Select a file to upload");

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch((process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api") + "/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: fd
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

  return (
    <div className="space-y-3">
      <form onSubmit={handleFileUpload} className="grid gap-3 md:grid-cols-3">
        <input ref={fileRef} type="file" accept="image/*,video/*" className="rounded-lg border px-3 py-2" />
        <div>
          <button type="submit" disabled={submitting} className="rounded-lg bg-forest-700 px-4 py-2 text-white">
            {submitting ? "Uploading..." : "Upload file"}
          </button>
        </div>
      </form>

      <div className="pt-4">
        <p className="text-sm text-forest-900/65">Or upload by remote URL</p>
        <form onSubmit={handleUrlSubmit} className="mt-3 grid gap-3 md:grid-cols-3">
          <input placeholder="Filename" className="rounded-lg border px-3 py-2" value={filename} onChange={(e) => setFilename(e.target.value)} />
          <input placeholder="Remote URL (https://...)" className="rounded-lg border px-3 py-2" value={url} onChange={(e) => setUrl(e.target.value)} />
          <div>
            <button type="submit" disabled={submitting} className="rounded-lg bg-forest-700 px-4 py-2 text-white">
              {submitting ? "Uploading..." : "Add by URL"}
            </button>
          </div>
        </form>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

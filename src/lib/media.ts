type MediaObject = {
  url?: string | null;
  secure_url?: string | null;
};

export function resolveMediaUrl(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (typeof value === "object" && value !== null) {
    const media = value as MediaObject;
    const url = media.url?.trim();
    if (url) return url;

    const secureUrl = media.secure_url?.trim();
    if (secureUrl) return secureUrl;
  }

  return fallback;
}

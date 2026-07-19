  /**
   * Resolve a media URL from various possible formats.
   *
   * The backend may return:
   *   • a plain string URL
   *   • an object with a `secure_url` field (Cloudinary format)
   *   • an object with a `url` field
   *   • an object with a `public_id` field – in this case we construct a Cloudinary URL.
   *   • an object with an `_id` field (ignored for URL resolution)
   *
   * @param {*} media – The media value (string, object, null/undefined).
   * @param {string} [fallback] – Optional URL to use when `media` is missing or cannot be resolved.
   * @returns {string} – Resolved URL, the fallback, or an empty string.
   */
  export function resolveMediaUrl(media, fallback) {
    // No media provided – return fallback or empty string.
    if (!media) return fallback ?? "";

    // Plain string URL – trim whitespace and return, falling back if empty.
    if (typeof media === "string") {
      const trimmed = media.trim();
      // If the trimmed string is non‑empty return it, otherwise fall back.
      return trimmed || (fallback ?? "");
    }

    // Object representation – check known fields.
    if (typeof media === "object") {
      if ("secure_url" in media && media.secure_url) {
        return media.secure_url;
      }
      if ("url" in media && media.url) {
        return media.url;
      }
      if ("public_id" in media && media.public_id) {
        return `https://res.cloudinary.com/dkhhjhpbc/image/upload/${media.public_id}`;
      }
    }

    // Fallback if none of the above matched.
    return fallback ?? "";
  }


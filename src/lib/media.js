  /**
   * Resolve a media URL from various possible formats.
   *
   * The backend may return:
   *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ a plain string URL
   *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ an object with a `secure_url` field (Cloudinary format)
   *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ an object with a `url` field
   *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ an object with a `public_id` field ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ in this case we construct a Cloudinary URL.
   *   ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ an object with an `_id` field (ignored for URL resolution)
   *
   * @param {*} media ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ The media value (string, object, null/undefined).
   * @param {string} [fallback] ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Optional URL to use when `media` is missing or cannot be resolved.
   * @returns {string} ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ Resolved URL, the fallback, or an empty string.
   */
  export function resolveMediaUrl(media, fallback) {
    // No media provided ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ return fallback or empty string.
    if (!media) return fallback ?? "";

    // Plain string URL ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ trim whitespace and return, falling back if empty.
    if (typeof media === "string") {
      const trimmed = media.trim();
      // If the trimmed string is nonÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Ëœempty return it, otherwise fall back.
      return trimmed || (fallback ?? "");
    }

    // Object representation ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ check known fields.
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

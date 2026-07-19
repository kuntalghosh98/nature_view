import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class name strings intelligently.
 * Uses `clsx` to handle falsy values and `twMerge` to merge Tailwind classes.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Convert internal locale identifiers to BCP‑47 language tags. */
export function appLocaleToBcp47(locale) {
  return locale === "bn" ? "bn-BD" : "en-US";
}

/**
 * Format a date/value according to the given locale.
 * @param {number|Date|string} value - Date value or timestamp.
 * @param {string} [locale] - Locale identifier (e.g., "en" or "bn").
 * @param {Intl.DateTimeFormatOptions} [options] - Formatting options.
 */
export function formatLocalizedDate(value, locale, options) {
  return new Intl.DateTimeFormat(appLocaleToBcp47(locale), options).format(new Date(value));
}

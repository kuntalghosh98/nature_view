
/* eslint-disable no-unused-vars, unicode-bom, jsx-a11y/anchor-is-valid */
/**
 * Returns the localized string for the current locale, falling back to English,
 * then Bengali, then an empty string.
 */
// Returns the appropriate localized string based on the provided value and locale.
// `value` can be a plain string or an object containing language keys (e.g., { en: "...", bn: "..." }).
// `locale` is an optional locale code (e.g., "en" or "bn").
export function getLocalizedText(value, locale) {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (locale === "bn" && value.bn) return value.bn;
  if (value.en) return value.en;
  if (value.bn) return value.bn;
  return "";
}

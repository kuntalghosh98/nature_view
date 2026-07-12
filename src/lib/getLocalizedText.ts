import type { Localized } from "@/types/attraction";

/**
 * Returns the localized string for the current locale, falling back to English,
 * then Bengali, then an empty string.
 */
export function getLocalizedText(
  value: Localized | string | undefined | null,
  locale?: string
): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (locale === "bn" && value.bn) return value.bn;
  if (value.en) return value.en;
  if (value.bn) return value.bn;
  return "";
}
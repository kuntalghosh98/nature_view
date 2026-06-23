import { Locale } from "@/providers/LocaleProvider";

type LocalizedValue = {
  en?: string;
  bn?: string;
};

export function getLocalizedText(
  value: LocalizedValue | undefined,
  locale: Locale
) {
  return value?.[locale] || value?.en || "";
}
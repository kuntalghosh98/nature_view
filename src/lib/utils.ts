import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function appLocaleToBcp47(locale?: string): string {
  return locale === "bn" ? "bn-BD" : "en-US";
}

export function formatLocalizedDate(
  value: string | number | Date,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(appLocaleToBcp47(locale), options).format(new Date(value));
}
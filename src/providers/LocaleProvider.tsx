"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

type Locale = "en" | "bn";

// Simple translation map — extend as needed
const translations: Record<string, Record<Locale, string>> = {
  "header.tagline": { en: "Preserving Nature, Empowering Communities", bn: "প্রকৃতি সংরক্ষণ, সম্প্রদায়ের ক্ষমতায়ন" },
  "header.home": { en: "Home", bn: "হোম" },
  "header.attractions": { en: "Attractions", bn: "আকর্ষণ" },
  "header.events": { en: "Events", bn: "ইভেন্ট" },
  "header.news": { en: "News", bn: "সংবাদ" },
  "header.projects": { en: "Projects", bn: "প্রকল্প" },
  "header.impact": { en: "Impact", bn: "প্রভাব" },
  "header.team": { en: "Team", bn: "টিম" },
  "header.contact": { en: "Contact", bn: "যোগাযোগ" },
  "header.search": { en: "Search", bn: "অনুসন্ধান" },
  "common.loading": { en: "Loading...", bn: "লোড হচ্ছে..." },
  "common.searchHint": { en: "Try adjusting your search terms", bn: "আপনার অনুসন্ধান শব্দ পরিবর্তন করে দেখুন" },
  "common.checkBackSoon": { en: "Check back soon for updates", bn: "আপডেটের জন্য শীঘ্রই আবার দেখুন" },
  "common.clearSearch": { en: "Clear Search", bn: "অনুসন্ধান মুছুন" },
  "common.readMore": { en: "Read More", bn: "আরও পড়ুন" },
  "common.viewAll": { en: "View All", bn: "সব দেখুন" },
  "common.backToList": { en: "Back to List", bn: "তালিকায় ফিরুন" },
  "common.noResults": { en: "No results found", bn: "কোনো ফলাফল পাওয়া যায়নি" },
  "pages.home.title": { en: "Nature View", bn: "নেচার ভিউ" },
  "pages.home.subtitle": { en: "Discover the beauty of nature and our conservation efforts", bn: "প্রকৃতির সৌন্দর্য এবং আমাদের সংরক্ষণ প্রচেষ্টা আবিষ্কার করুন" },
  "pages.attractions.title": { en: "Attractions", bn: "আকর্ষণ" },
  "pages.attractions.subtitle": { en: "Explore natural wonders and scenic destinations", bn: "প্রাকৃতিক বিস্ময় এবং মনোরম গন্তব্যস্থল অন্বেষণ করুন" },
  "pages.attractions.noAttractions": { en: "No attractions found", bn: "কোনো আকর্ষণ পাওয়া যায়নি" },
  "pages.attractions.searchPlaceholder": { en: "Search attractions...", bn: "আকর্ষণ অনুসন্ধান করুন..." },
  "pages.attractions.stats.featured": { en: "Featured", bn: "বিশেষ" },
  "pages.attractions.stats.total": { en: "Total", bn: "মোট" },
  "pages.attractions.stats.categories": { en: "Categories", bn: "বিভাগ" },
  "pages.events.title": { en: "Events", bn: "ইভেন্ট" },
  "pages.events.subtitle": { en: "Join our conservation events and activities", bn: "আমাদের সংরক্ষণ ইভেন্ট এবং কার্যক্রমে যোগ দিন" },
  "pages.events.noEvents": { en: "No events found", bn: "কোনো ইভেন্ট পাওয়া যায়নি" },
  "pages.events.searchPlaceholder": { en: "Search events...", bn: "ইভেন্ট অনুসন্ধান করুন..." },
  "pages.events.stats.upcoming": { en: "Upcoming", bn: "আসন্ন" },
  "pages.events.stats.total": { en: "Total", bn: "মোট" },
  "pages.news.title": { en: "News", bn: "সংবাদ" },
  "pages.news.subtitle": { en: "Latest updates on conservation and community", bn: "সংরক্ষণ এবং সম্প্রদায়ের সর্বশেষ আপডেট" },
  "pages.news.noNews": { en: "No news articles found", bn: "কোনো সংবাদ নিবন্ধ পাওয়া যায়নি" },
  "pages.news.searchPlaceholder": { en: "Search news...", bn: "সংবাদ অনুসন্ধান করুন..." },
  "pages.news.stats.featured": { en: "Featured", bn: "বিশেষ" },
  "pages.news.stats.total": { en: "Total", bn: "মোট" },
  "pages.projects.title": { en: "Projects", bn: "প্রকল্প" },
  "pages.projects.subtitle": { en: "Our conservation and community initiatives", bn: "আমাদের সংরক্ষণ এবং সম্প্রদায় উদ্যোগ" },
  "pages.projects.noProjects": { en: "No projects found", bn: "কোনো প্রকল্প পাওয়া যায়নি" },
  "pages.projects.searchPlaceholder": { en: "Search projects...", bn: "প্রকল্প অনুসন্ধান করুন..." },
  "pages.projects.stats.active": { en: "Active", bn: "সক্রিয়" },
  "pages.projects.stats.total": { en: "Total", bn: "মোট" },
  "pages.impact.title": { en: "Impact", bn: "প্রভাব" },
  "pages.impact.subtitle": { en: "Measuring our conservation outcomes", bn: "আমাদের সংরক্ষণ ফলাফল পরিমাপ" },
  "pages.team.title": { en: "Our Team", bn: "আমাদের টিম" },
  "pages.team.subtitle": { en: "Meet the people behind Nature View", bn: "নেচার ভিউ-এর পেছনের মানুষদের সাথে পরিচিত হোন" },
  "pages.contact.title": { en: "Contact Us", bn: "যোগাযোগ" },
  "pages.contact.subtitle": { en: "Get in touch with our team", bn: "আমাদের টিমের সাথে যোগাযোগ করুন" },
  "pages.search.title": { en: "Search", bn: "অনুসন্ধান" },
  "pages.search.subtitle": { en: "Find attractions, events, news, and more", bn: "আকর্ষণ, ইভেন্ট, সংবাদ এবং আরও খুঁজুন" },
  "pages.search.placeholder": { en: "Search across the site...", bn: "পুরো সাইটে অনুসন্ধান করুন..." },
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[locale] || entry.en || key;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
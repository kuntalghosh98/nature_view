
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Search,
  Star,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { getLocalizedText } from "@/lib/getLocalizedText";
import ItemCard from "@/components/ItemCard";
import { useLocale } from "@/providers/LocaleProvider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEvents } from "@/store/slices/eventsSlice";
// Duplicate import removed
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonGrid";
import { appLocaleToBcp47 } from "@/lib/utils";

const fallbackEventImage =
  "https://res.cloudinary.com/dkhhjhpbc/image/upload/v1783278022/nature_view/home/tn7v79buqhisnzttngkx.jpg";


const filters = [
  { key: "all", labelKey: "pages.events.filters.all", icon: <SlidersHorizontal className="w-4 h-4" /> },
  { key: "upcoming", labelKey: "pages.events.filters.upcoming", icon: <Sparkles className="w-4 h-4" /> },
  { key: "on-going", labelKey: "pages.events.filters.ongoing", icon: <Clock className="w-4 h-4" /> },
  { key: "completed", labelKey: "pages.events.filters.completed", icon: <Calendar className="w-4 h-4" /> },
];

/** Get events for a given day */
function getEventsForDay(events, year, month, day) {
  return events.filter((e) => {
    if (!e.startDate) return false;
    const d = new Date(e.startDate);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  });
}

/** Check if an event falls within a month */
function eventInMonth(event, year, month){
  if (!event.startDate) return false;
  const d = new Date(event.startDate);
  return d.getFullYear() === year && d.getMonth() === month;
}

export default function EventsPageClient() {
  const { locale, t } = useLocale();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.events.items);
  const loading = useAppSelector((state) => state.events.loading);
  const featured = []; // No featured handling in Redux slice

  // Load events on mount if not present
  useEffect(() => {
    if (!items.length && !loading) {
      dispatch(fetchEvents());
    }
  }, [items.length, loading, dispatch]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("calendar");
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const calendarLocale = appLocaleToBcp47(locale);

  /** Filtered & sorted events */
  const filteredItems = useMemo(() => {
    let result = items;
    if (activeFilter !== "all") {
      result = result.filter((item) => item.status === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const title = getLocalizedText(item.title, locale) || "";
        const summary = getLocalizedText(item.summary, locale) || "";
        const location = item.location || "";
        return (
          title.toLowerCase().includes(q) ||
          summary.toLowerCase().includes(q) ||
          location.toLowerCase().includes(q)
        );
      });
    }
    return result;
  }, [items, searchQuery, activeFilter, locale]);

  /** Count per filter for badges */
  const filterCounts = useMemo(() => {
    const counts= {
      all: items.length,
      upcoming: 0,
      "on-going": 0,
      completed: 0,
    };
    items.forEach((e) => {
      const s = e.status;
      if (s in counts) counts[s]++;
    });
    return counts;
  }, [items]);

  /** Calendar navigation */
  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat(calendarLocale, {
      month: "long",
      year: "numeric",
    }).format(currentMonth);
  }, [calendarLocale, currentMonth]);

  const dayNames = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(calendarLocale, { weekday: "short" });
    const sunday = new Date(Date.UTC(2024, 0, 7));
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(sunday);
      day.setUTCDate(sunday.getUTCDate() + index);
      return formatter.format(day);
    });
  }, [calendarLocale]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [currentMonth]);

  /** Events in current calendar month */
  const monthEvents = useMemo(() => {
    return filteredItems.filter((e) =>
      eventInMonth(e, currentMonth.getFullYear(), currentMonth.getMonth())
    );
  }, [filteredItems, currentMonth]);

  /** Empty state */
  const renderEmpty = () => (
    <EmptyState
      Icon={Calendar}
      title={activeFilter === "all" ? t("pages.events.noEvents") : t("pages.events.noEventsFiltered")}
      description={searchQuery || activeFilter !== "all" ? t("common.filterHint") : t("common.checkBackSoon")}
      actionLabel={searchQuery || activeFilter !== "all" ? t("pages.events.clearFilters") : undefined}
      onAction={
        searchQuery || activeFilter !== "all"
          ? () => {
              setSearchQuery("");
              setActiveFilter("all");
            }
          : undefined
      }
    />
  );

  /** Calendar view */
  const renderCalendar = () => (
    <div
      className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Calendar header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-gradient-to-r from-forest-50/50 to-earth-50/30">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
          className="w-10 h-10 rounded-full flex items-center justify-center text-forest-600 hover-forest-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-forest-900 font-display">
          {monthLabel}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
          className="w-10 h-10 rounded-full flex items-center justify-center text-forest-600 hover-forest-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-neutral-100">
        {dayNames.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-xs font-semibold text-forest-600 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={idx} className="min-h-[100px] border-r border-b border-neutral-50 bg-neutral-50/30" />;
          }
          const dayEvents = getEventsForDay(
            monthEvents,
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const isToday =
            new Date().toDateString() ===
            new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
          return (
            <div
              key={idx}
              className={`min-h-[100px] border-r border-b border-neutral-50 p-1.5 ${
                isToday ? "bg-forest-50/50" : ""
              }`}
            >
              <div
                className={`text-xs font-semibold mb-1 ${
                  isToday
                    ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-forest-600 text-white"
                    : "text-forest-700"
                }`}
              >
                {day}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((e) => {
                  const title = getLocalizedText(e.title, locale) || e.slug;
                  return (
                    <Link
                      key={e._id || e.slug}
                      href={`/events/${e.slug}`}
                      className="block px-1.5 py-1 rounded-md bg-forest-100/70 hover-forest-200 text-[10px] font-medium text-forest-800 truncate transition-colors"
                    >
                      {title}
                    </Link>
                  );
                })}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-forest-500 font-medium px-1.5">
                    +{dayEvents.length - 2} {t("pages.events.more")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-forest-50/30 to-white">
      <PageHero
        icon={Calendar}
        eyebrow={t("header.tagline")}
        title={t("pages.events.title")}
        subtitle={t("pages.events.subtitle")}
        stats={[
          { label: t("pages.events.totalEvents"), value: items.length },
          { label: t("pages.events.featured"), value: featured.length },
          {
            label: t("pages.events.activeEvents"),
            value: items.filter((e) => e.status === "upcoming" || e.status === "on-going").length,
          },
        ]}
      />

      {/* Content Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 lg-24">
        {/* Search + Filter Bar */}
        <div
          className="sticky top-20 z-30 mb-12"
        >
          <div className="rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-md p-3 shadow-sm space-y-3">
            {/* Search + view toggle */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("pages.events.searchPlaceholder")}
                  className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-forest-900 placeholder-forest-400 focus-none focus-2 focus-forest-500/20 focus-forest-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover-forest-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* View toggle */}
              <div className="flex items-center rounded-xl border border-neutral-200 bg-white p-1">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "calendar" ? "bg-forest-600 text-white" : "text-forest-600 hover-forest-50"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    viewMode === "list" ? "bg-forest-600 text-white" : "text-forest-600 hover-forest-50"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 text-forest-700">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-sm font-semibold hidden sm">{t("pages.events.filterLabel")}:</span>
              </div>
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeFilter === f.key
                      ? "bg-forest-600 text-white shadow-md shadow-forest-200"
                      : "text-forest-700 hover-forest-50"
                  }`}
                >
                  {f.icon}
                  {t(f.labelKey)}
                  <span
                    className={`ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold ${
                      activeFilter === f.key ? "bg-white/20 text-white" : "bg-forest-100 text-forest-600"
                    }`}
                  >
                    {filterCounts[f.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Events */}
        {featured.length > 0 && !searchQuery && activeFilter === "all" && (
          <section
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <h2 className="text-2xl sm-3xl font-bold text-forest-900 font-display">
                {t("pages.events.featured")}
              </h2>
            </div>
            <div
              className="grid gap-8 sm-cols-2"
            >
              {featured.map((item) => (
                <ItemCard
                  key={item._id || item.slug}
                  slug={item.slug}
                  title={getLocalizedText(item.title, locale) || item.slug}
                  summary={getLocalizedText(item.summary, locale) || ""}
                  imageUrl={item.featuredImage}
                  fallbackImage={fallbackEventImage}
                  href={`/events/${item.slug}`}
                  aspectRatio="16/9"
                  status={item.status}
                  dateRange={item.startDate ? (item.endDate ? { start: item.startDate, end: item.endDate } : { start: item.startDate }) : undefined}
                  location={item.location}
                  registrationUrl={item.registrationUrl}
                  registrationLabel={t("pages.events.register")}
                  actionLabel="View Details"
                  locale={locale}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Events - Calendar or List view */}
        {loading && items.length === 0 ? (
          <SkeletonGrid />
        ) : viewMode === "calendar" ? (
          <section
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-forest-100">
                <Calendar className="w-5 h-5 text-forest-600" />
              </div>
              <h2 className="text-2xl sm-3xl font-bold text-forest-900 font-display">
                {t("pages.events.calendarView")}
              </h2>
            </div>
            {renderCalendar()}

            {/* Events list below calendar */}
            {monthEvents.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-forest-900 mb-6 font-display">
                  {t("pages.events.eventsThisMonth")}
                </h3>
                <div
                  className="grid gap-8 sm-cols-2 lg-cols-3"
                >
                  {monthEvents.map((item) => (
                    <ItemCard
                      key={item._id || item.slug}
                      slug={item.slug}
                      title={getLocalizedText(item.title, locale) || item.slug}
                      summary={getLocalizedText(item.summary, locale) || ""}
                      imageUrl={item.featuredImage}
                      fallbackImage={fallbackEventImage}
                      href={`/events/${item.slug}`}
                      aspectRatio="16/9"
                      status={item.status}
                      dateRange={item.startDate ? (item.endDate ? { start: item.startDate, end: item.endDate } : { start: item.startDate }) : undefined}
                      location={item.location}
                      registrationUrl={item.registrationUrl}
                      registrationLabel={t("pages.events.register")}
                      actionLabel="View Details"
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        ) : (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-forest-100">
                <Calendar className="w-5 h-5 text-forest-600" />
              </div>
              <h2 className="text-2xl sm-3xl font-bold text-forest-900 font-display">
                {t("pages.events.allEvents")}
              </h2>
            </div>
            {filteredItems.length === 0 ? (
              renderEmpty()
            ) : (
              <>
                <div
                  key={activeFilter}
                  className="grid gap-8 sm-cols-2 lg-cols-3"
                >
                  {filteredItems.map((item) => (
                    <ItemCard
                      key={item._id || item.slug}
                      slug={item.slug}
                      title={getLocalizedText(item.title, locale) || item.slug}
                      summary={getLocalizedText(item.summary, locale) || ""}
                      imageUrl={item.featuredImage}
                      fallbackImage={fallbackEventImage}
                      href={`/events/${item.slug}`}
                      aspectRatio="16/9"
                      status={item.status}
                      dateRange={item.startDate ? (item.endDate ? { start: item.startDate, end: item.endDate } : { start: item.startDate }) : undefined}
                      location={item.location}
                      registrationUrl={item.registrationUrl}
                      registrationLabel={t("pages.events.register")}
                      actionLabel="View Details"
                      locale={locale}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </section>
    </div>
  );
}




import { Link } from "react-router-dom";
import { Calendar, MapPin, Ticket, ArrowRight } from "lucide-react";
import { resolveMediaUrl } from "@/lib/media";
import { StatusBadge } from "@/components/StatusBadge";

// Note: The following TypeScript prop definitions were removed as they caused syntax errors in JavaScript.

const defaultFallback =
  "https://res.cloudinary.com/dkhhjhpbc/image/upload/v1783278022/nature_view/home/tn7v79buqhisnzttngkx.jpg";

export default function ItemCard({
  slug,
  title,
  summary,
  imageUrl,
  fallbackImage = defaultFallback,
  href,
  aspectRatio = "4/3",
  status,
  date,
  dateRange,
  location,
  actionLabel = "View Details",
  registrationUrl,
  registrationLabel = "Register",
  locale = "en",
}) {
  // Use Cloudinary optimized URL
  const imgSrc = resolveMediaUrl(imageUrl, fallbackImage);
  const showRegistration =
    registrationUrl && (status === "upcoming" || status === "on-going");

  return (
    <div
      key={slug}
      className="group flex flex-col bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover-xl hover:-translate-y-1 transition-all duration-300"
    >
      <a href={href} className="block flex-col h-full text-neutral-900 text-decoration-none">
        <div
          className={`relative bg-neutral-100 overflow-hidden ${
            aspectRatio === "16/9" ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}
        >
          {imgSrc && (
            <img
              src={imgSrc}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover-105"
              loading="lazy"
            />
          )}
          {status && <StatusBadge status={status} />}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          {/* Date line (news style) */}
          {date && (
            <div className="text-sm text-forest-600 font-medium mb-2">{date}</div>
          )}

          {/* Date range (events style) */}
          {dateRange && (
            <div className="flex items-center gap-2 text-sm text-forest-600 font-medium mb-3">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                {new Date(dateRange.start).toLocaleDateString(locale, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {dateRange.end &&
                  ` - ${new Date(dateRange.end).toLocaleDateString(locale, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`}
              </span>
            </div>
          )}

          <h3 className="text-xl font-bold mb-2 line-clamp-2">{title}</h3>

          {/* Location (events style) */}
          {location && (
            <p className="text-neutral-500 text-sm mb-4 truncate flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {location}
            </p>
          )}

          {summary && (
            <p className="text-neutral-600 text-base line-clamp-3 mb-4 flex-1">
              {summary}
            </p>
          )}

          <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div className="text-sm font-medium text-forest-700 flex items-center gap-2 group-hover-forest-800">
              {actionLabel}
              <ArrowRight className="w-4 h-4 transition-transform group-hover-x-1" />
            </div>
            {showRegistration && (
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-600 text-white text-xs font-semibold hover-forest-700 transition-all duration-300 hover-md"
              >
                <Ticket className="w-3.5 h-3.5" />
                {registrationLabel}
              </a>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}

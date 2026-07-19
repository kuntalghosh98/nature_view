
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, ArrowRight, Ticket } from "lucide-react";
import { StatusBadge, Status } from "./StatusBadge";
import { resolveMediaUrl } from "@/lib/media";
import { formatLocalizedDate } from "@/lib/utils";

// Note: Removed leftover TypeScript prop definitions that caused syntax errors.

export default function ItemDetail({
  title,
  summary,
  body,
  imageUrl,
  fallbackImage = "https://res.cloudinary.com/dkhhjhpbc/image/upload/v1783278022/nature_view/home/tn7v79buqhisnzttngkx.jpg",
  badge,
  status,
  date,
  dateRange,
  location,
  registrationUrl,
  registrationLabel = "Register",
  galleryImages = [],
  action,
  locale = "en",
  backHref = "/",
  backLabel = "Back",
}) {
  // Use Cloudinary optimized URL for the featured image
  const heroImgSrc = resolveMediaUrl(imageUrl, fallbackImage);
  
  // Use Cloudinary optimized URL for gallery images
  const galleryImgSrcs = galleryImages.map(url => 
    resolveMediaUrl(url, fallbackImage)
  );

  const renderDate = () => {
    if (date) {
      return (
        <div className="flex items-center gap-1.5 text-xs text-forest-900/50 font-medium">
          <Calendar className="h-3.5 w-3.5" />
          <span>{date}</span>
        </div>
      );
    }
    if (dateRange) {
      const start = formatLocalizedDate(dateRange.start, locale, { month: "short", day: "numeric", year: "numeric" });
      const end = dateRange.end ? ` - ${formatLocalizedDate(dateRange.end, locale, { month: "short", day: "numeric", year: "numeric" })}` : "";
      return (
        <div className="flex items-center gap-2 text-xs text-forest-900/50 font-medium">
          <Calendar className="h-3.5 w-3.5" />
          <span>{start}{end}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Back link */}
      <div>
        <Link href={backHref} className="inline-flex items-center text-sm font-semibold text-forest-700 hover-forest-900 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {badge && (
              <span className={`px-3 py-1 text-sm font-medium rounded ${badge.className ?? "bg-white text-neutral-800 border-neutral-200"}`}> {badge.label} </span>
            )}
          {status && <StatusBadge status={status} />}
          {renderDate()}
          {location && (
            <div className="flex items-center gap-1.5 text-xs text-forest-900/50 font-medium">
              <span>{location}</span>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-forest-900 sm-4xl md-5xl">{title}</h1>
        {summary && <p className="text-lg text-forest-900/75 leading-relaxed font-medium">{summary}</p>}
      </header>

      {/* Featured image - using direct Cloudinary optimized URL */}
      {heroImgSrc && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-forest-100 shadow-sm border border-forest-900/5">
          <img 
            src={heroImgSrc} 
            alt={title} 
            className="h-full w-full object-cover" 
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}

      {/* Body and side info */}
      <div className="grid gap-8 md-cols-3">
        <div className="md-span-2 space-y-6">
          {body && (
                <div
                  className="prose prose-forest max-w-none text-forest-900/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
          )}
          {galleryImages.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-forest-900/10">
              <h3 className="text-xl font-bold text-forest-900">Gallery</h3>
              <div className="grid gap-4 sm-cols-2">
                {galleryImgSrcs.map((url, idx) => (
                  <div key={idx} className="relative aspect-video overflow-hidden rounded-2xl bg-forest-100 border border-forest-900/5">
                    <img 
                      src={url} 
                      alt={`Gallery ${idx + 1}`} 
                      className="h-full w-full object-cover hover-102 transition duration-300" 
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="space-y-6">
          {action && (
            <Link href={action.href} className="block text-center rounded-full bg-forest-700 hover-forest-800 text-white font-semibold py-2.5 text-sm transition">
              {action.label}
            </Link>
          )}
          {registrationUrl && (
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest-600 text-white text-xs font-semibold hover-forest-700 transition-all duration-300 hover-md"
            >
              <Ticket className="w-3.5 h-3.5" />
              {registrationLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}


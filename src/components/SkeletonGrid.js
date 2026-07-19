

/** Shared loading skeleton grid used across public listing pages */
export function SkeletonGrid({ count, variant = "standard" }) {
  const isFeatured = variant === "featured";
  // Create an array with the desired number of placeholder items
  const items = Array.from({ length: isFeatured ? 2 : 6 });

  return (
    <div className={isFeatured ? "grid gap-8 sm-cols-2" : "grid gap-8 sm-cols-2 lg-cols-3"}>
      {items.map((_, i) => (
        <div key={i} className="animate-pulse rounded-3xl border border-neutral-200 bg-white overflow-hidden">
          <div className={isFeatured ? "aspect-[16/9] bg-neutral-200" : "aspect-[4/3] bg-neutral-200"} />
          <div className="p-6 space-y-4">
            {isFeatured ? (
              <>
                <div className="h-5 bg-neutral-200 rounded-full w-3/4" />
                <div className="h-4 bg-neutral-100 rounded-full w-full" />
                <div className="h-4 bg-neutral-100 rounded-full w-5/6" />
              </>
            ) : (
              <>
                <div className="h-3 w-20 rounded-full bg-neutral-200" />
                <div className="h-5 w-3/4 rounded-lg bg-neutral-200" />
                <div className="h-4 w-full rounded-md bg-neutral-100" />
                <div className="h-4 w-5/6 rounded-md bg-neutral-100" />
                <div className="pt-4 border-t border-neutral-100">
                  <div className="h-4 w-1/3 rounded-full bg-neutral-100" />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}



/** Shared cinematic hero section used across public listing pages */
export function PageHero({ icon: Icon, eyebrow, title, subtitle, stats }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 py-20 lg-28">
      <div className="absolute top-10 left-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-forest-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-accent-400/5 to-forest-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-300 backdrop-blur-sm">
            <Icon className="w-4 h-4" />
            {eyebrow}
          </span>
        </div>

        <h1
          className="mt-6 text-4xl font-bold tracking-tight text-white lg-5xl font-display"
        >
          {title}
        </h1>

        <p
          className="mt-4 mx-auto max-w-2xl text-lg text-forest-200/80 leading-relaxed"
        >
          {subtitle}
        </p>

        {stats && stats.length > 0 && (
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white font-display">{stat.value}</div>
                <div className="mt-1 text-sm text-forest-300/70 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}




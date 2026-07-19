import { useLocale } from "@/providers/LocaleProvider";

export function StatusBadge({ status, className = "" }) {
  const { t } = useLocale();

  if (!status) return null;

  const config = {
    completed: {
      bg: "bg-emerald-50 border-emerald-200/60",
      text: "text-emerald-700",
      labelKey: "status.completed",
      fallbackLabel: "Completed",
    },
    "on-going": {
      bg: "bg-amber-50 border-amber-200/60",
      text: "text-amber-700",
      labelKey: "status.ongoing",
      fallbackLabel: "On-going",
    },
    upcoming: {
      bg: "bg-sky-50 border-sky-200/60",
      text: "text-sky-700",
      labelKey: "status.upcoming",
      fallbackLabel: "Upcoming",
    },
    demo: {
      bg: "bg-purple-50 border-purple-200/60",
      text: "text-purple-700",
      labelKey: "status.demo",
      fallbackLabel: "Demo",
    },
  };

  const current = config[status] || config.demo;
  // Use translated label if available, otherwise fallback to the default label
  const label = t(current.labelKey) !== current.labelKey ? t(current.labelKey) : current.fallbackLabel;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${current.bg} ${current.text} ${className}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}


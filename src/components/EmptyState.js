
import { X } from "lucide-react";



/** Shared empty / no-results state used across public listing pages */
export function EmptyState({ Icon, title, description, actionLabel, onAction }) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-forest-50 flex items-center justify-center mb-6 ring-8 ring-forest-50/50">
          <Icon className="w-10 h-10 text-forest-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
          <X className="w-4 h-4 text-accent-600" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-forest-900 mb-2 font-display">{title}</h3>
      <p className="text-forest-900/60 max-w-md leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-600 text-white text-sm font-medium hover-forest-700 transition-all duration-300 hover-lg hover-forest-200"
        >
          <X className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}



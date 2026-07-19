import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { resolveMediaUrl } from "@/lib/media";

/** Simple media picker that loads media items from the API */
export function MediaPicker({ onSelect }) {
  const { token } = useAppSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await apiRequest("/media", { token });
        // API is expected to return { success: true, data: [...] }
        setItems(res?.data || []);
      } catch (err) {
        console.error("Failed to load media", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) return <p>Loading media...</p>;

  return (
    <div className="grid gap-3">
      {items.map((m) => (
        <button
          key={m._id}
          onClick={() => onSelect(m)}
          className="flex items-center gap-3 rounded-lg border p-2 text-left"
        >
          <img
            src={resolveMediaUrl(m.url)}
            alt={m.alt || m.filename}
            className="h-12 w-20 object-cover rounded"
            loading="lazy"
          />
          <div>
            <div className="font-medium">{m.filename}</div>
            <div className="text-xs text-forest-900/60">{m.type}</div>
          </div>
        </button>
      ))}
    </div>
  );
}


import { useEffect } from "react";
import { loadInitialData } from "@/lib/initialLoad";

export default function Bootstrap() {
  useEffect(() => {
    // Fire and forget; loadInitialData handles its own async flow
    loadInitialData();
  }, []);

  return null;
}

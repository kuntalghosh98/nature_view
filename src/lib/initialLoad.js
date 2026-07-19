import { store } from "@/store/store";
import { fetchProjects } from "@/store/slices/projectsSlice";
import { fetchAttractions } from "@/store/slices/attractionsSlice";
import { fetchNews } from "@/store/slices/newsSlice";
import { fetchEvents } from "@/store/slices/eventsSlice";
import { fetchImpact } from "@/store/slices/impactSlice";
import { fetchTeam } from "@/store/slices/teamSlice";

/**
 * Dispatches all async thunks that load the initial data required for the home page.
 * Returns a promise that resolves when all fetches have completed (either fulfilled or rejected).
 */
export async function loadInitialData() {
  // Dispatch each thunk; each returns a promise-like action.
  await Promise.all([
    store.dispatch(fetchProjects()),
    store.dispatch(fetchAttractions()),
    store.dispatch(fetchNews()),
    store.dispatch(fetchEvents()),
    store.dispatch(fetchImpact()),
    store.dispatch(fetchTeam()),
  ]);
}

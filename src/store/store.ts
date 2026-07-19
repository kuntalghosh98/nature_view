import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectsReducer from "./slices/projectsSlice";
import attractionsReducer from "./slices/attractionsSlice";
import newsReducer from "./slices/newsSlice";
import eventsReducer from "./slices/eventsSlice";
import impactReducer from "./slices/impactSlice";
import teamReducer from "./slices/teamSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    attractions: attractionsReducer,
    news: newsReducer,
    events: eventsReducer,
    impact: impactReducer,
    team: teamReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

export const fetchEvents = createAsyncThunk(
  "events/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest('/events');
      const data = res.data;
      // API may return an array of Event items directly or an object containing an `items` array.
      if (Array.isArray(data)) {
        return data;
      }
      if (data && typeof data === 'object' && 'items' in data) {
        const items = (data).items;
        return Array.isArray(items) ? items : [];
      }
      return [];
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch events');
    }
  }
);



const initialState = {
  items: [],
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setEvents } = eventsSlice.actions;
export default eventsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

export const fetchAttractions = createAsyncThunk(
  "attractions/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest("/attractions");
      // API may return array directly or an object with items
      const data = Array.isArray(res.data) ? res.data : (res.data).items || [];
      return data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch attractions");
    }
  }
);



const initialState = {
  items: [],
  loading: false,
  error: null,
};

const attractionsSlice = createSlice({
  name: "attractions",
  initialState,
  reducers: {
    setAttractions(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttractions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttractions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAttractions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAttractions } = attractionsSlice.actions;
export default attractionsSlice.reducer;


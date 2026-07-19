import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

export const fetchImpact = createAsyncThunk(
  "impact/fetch",
  async (_, { rejectWithValue }) => {
    try {
      // Simple GET request ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“ the API returns { success, data }.
      const res = await apiRequest("/impact");
      const data = res.data;
      // API may return an array directly or an object with an `items` array.
      if (Array.isArray(data)) {
        return data;
      }
      if (data && typeof data === "object" && "items" in data) {
        const items = data.items;
        return Array.isArray(items) ? items : [];
      }
      return [];
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch impact data");
    }
  }
);



const initialState = {
  items: [],
  loading: false,
  error: null,
};

const impactSlice = createSlice({
  name: "impact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImpact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImpact.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchImpact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default impactSlice.reducer;

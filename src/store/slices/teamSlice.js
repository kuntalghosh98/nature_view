import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

export const fetchTeam = createAsyncThunk(
  "team/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest("/team");
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch team data");
    }
  }
);



const initialState = {
  items: [],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teamSlice.reducer;

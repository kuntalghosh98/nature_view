import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

export const fetchProjects = createAsyncThunk(
  "projects/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest("/projects");
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to fetch projects");
    }
  }
);



const initialState = {
  items: [],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setProjects } = projectsSlice.actions;
export default projectsSlice.reducer;


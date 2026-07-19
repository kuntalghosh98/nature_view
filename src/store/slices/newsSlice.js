import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

export const fetchNews = createAsyncThunk(
  "news/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRequest('/news');
      const data = res.data;
      // API may return an array of News items directly or an object containing a `items` array.
      if (Array.isArray(data)) {
        return data;
      }
      if (data && typeof data === 'object' && 'items' in data) {
        const items = (data).items;
        return Array.isArray(items) ? items : [];
      }
      // Fallback to empty array if shape is unexpected.
      return [];
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch news');
    }
  }
);



const initialState = {
  items: [],
  loading: false,
  error: null,
};

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setNews(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setNews } = newsSlice.actions;
export default newsSlice.reducer;


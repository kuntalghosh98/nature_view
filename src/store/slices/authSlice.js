/* eslint-disable no-unused-vars, unicode-bom, jsx-a11y/anchor-is-valid */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "@/lib/api";

const TOKEN_KEY = "nature_view_admin_token";

// Initial authentication state. All fields start empty / unauthenticated.
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

export const loginAdmin = createAsyncThunk("auth/login", async ({ email, password }) => {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  // Persist token for session restoration.
  localStorage.setItem(TOKEN_KEY, response.token);
  return response;
});

export const restoreSession = createAsyncThunk("auth/restoreSession", async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return { token: null, user: null };
  }
  const response = await apiRequest("/auth/me", { token });
  // Expect the backend to return a user object.
  return { token, user: response.user };
});

export const logoutAdmin = createAsyncThunk("auth/logout", async (_, { getState }) => {
  const state = getState();
  const token = state.auth.token || localStorage.getItem(TOKEN_KEY);
  if (token) {
    await apiRequest("/auth/logout", { method: "POST", token }).catch(() => null);
  }
  localStorage.removeItem(TOKEN_KEY);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = Boolean(action.payload.user && action.payload.token);
      })
      .addCase(restoreSession.rejected, (state) => {
        localStorage.removeItem(TOKEN_KEY);
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;

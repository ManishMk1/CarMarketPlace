import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getLoggedInUser = createAsyncThunk(
  'auth/getLoggedInUser',
  async (_, thunkAPI) => {
    console.log("Fetching logged-in user");
    try {
  const res = await axios.get(import.meta.env.VITE_AUTH_PROFILE_URL, {
      withCredentials: true
    });
      return res.data; // e.g., { user, token }
    } catch (err) {
      return thunkAPI.rejectWithValue('Not Authenticated');
    }
  }
);
const authSlice = createSlice({
  name: "auth",
   initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
   extraReducers: (builder) => {
    builder
      .addCase(getLoggedInUser.pending, state => {
        state.status = 'loading';
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.status = 'failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
    }
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;

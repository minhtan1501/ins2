import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postDataApi } from "../../api/userApi";

export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await postDataApi("login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "user/refreshToken",
  async (data, { rejectWithValue }) => {
    try {
        const isLogin = localStorage.getItem("firstLogin");
        if(isLogin) {
            const res = await postDataApi("refresh_token");
            return res.data;
        }
        return rejectWithValue("test")
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await postDataApi("register", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg);
    }
  }
);
export const logout = createAsyncThunk(
  "user/logout",
  async (data, { rejectWithValue }) => {
    try {
      const res = await postDataApi("logout", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: {},
    mode: localStorage.getItem("mode") || 'light'
  },
  reducers: {
    changeMode(state){
      const oldMode = state.mode;
      state.mode = oldMode === 'light' ? 'dark' : 'light'
      localStorage.setItem("mode", state.mode)
    },
    updateProfile(state, action) {
      state.profile = action.payload.profile;
    }
  },
  extraReducers: {
    [login.pending]: (state, action) => {
    },
    [login.fulfilled]: (state, action) => {
      localStorage.setItem("firstLogin", true);
      state.profile = action.payload.profile;
      state.token = action.payload.token;
    },
    [refreshToken.fulfilled]: (state, action) => {
      
        state.profile = action.payload.profile;
      state.loading = false;
      state.token = action.payload.token;
    },
    [refreshToken.rejected]: (state, action) => {
      localStorage.removeItem("firstLogin")
    
    },
    [register.fulfilled]: (state, action) => {
      localStorage.setItem("firstLogin", true);
      state.profile = action.payload.profile;
      state.token = action.payload.token;
    
    },
   
    [logout.fulfilled]: (state, action) => {
      state.token = ''
      state.profile={}
      localStorage.removeItem("firstLogin")
    }
  },
});

export default userSlice;

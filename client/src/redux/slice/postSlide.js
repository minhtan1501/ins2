import { getDataApi } from "../../api/userApi";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getPosts = createAsyncThunk(
  "getPosts",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getDataApi("posts", token);
      return res?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg);
    }
  }
);

const postSlide = createSlice({
  name: "homePosts",
  initialState: {
    posts: [],
    result: 0,
    page: 0,
    loading: false,
  },
  reducers: {
    createPost(state, action) {
      const oldState = state.posts;
      state.posts = [...oldState, action.payload];
    },
  },
  extraReducers: {
    [getPosts.fulfilled]: (state, action) => {
      if (action.payload) {
        state.posts = [...action.payload.posts];
        state.result = action.payload.result;
      }
      state.loading = false;
    },
    [getPosts.pending]: (state, action) => {
      state.loading = true;
    },
    [getPosts.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default postSlide;

import { getDataApi, patchDataApi } from "../../api/userApi";
import useNotify from "../../hooks/useNotify";

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

export const likePost = createAsyncThunk(
  "likePost",
  async ({ auth, post }, { rejectWithValue }) => {
    try {
      const newPost = { ...post, likes: [...post.likes, auth.profile] };
      const res = await patchDataApi(`posts/${post._id}/like`, {}, auth.token);
      return newPost;
    } catch (error) {
      throw new Error(error.response?.data?.msg)
    }
  }
);

export const unLikePost = createAsyncThunk(
  "unLikePost",
  async ({ auth, post }, { rejectWithValue }) => {
    try {
      const newLikes = post.likes?.filter(
        (like) => like._id !== auth.profile._id
      );
      const newPost = { ...post, likes: [...newLikes] };
      const res = await patchDataApi(
        `posts/${post._id}/unlike`,
        {},
        auth.token
      );
      return newPost;
    } catch (error) {
      throw new Error(error.response?.data?.msg)
    }
  }
);

export const createComment = createAsyncThunk(
  "unLikePost",
  async ({ auth, post,newComment }, { rejectWithValue }) => {
    try {
      const newLikes = post.likes?.filter(
        (like) => like._id !== auth.profile._id
      );
      const newPost = { ...post, likes: [...newLikes] };
      const res = await patchDataApi(
        `posts/${post._id}/unlike`,
        {},
        auth.token
      );
      return newPost;
    } catch (error) {
      throw new Error(error.response?.data?.msg)
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
      state.posts = [action.payload, ...oldState];
    },
    updatePost(state, action) {
      const oldState = state.posts;
      const newState = oldState.map((a) => {
        if (action.payload._id === a._id) {
          return action.payload;
        }
        return a;
      });
      state.posts = newState;
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
    [likePost.fulfilled]: (state, action) => {
      const oldState = state.posts;
      const newState = oldState.map((a) => {
        if (action.payload._id === a._id) {
          return action.payload;
        }
        return a;
      });
      state.posts = newState;
    },
    [unLikePost.fulfilled]: (state, action) => {
      const oldState = state.posts;
      const newState = oldState.map((a) => {
        if (action.payload._id === a._id) {
          return action.payload;
        }
        return a;
      });
      state.posts = newState;
    },
  },
});

export default postSlide;

import { getDataApi } from "../../api/userApi";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const getDicoverPosts = createAsyncThunk(
  "discover/getPosts",
  async ({ token }) => {
    try {
        const res = await getDataApi('posts_discover',token)
        return res.data
    } catch (error) {
        throw new Error(error.response.data?.msg);

    }
  }
);

const discoverSlide = createSlice({
  name: "discover",
  initialState: {
    posts: [],
    result: 9,
    page: 2,
    firstLoad: false,
  },
  reducers:{
    updatePosts(state, action){
      state.posts = [...action.payload.posts];
      state.page = state.page + 1;
      state.result = action.payload.result;
    }
  },
  extraReducers:{
    [getDicoverPosts.fulfilled]: (state, action) =>{
        state.posts = [...state.posts,...action.payload.posts];
        state.result = action.payload.result;
        state.firstLoad = true;
    }
  }
});

export default discoverSlide;

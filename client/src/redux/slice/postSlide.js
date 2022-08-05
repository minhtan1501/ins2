import {
  deleteDataApi,
  getDataApi,
  patchDataApi,
  postDataApi,
} from "../../api/userApi";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const updateData = (oldState, data) => {
  const newState = oldState.map((a) => {
    if (data._id === a._id) {
      return data;
    }
    return a;
  });
  return newState;
};

export const getPosts = createAsyncThunk(
  "getPosts",
  async (token, { rejectWithValue }) => {
    try {
      const res = await getDataApi("posts", token);
      return res?.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.msg);
    }
  }
);

export const likePost = createAsyncThunk(
  "likePost",
  async ({ auth, post }, { rejectWithValue }) => {
    try {
      const newPost = { ...post, likes: [...post.likes, auth.profile] };
      await patchDataApi(`posts/${post._id}/like`, {}, auth.token);
      return newPost;
    } catch (error) {
      throw new Error(error.response.data?.msg);
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
      await patchDataApi(`posts/${post._id}/unlike`, {}, auth.token);
      return newPost;
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const createComment = createAsyncThunk(
  "createComment",
  async ({ auth, post, newComment }, { rejectWithValue }) => {
    try {
      const data = { ...newComment, postId: post._id };
      const res = await postDataApi("comment", data, auth.token);

      const newData = { ...res.data.newComment, user: auth.profile };
      const newPost = { ...post, comments: [...post.comments, newData] };
      return newPost;
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const updateComment = createAsyncThunk(
  "updateComment",
  async ({ post, content, comment, auth }, { rejectWithValue }) => {
    try {
      const newComment = post.comments.map((c) => {
        return c._id === comment._id ? { ...comment, content } : c;
      });
      const newPost = { ...post, comments: newComment };
      await patchDataApi(`comment/${comment._id}`, { content }, auth.token);
      return newPost;
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const removeComment = createAsyncThunk(
  "removeComment",
  async ({ post, comment, auth }, { rejectWithValue }) => {
    try {
      const newComment = post.comments.filter((c) => {
        return c._id !== comment._id;
      });
      const newPost = { ...post, comments: newComment };
      await deleteDataApi(`comment/${comment._id}`, auth.token);
      return newPost;
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const likeComment = createAsyncThunk(
  "likeComment",
  async ({ post, comment, auth }, { rejectWithValue }) => {
    try {
      const newComment = {
        ...comment,
        likes: [...comment.likes, auth.profile],
      };
      const newComments = post.comments.map((c) => {
        return c._id === comment._id ? newComment : c;
      });
      await patchDataApi(`comment/${comment._id}/like`, {}, auth.token);
      const newPost = { ...post, comments: newComments };
      return newPost;
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);
export const unLikeComment = createAsyncThunk(
  "unLikeComment",
  async ({ post, comment, auth }, { rejectWithValue }) => {
    try {
      const newComment = {
        ...comment,
        likes: [
          ...comment.likes.filter((like) => like._id !== auth.profile._id),
        ],
      };
      const newComments = post.comments.map((c) => {
        return c._id === comment._id ? newComment : c;
      });
      await patchDataApi(`comment/${comment._id}/unlike`, {}, auth.token);

      const newPost = { ...post, comments: newComments };
      return newPost;
    } catch (error) {
      throw new Error(error.response.data?.msg);
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
      const newState = updateData(oldState, action.payload);
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
      const newState = updateData(oldState, action.payload);
      state.posts = newState;
    },
    [unLikePost.fulfilled]: (state, action) => {
      const oldState = state.posts;
      const newState = updateData(oldState, action.payload);
      state.posts = newState;
    },
    [createComment.fulfilled]: (state, action) => {
      const oldState = state.posts;
      const newState = updateData(oldState, action.payload);
      state.posts = newState;
    },
    [updateComment.fulfilled]: (state, action) => {
      const oldState = state.posts;
      const newState = updateData(oldState, action.payload);
      state.posts = newState;
    },
    [likeComment.fulfilled]: (state, action) => {
      const oldState = state.posts;
      const newState = updateData(oldState, action.payload);
      state.posts = newState;
    },
    [unLikeComment.fulfilled]: (state, action) => {
      const oldState = state.posts;
      const newState = updateData(oldState, action.payload);
      state.posts = newState;
    },
    [removeComment.fulfilled]: (state, action) => {
      const oldState = state.posts;
      const newState = updateData(oldState, action.payload);
      state.posts = newState;
    }
  },
});

export default postSlide;

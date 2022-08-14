import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteDataApi, getDataApi, postDataApi } from "../../api/userApi";

export const createNotify = createAsyncThunk(
  "createNotify",
  async ({ auth, socket, msg }, { rejectWithValue }) => {
    try {
      const res = await postDataApi("notify", msg, auth.token);
      socket.emit("createNotify", {
        ...res.data.notify,
        user: {
          userName: auth.profile.userName,
          avatar: auth.profile.avatar?.url,
        },
      });
      return res;
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const deleteNotify = createAsyncThunk(
  "deleteNotify",
  async ({ auth, socket, msg }) => {
    try {
      const res = await deleteDataApi(
        `notify/${msg.id}?url=${msg.url}`,
        auth.token
      );
      socket.emit("deleteNotify", msg);
    } catch (error) {}
  }
);

export const getNotify = createAsyncThunk("getNotify", async ({ token }) => {
  try {
    const res = await getDataApi("notifies", token);
    return res.data;
  } catch (error) {}
});

const notifySlice = createSlice({
  name: "notify",
  initialState: {
    loading: false,
    type: "",
    msg: "",
    data: [],
    sound: false,
  },
  reducers: {
    changeLoading(state, action) {
      state.loading = action.payload;
    },
    clearNotify(state) {
      state.type = "";
      state.msg = "";
    },
    setNotify(state, action) {
      state.type = action.payload.type;
      state.msg = action.payload.msg;
    },
    updateNotify(state, action) {
      state.data = [action.payload, ...state.data];
    },
    deleteNotify(state, action) {
      state.data = [
        ...state.data.filter(
          (n) =>
            n.id !== action.payload.id ||
            n.url !== action.payload.url ||
            n._id === action.payload._id
        ),
      ];
    },
  },
  extraReducers: {
    [getNotify.fulfilled]: (state, action) => {
      state.data = action.payload?.notifies;
    },
  },
});

export default notifySlice;

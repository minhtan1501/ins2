import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { deleteDataApi, getDataApi, postDataApi } from "../../api/userApi";

export const addMessage = createAsyncThunk(
  "addMessage",
  async ({ msg, auth, socket }) => {
    try {
      await postDataApi("message", msg, auth.token);
      const { _id, avatar, fullName, userName } = auth.profile;
      socket.emit("addMessage", {
        ...msg,
        user: { _id, avatar, fullName, userName },
      });
      return msg;
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const getConversation = createAsyncThunk(
  "getConversation",
  async ({ auth, page = 1 }) => {
    try {
      const res = await getDataApi(
        `conversations?limit=${page * 9}`,
        auth.token
      );
      let newArr = [];
      res.data.conversations.forEach((item) => {
        item.recipients.forEach((cv) => {
          if (cv._id !== auth.profile._id) {
            newArr.push({ ...cv, text: item.text, media: item.media });
          }
        });
      });
      return { newArr, result: res.data.result };
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const getMessages = createAsyncThunk(
  "getMessages",
  async ({ auth, id, page = 1 }) => {
    try {
      const res = await getDataApi(
        `/message/${id}?limit=${page * 9}`,
        auth.token
      );
      return {
        messages: res.data.messages,
        _id: id,
        page,
        result: res.data.result,
      };
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const deleteMessages = createAsyncThunk(
  "deleteMessages",
  async ({ auth, msg, data }) => {
    try {
      const newData = data.messages.filter((item) => item._id !== msg._id);
      await deleteDataApi(`message/${msg._id}`, auth.token);
      return { ...data, messages: newData, result: data.result - 1 };
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

export const deleteConversation = createAsyncThunk(
  "deleteConversation",
  async ({ auth, id, data, users }) => {
    try {
      const newData = data.filter((item) => item._id !== id);
      const newUsers = users.filter((user) => user._id !== id);
      await deleteDataApi(`conversation/${id}`, auth.token);
      return { newData, newUsers };
    } catch (error) {
      throw new Error(error.response.data?.msg);
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    users: [],
    resultUsers: 0,
    data: [],
    firstLoad: false,
    load: false,
  },
  reducers: {
    addUser(state, action) {
      const newUsers = state.users.filter(u => u._id !== action.payload._id);
      state.users = [action.payload, ...newUsers];
    },
    updateMessage(state, action) {
      state.data = state.data.map((item) =>
        item._id === action.payload.recipient ||
        item._id === action.payload.sender
          ? {
              ...item,
              messages: [...item.messages, action.payload],
              result: item.result + 1,
            }
          : item
      );
      state.users = state.users.map((u) =>
        u._id === action.payload.recipient || u._id === action.payload.sender
          ? {
              ...u,
              text: action.payload.text,
              media: action.payload.media,
            }
          : u
      );
    },
    loadMoreMessage(state, action) {
      state.data = action.payload;
      state.load = true;
    },
    updateLoad(state, action) {
      state.load = action.payload;
    },
    checkUserOnline(state, action) {
      state.users = state.users.map((u) =>
        action.payload.includes(u._id)
        ? {...u,online:true}
        : {...u,online:false}

      )
    }
  },
  extraReducers: {
    [addMessage.fulfilled]: (state, action) => {
      state.data = state.data.map((item) =>
        item._id === action.payload.recipient ||
        item._id === action.payload.sender
          ? {
              ...item,
              messages: [...item.messages, action.payload],
              result: item.result + 1,
            }
          : item
      );

      state.users = state.users.map((u) =>
        u._id === action.payload.recipient || u._id === action.payload.sender
          ? {
              ...u,
              text: action.payload.text,
              media: action.payload.media,
            }
          : u
      );
    },
    [getConversation.fulfilled]: (state, action) => {
      state.users = action.payload.newArr;
      state.resultUsers = action.payload.result;
      state.firstLoad = true;
    },
    [getMessages.fulfilled]: (state, action) => {
      // state.data = state.data.map((item) =>
      //   item._id === action.payload._id
      //     ? {
      //         ...item,
      //         ...action.payload,
      //       }
      //     : action.payload
      // );
      // console.log(
      //   state.data.map((item) =>{
      //     console.log(current(item)._id === action.payload._id
      //     ? {
      //         ...current(item),
      //         ...action.payload,
      //       }
      //     : action.payload)
      //     return current(item)._id === action.payload._id
      //       ? {
      //           ...current(item),
      //           ...action.payload,
      //         }
      //       : action.payload
      //   }
      //   )
      // );
      const newArr = state.data.filter(
        (item) => item._id !== action.payload._id
      );
      state.data = [action.payload, ...newArr];
    },
    [deleteMessages.fulfilled]: (state, action) => {
      state.data = state.data.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    [deleteConversation.fulfilled]: (state, action) => {
      state.users = action.payload.newUsers;
      state.data = action.payload.newData;
    },
  },
});

export default messageSlice;

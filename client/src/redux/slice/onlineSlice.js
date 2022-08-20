import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: {
    data: [],
  },
  reducers: {
    addData(state, action) {
      if (!state.data.includes(action.payload)) {
        state.data.push(action.payload);
      }
    },
    removeData(state, action) {
      state.data = state.data.filter((d) => d !== action.payload);
    },
  },
});

export default onlineSlice;

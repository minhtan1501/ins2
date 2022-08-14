import { createSlice } from "@reduxjs/toolkit";

const infoSlice = createSlice({
  name: "info",
  initialState: {
    profile: {},
  },
  reducers: {
    updateProfile(state, action) {
      state.profile = action.payload;
    },
    updateSocketProfile(state, action) {
      if (
        action.payload._id === state.profile._id ||
        !Object.keys(state.profile).length
      ) {
        state.profile = action.payload;
      } else if (action.payload.userFollowing?._id === state.profile._id) {
        state.profile = {
          ...state.profile,
          following: [
            ...state.profile?.following,
            action.payload?.userFollowing,
          ],
        };
      }
    },
  },
});

export default infoSlice;

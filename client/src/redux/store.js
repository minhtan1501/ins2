import { configureStore } from "@reduxjs/toolkit";
import notifySlice from "./slice/notifySlide";
import postSlide from "./slice/postSlide";
import userSlice from "./slice/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    notify: notifySlice.reducer,
    homePosts: postSlide.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

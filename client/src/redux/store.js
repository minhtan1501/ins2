import { configureStore } from "@reduxjs/toolkit";
import discoverSlide from "./slice/discoverSlice";
import notifySlice from "./slice/notifySlide";
import postSlide from "./slice/postSlide";
import userSlice from "./slice/userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    notify: notifySlice.reducer,
    homePosts: postSlide.reducer,
    discover: discoverSlide.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

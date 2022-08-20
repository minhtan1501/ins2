import { configureStore } from "@reduxjs/toolkit";
import discoverSlide from "./slice/discoverSlice";
import notifySlice from "./slice/notifySlide";
import postSlide from "./slice/postSlide";
import userSlice from "./slice/userSlice";
import socketSlice from "./slice/socketSlice";
import infoSlice from "./slice/infoSlice";
import messageSlice from "./slice/messageSlice";
import onlineSlice from "./slice/onlineSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    notify: notifySlice.reducer,
    homePosts: postSlide.reducer,
    discover: discoverSlide.reducer,
    socket: socketSlice.reducer,
    info: infoSlice.reducer,
    message: messageSlice.reducer,
    online: onlineSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

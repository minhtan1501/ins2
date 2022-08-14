import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import infoSlice from "./redux/slice/infoSlice";
import notifySlice from "./redux/slice/notifySlide";
import postSlide from "./redux/slice/postSlide";
import userSlice from "./redux/slice/userSlice";
export default function SocketClient() {
  const dispatch = useDispatch();
  const {
    user: auth,
    socket: { info: socket },
  } = useSelector((state) => state);
  //join user

  useEffect(() => {
    socket.emit("joinUser", auth.profile._id);
  }, [socket, auth]);

  // like
  useEffect(() => {
    socket.on("likeToClient", (newPost) => {
      dispatch(postSlide.actions.updatePost(newPost));
    });

    return () => socket.off("likeToClient");
  }, [socket, auth]);
  //unLike
  useEffect(() => {
    socket.on("unLikeToClient", (newPost) => {
      dispatch(postSlide.actions.updatePost(newPost));
    });

    return () => socket.off("unLikeToClient");
  }, [socket, auth]);
  //createComment
  useEffect(() => {
    socket.on("createCommentToClient", (newPost) => {
      dispatch(postSlide.actions.updatePost(newPost));
    });

    return () => socket.off("createCommentToClient");
  }, [socket, auth]);

  // deleteComment
  useEffect(() => {
    socket.on("deleteCommentToClient", (newPost) => {
      dispatch(postSlide.actions.updatePost(newPost));
    });

    return () => socket.off("deleteCommentToClient");
  }, [socket, auth]);

  // follow
  useEffect(() => {
    socket.on("followToClient", (newProfile) => {
      dispatch(infoSlice.actions.updateSocketProfile(newProfile));
      dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
    });

    return () => socket.off("followToClient");
  }, [socket, dispatch, auth]);
  // unfollow
  useEffect(() => {
    socket.on("unFollowToClient", (newProfile) => {
      dispatch(infoSlice.actions.updateSocketProfile(newProfile));
      dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
    });

    return () => socket.off("unFollowToClient");
  }, [socket, dispatch, auth]);
  // notify
  useEffect(() => {
    socket.on("createNotifyToClient", (msg) => {
      dispatch(notifySlice.actions.updateNotify(msg));
    });

    return () => socket.off("createNotifyToClient");
  }, [socket, dispatch, auth]);
  // delete notify
  useEffect(() => {
    socket.on("deleteNotifyToClient", (msg) => {

      dispatch(notifySlice.actions.deleteNotify(msg));
    });

    return () => socket.off("deleteNotifyToClient");
  }, [socket, dispatch, auth]);
  return <div></div>;
}

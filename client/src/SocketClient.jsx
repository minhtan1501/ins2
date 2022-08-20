import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import audiobell from "./audio/got-it-done-613.mp3";
import infoSlice from "./redux/slice/infoSlice";
import messageSlice from "./redux/slice/messageSlice";
import notifySlice from "./redux/slice/notifySlide";
import onlineSlice from "./redux/slice/onlineSlice";
import postSlide from "./redux/slice/postSlide";
import userSlice from "./redux/slice/userSlice";
const spawnNotification = (body, icon, url, title) => {
  let options = {
    body,
    icon,
  };
  let n = new Notification(title, options);

  n.onclick = (e) => {
    e.preventDefault();
    window.open(url, "_blank");
  };
};

export default function SocketClient() {
  const dispatch = useDispatch();
  const audioRef = useRef();
  const {
    user: auth,
    socket: { info: socket },
    notify,
    online,
  } = useSelector((state) => state);
  //join user

  useEffect(() => {
    socket.emit("joinUser", auth.profile);
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
      if (notify.sound) audioRef.current.play();
      spawnNotification(
        msg.user.userName + " " + msg.text,
        msg.user.avatar,
        msg.url,
        "Instagram"
      );
    });

    return () => socket.off("createNotifyToClient");
  }, [socket, dispatch, auth, notify.sound]);
  // delete notify
  useEffect(() => {
    socket.on("deleteNotifyToClient", (msg) => {
      dispatch(notifySlice.actions.deleteNotify(msg));
    });

    return () => socket.off("deleteNotifyToClient");
  }, [socket, dispatch, auth]);

  // message
  useEffect(() => {
    socket.on("addMessageToClient", (msg) => {
      dispatch(messageSlice.actions.updateMessage(msg));
      const newUser = { ...msg.user, text: msg.text, media: msg.media };
      dispatch(messageSlice.actions.addUser(newUser));
    });
  }, [socket, dispatch, auth]);
  // check user online/offline
  useEffect(() => {
    socket.emit("checkUserOnline", auth.profile);
  }, [socket, dispatch, auth.profile]);

  useEffect(() => {
    socket.on("checkUserOnlineToMe", (users) => {
      users.forEach((user) => {
        if (!online.data.includes(user.id)) {
          dispatch(onlineSlice.actions.addData(user.id));
        }
      });
    });
  }, [socket, dispatch, auth.profile, online.data]);

  useEffect(() => {
    socket.on("checkUserOnlineToClient", (id) => {
      if (!online.data.includes(id)) {
        dispatch(onlineSlice.actions.addData(id));
      }
    });
    return () => socket.off("checkUserOnlineToClient");
  }, [socket, dispatch, auth.profile, online.data]);

  // check user offline

  useEffect(() => {
    socket.on("CheckUserOffline", (id) => {
        dispatch(onlineSlice.actions.removeData(id));
    });
    return () => socket.off("CheckUserOffline");
  }, [socket, dispatch, auth.profile, online.data]);

  return (
    <>
      <audio controls ref={audioRef} style={{ display: "none" }}>
        <source src={audiobell} type="audio/mp3" />
      </audio>
    </>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getDataApi, patchDataApi } from "../../api/userApi";
import Container from "../../components/Container";
import Info from "../../components/profile/Info";
import Post from "../../components/profile/Post";
import Saved from "../../components/profile/Saved";
import useNotify from "../../hooks/useNotify";
import infoSlice from "../../redux/slice/infoSlice";
import { createNotify, deleteNotify } from "../../redux/slice/notifySlide";
import userSlice from "../../redux/slice/userSlice";
export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    user: auth,
    socket: { info: socket },
    info: { profile },
  } = useSelector((state) => state);
  const [posts, setPosts] = useState({ posts: [], result: 9 });
  const [saveTad, setSaveTad] = useState(false);

  const handleUpdateProfile = (p) => {
    dispatch(infoSlice.actions.updateProfile(p));
  };
  const { setNotify, setLoading } = useNotify();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (id !== auth.profile._id) {
          const { data } = await getDataApi("user/" + id, auth.token);
          handleUpdateProfile(data.profile);
        } else {
          handleUpdateProfile(auth.profile);
        }
        const res = await getDataApi(`user_posts/${id}`, auth.token);
        setPosts({ posts: [...res.data.posts], result: res.data.result });
        setLoading(false);
      } catch (error) {
        setNotify("error", error.response.data?.msg);
        setLoading(false);
      }
    })();
  }, [id, auth.profile]);

  const handleFollower = useCallback(async () => {
    try {
      const newUser = {
        ...profile,
        followers: [...profile.followers, auth.profile],
        userFollowing: auth.profile,
      };
      const newProfile = {
        ...auth.profile,
        following: [...auth.profile.following, profile],
      };
      dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
      await patchDataApi(`user/${profile._id}/follow`, null, auth.token);
      socket.emit("follow", newUser);
      handleUpdateProfile(newUser);

      const msg = {
        id: auth.profile._id,
        text: "bắt đầu theo dõi bạn",
        recipients: [newUser._id],
        url: `/profile/${auth.profile._id}`,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (error) {
      setNotify("error", error.response?.data?.msg);
    }
  }, [auth.profile, profile, auth.token]);

  const handleUnFollow = useCallback(async () => {
    try {
      const newUser = {
        ...profile,
        followers: profile.followers?.filter(
          (u) => u?._id !== auth.profile?._id
        ),
      };
      const newProfile = {
        ...auth.profile,
        following: auth.profile.following?.filter(
          (a) => a?._id !== profile._id
        ),
      };
      dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
      handleUpdateProfile(newUser);
      await patchDataApi(`user/${profile._id}/unfollow`, null, auth.token);
      socket.emit("unFollow", newUser);
      const msg = {
        id: auth.profile._id,
        text: "bắt đầu theo dõi bạn",
        recipients: [newUser._id],
        url: `/profile/${auth.profile._id}`,
      };
      dispatch(deleteNotify({ msg, auth, socket }));
    } catch (error) {
      setNotify("error", error.response.data?.msg);
    }
  }, [auth.profile, profile, auth.token]);
  const classActive =
    "border-t-[1px] border-b-[1px] border-black dark:border-white";
  return (
    <div className="dark:bg-primary bg-white mt-12 min-h-screen">
      <Container className="flex flex-col space-y-2">
        <Info
          setProfile={handleUpdateProfile}
          handleUnFollow={handleUnFollow}
          handleFollower={handleFollower}
          socket={socket}
          id={id}
          auth={auth}
          profile={profile}
          dispatch={dispatch}
        />
        {auth.profile._id === id && (
          <div className="flex justify-center border-t-[1px] border-b-[1px] space-x-2">
            <button
              className={
                "uppercase font-bold p-2 dark:text-white transition " +
                (!saveTad && classActive)
              }
              onClick={() => setSaveTad(false)}
            >
              Bài viết
            </button>
            <button
              className={
                "uppercase font-bold p-2 dark:text-white transition " +
                (saveTad && classActive)
              }
              onClick={() => setSaveTad(true)}
            >
              Đã lưu
            </button>
          </div>
        )}
        {saveTad ? (
          <Saved id={id} auth={auth} data={posts} dispatch={dispatch} />
        ) : (
          <Post id={id} auth={auth} data={posts} dispatch={dispatch} />
        )}
      </Container>
    </div>
  );
}

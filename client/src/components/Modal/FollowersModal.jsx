import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchDataApi } from "../../api/userApi";
import useNotify from "../../hooks/useNotify";
import { createNotify, deleteNotify } from "../../redux/slice/notifySlide";
import userSlice from "../../redux/slice/userSlice";
import CustomBtn from "../profile/CustomBtn";
import UserCard from "../UserCard";
import ModalContainer from "./ModalContainer";

export default function FollowersModal({
  socket,
  user = [],
  visible,
  onClose,
}) {
  const [found, setFound] = useState(false);
  const auth = useSelector((state) => state.user);
  const { setNotify } = useNotify();
  const dispatch = useDispatch();
  const handleFollower = async (u) => {
    const newProfile = {
      ...auth.profile,
      following: [...auth.profile.following, u],
    };
    const newUser = {
      ...u,
      followers: [...u.followers, auth.profile],
      userFollowing: auth.profile,
    };
    dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
    socket.emit("follow", newProfile);
    try {
      await patchDataApi(`user/${u?._id}/follow`, null, auth.token);
      const msg = {
        id: auth.profile._id,
        text: "bắt đầu theo dõi bạn",
        recipients: [newUser._id],
        url: `/profile/${auth.profile._id}`,
      };
      dispatch(createNotify({ msg, auth, socket }));
    } catch (error) {
      setNotify("error", error.response.data?.msg);
    }
  };
  // unfollow
  const handleUnFollow = async (u) => {
    const newProfile = {
      ...auth.profile,
      following: auth.profile.following?.filter((a) => a?._id !== u?._id),
    };
    const newUser = {
      ...u,
      followers: u.followers.filter((p) => p._id !== auth.profile._id),
    };
    dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
    socket.emit("unFollow", newUser);
    const msg = {
      id: auth.profile._id,
      text: "bắt đầu theo dõi bạn",
      recipients: [newUser._id],
      url: `/profile/${auth.profile._id}`,
    };
    dispatch(deleteNotify({ msg, auth, socket }));
    try {
      await patchDataApi(`user/${u?._id}/unfollow`, null, auth.token);
    } catch (error) {
      setNotify("error", error.response.data?.msg);
    }
  };
  useEffect(() => {
    if (user) {
      const found = user?.find((f) => f._id === auth.profile?._id);
      if (found) {
        setFound(true);
      }
    }
    return () => setFound(false);
  }, [user, auth]);
  if (!visible) return;
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="w-96 dark:bg-primary bg-white drop-shadow rounded p-3">
        <h1 className="text-lg dark:text-white font-semibold text-center border-b-[2px] dark:border-gray-500">
          NGƯỜI THEO DÕI
        </h1>
        <div className="space-y-2 mt-2">
          {found ? (
            <div className="flex justify-between space-y-2 items-center">
              <UserCard
                onClose={onClose}
                user={auth.profile}
                className="flex-1"
              />
            </div>
          ) : null}
          {user
            .filter((u) => u._id !== auth.profile?._id)
            .map((u) => {
              return (
                <div
                  key={u?._id}
                  className="flex justify-between space-y-2 items-center"
                >
                  <UserCard
                    handleSelected={onClose}
                    onClose={onClose}
                    user={u}
                    className="flex-1"
                  />
                  {!!auth.profile?.following.find((a) => a?._id === u?._id) ? (
                    <CustomBtn
                      onClick={() => handleUnFollow(u)}
                      className="text-red-500 hover:bg-red-500 border-red-500 hover:text-white p-2 dark:hover:text-white"
                    >
                      Huỷ theo dõi
                    </CustomBtn>
                  ) : (
                    <CustomBtn
                      onClick={() => handleFollower(u)}
                      className="text-sky-500 hover:bg-sky-500 border-sky-500 hover:text-white dark:hover:bg-yellow-500 dark:text-yellow-500 dark:border-yellow-500 dark:hover:text-primary p-2"
                    >
                      Theo dõi
                    </CustomBtn>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </ModalContainer>
  );
}

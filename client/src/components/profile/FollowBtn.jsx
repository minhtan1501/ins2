import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { patchDataApi } from "../../api/userApi";
import useNotify from "../../hooks/useNotify";
import { createNotify } from "../../redux/slice/notifySlide";
import userSlice from "../../redux/slice/userSlice";

export default function FollowBtn({ auth, user, socket }) {
  const { setNotify } = useNotify();
  const dispatch = useDispatch();
  const handleFollower = useCallback(async () => {
    try {
      const newProfile = {
        ...auth.profile,
        following: [...auth.profile.following, user],
      };
      const newUser = {
        ...user,
        followers: [...user.followers, auth.profile],
        userFollowing: auth.profile,
      };
      dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
      await patchDataApi(`user/${user._id}/follow`, null, auth.token);
      socket.emit("follow", newUser);
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
  }, [auth.profile, user, socket]);

  return (
    <div
      className="
      text-sky-500 
      dark:text-yellow-500 hover:opacity-70 border-none transition font-semibold text-sm"
      onClick={handleFollower}
    >
      Theo dõi
    </div>
  );
}

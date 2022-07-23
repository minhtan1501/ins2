import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { patchDataApi } from "../../api/userApi";
import useNotify from "../../hooks/useNotify";
import userSlice from "../../redux/slice/userSlice";
import CustomBtn from "../profile/CustomBtn";
import UserCard from "../UserCard";
import ModalContainer from "./ModalContainer";

export default function FollowersModal({ user = [], visible, onClose }) {
  const [found, setFound] = useState(false);
  const auth = useSelector((state) => state.user);
  const { setNotify } = useNotify();
  const dispatch = useDispatch();
  // console.log(useParams());
  const handleFollower = async (u) => {
    const newProfile = {
      ...auth.profile,
      following: [...auth.profile.following, u],
    };
    dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
    try {
      await patchDataApi(`user/${u?._id}/follow`, null, auth.token);
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
    dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
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
  }, [user, auth]);
  if (!visible || !user.length) return onClose && onClose();
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="w-96 dark:bg-primary bg-white drop-shadow rounded p-3">
        <h1 className="text-lg dark:text-white font-semibold text-center border-b-[2px] dark:border-gray-500">
          NGƯỜI THEO DÕI
        </h1>
        <div className="space-y-2 mt-2">
          {found ? (
            <div className="flex justify-between space-y-2 items-center">
              <UserCard user={auth.profile} className="flex-1" />
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
                    onClose={onClose}
                    user={u}
                    className="flex-1"
                  />
                  {!!auth.profile?.following.find((a) => a?._id === u?._id) ? (
                    <CustomBtn
                      onClick={() => handleUnFollow(u)}
                      className="text-red-500 hover:bg-red-500 border-red-500 hover:text-white p-2 "
                    >
                      Huỷ theo dõi
                    </CustomBtn>
                  ) : (
                    <CustomBtn
                      onClick={() => handleFollower(u)}
                      className=" p-2"
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

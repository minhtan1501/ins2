import { useCallback, useEffect, useState } from "react";
import { patchDataApi } from "../../api/userApi";
import useNotify from "../../hooks/useNotify";
import userSlice from "../../redux/slice/userSlice";
import Avatar from "../Avatar";
import EditProfileModal from "../Modal/EditProfileModal";
import FollowersModal from "../Modal/FollowersModal";
import NotFound from "../NotFound";
import CustomBtn from "./CustomBtn";
export default function Info({
  id,
  socket,
  handleUnFollow,
  setProfile,
  handleFollower,
  auth = {},
  profile = {},
  dispatch,
}) {
  const [follow, setFollow] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [followersModal, setFollowersModal] = useState(false);
  const [followingModal, setFollowingModal] = useState(false);

  const onSuccess = (data) => {
    setProfile({ ...data });
  };
  
  const handleCloseFollowersModal = () =>{
    setFollowersModal(false)
  }
  const handleCloseFollowingModal = () => {
    setFollowingModal(false)
  }

  // follow

  // const handleFollower = useCallback(async () => {
  //   try {
  //     const newUser = {
  //       ...user,
  //       followers: [...user.followers, auth.profile],
  //     };
  //     const newProfile = {
  //       ...auth.profile,
  //       following: [...auth.profile.following, user],
  //     };
  //     dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
  //     await patchDataApi(`user/${user._id}/follow`, null, auth.token);
  //     socket.emit('follow', newProfile);
  //     setUser(newUser);
  //   } catch (error) {
  //     setNotify("error", error.response.data?.msg);
  //   }
  // }, [auth.profile, user, auth.token]);
  // unfollow
  // const handleUnFollow = useCallback(async () => {
  //   try {
  //     const newUser = {
  //       ...user,
  //       followers: user.followers?.filter((u) => u?._id !== auth.profile?._id),
  //     };
  //     const newProfile = {
  //       ...auth.profile,
  //       following: auth.profile.following?.filter((a) => a?._id !== user._id),
  //     };
  //     dispatch(userSlice.actions.updateProfile({ profile: newProfile }));
  //     setUser(newUser);
  //     await patchDataApi(`user/${user._id}/unfollow`, null, auth.token);
  //   } catch (error) {
  //     setNotify("error", error.response.data?.msg);
  //   }
  // }, [auth.profile, user, auth.token]);

  useEffect(() => {
    if (profile) {
      const found = profile.followers?.find((f) => f._id === auth.profile?._id);
      if (found) {
        setFollow(true);
      } else {
        setFollow(false);
      }
    }
  }, [profile, auth.profile]);

  useEffect(() =>{
    if(!profile.followers?.length) handleCloseFollowersModal();
    if(!profile.following?.length) handleCloseFollowingModal();
  },[profile?.followers,profile?.following])

  return (
    <div className="flex justify-center">
      {Object.keys(profile).length ? (
        <div className="flex justify-around w-full p-6 items-center">
          <Avatar url={profile?.avatar?.url} size="supper" />
          <div className="min-w-[250px] max-w-[550px] w-full flex-1 mx-4">
            <div className="flex items-center flex-wrap">
              <h2 className="text-2xl font-light flex-[3] dark:text-dark-subtle">
                {profile.userName}
              </h2>
              {auth.profile?._id === profile._id ? (
                <CustomBtn
                  className="dark:border-yellow-500 dark:text-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-black border-sky-500 hover:bg-sky-500 hover:text-white text-sky-500"
                  onClick={() => setEditProfile(true)}
                >
                  Chỉnh sửa thông tin
                </CustomBtn>
              ) : !follow ? (
                <CustomBtn
                  className="dark:border-yellow-500 dark:text-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-black border-sky-500 hover:bg-sky-500 hover:text-white text-sky-500"
                  onClick={handleFollower}
                >
                  Theo dõi
                </CustomBtn>
              ) : (
                <CustomBtn
                  className="text-red-500 hover:bg-red-500 border-red-500 dark:hover:text-white"
                  onClick={handleUnFollow}
                >
                  Huỷ theo dõi
                </CustomBtn>
              )}
            </div>

            <div className="space-x-3">
              <span
                className="text-sky-400 dark:text-yellow-500 hover:underline
                  text-sm cursor-pointer"
                onClick={() => profile.followers?.length && setFollowersModal(true)}
              >
                {" "}
                {profile.followers?.length} Người Theo dõi
              </span>
              <span
                onClick={() => profile.following?.length && setFollowingModal(true)}
                className="text-sky-400 cursor-pointer dark:text-yellow-500 hover:underline text-sm"
              >
                {profile.following?.length} Theo dõi
              </span>
            </div>

            <h6 className="text-sm font-semibold dark:text-dark-subtle ">
              {profile.fullName}{" "}
            </h6>
            {profile.mobile && (
              <span className="text-red-500 font-semibold text-sm">
                Điện thoại: {profile.mobile}
              </span>
            )}
            <p className="text-sm dark:text-dark-subtle light:text-light-subtle font-semibold">
              {profile.address}
            </p>
            <h6 className="dark:text-white font-semibold">{profile.email}</h6>

            <a
              className="text-sky-400 dark:text-yellow-500 hover:underline"
              target="_blank"
              rel="noreferrer"
              href={profile.website}
            >
              {profile.website}
            </a>
            <div className=" break-words dark:text-dark-subtle text-light-subtle">
              {profile.story}
            </div>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
      <EditProfileModal
        user={profile}
        visible={editProfile}
        onClose={() => setEditProfile(false)}
        onSuccess={onSuccess}
      />
      {followersModal && (
        <FollowersModal
          visible={followersModal}
          onClose={handleCloseFollowersModal}
          user={profile?.followers}
          socket={socket}
        />
      )}
      {followingModal && (
        <FollowersModal
          visible={followingModal}
          onClose={handleCloseFollowingModal}
          user={profile?.following}
          socket={socket}
        />
      )}
    </div>
  );
}

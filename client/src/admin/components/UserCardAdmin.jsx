import React, { useState } from "react";
import { deleteDataApi, patchDataApi } from "../../api/userApi";
import Dropdown from "../../components/Dropdown";

function UserCardAdmin({
  user,
  auth,
  handleUpdateData,
  handleDeleteData = null,
}) {
  const [visibleDropdown, setVisibleDropdown] = useState(false);
  const [load, setLoad] = useState(false);
  const handleBanUser = async () => {
    try {
      if (load) return;
      setLoad(true);
      const res = await patchDataApi(`ban-user/${user._id}`, {}, auth.token);
      console.log(res);
      handleUpdateData && handleUpdateData(res.data.user);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  const handleUnBanUser = async () => {
    try {
      if (load) return;
      setLoad(true);
      const res = await patchDataApi(`unban-user/${user._id}`, {}, auth.token);
      console.log(res);
      handleUpdateData && handleUpdateData(res.data.user);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteDataApi(`user-admin/${user._id}`, auth.token);
      handleDeleteData && handleDeleteData(user);
    } catch (error) {}
  };

  const option = [
    {
      title: "Xóa người dùng",
      onClick: handleDeleteUser,
    },
  ];

  return (
    <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-end px-4 pt-4">
        <Dropdown options={option} />
      </div>
      <div className="flex flex-col items-center pb-10">
        <img
          className="mb-3 w-24 h-24 rounded-full shadow-lg"
          src={user.avatar.url ? user.avatar.url : "proFile.png"}
          alt={user.avatar.url || "proFile.png"}
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {user.userName}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {user.fullName}
        </span>
        <div className="flex mt-4 space-x-3 md:mt-6">
          {user.isBanner ? (
            <button
              onClick={handleUnBanUser}
              className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Mở khóa
            </button>
          ) : (
            <button
              onClick={handleBanUser}
              className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Khóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCardAdmin;

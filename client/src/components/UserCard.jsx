import React from "react";
import { BsFillImageFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
export default function UserCard({
  user,
  handleSelected = null,
  onClose = null,
  children,
  msg,
  className,
}) {
  const handleOnClick = () => {
    handleSelected && handleSelected();
    onClose && onClose();
  };
  if (!user) return null;
  return (
    <div className="flex justify-between p-1 items-center dark:hover:bg-[#2e2c2c80] hover:bg-[#f9f9f9] rounded cursor-pointer">
      <div>
        <Link to={"/profile/" + user?._id} onClick={handleOnClick}>
          <div className={"flex items-center  space-x-2  " + className}>
            <div>
              <Avatar url={user.avatar?.url} size="big" />
            </div>
            <div className="flex flex-col">
              <span className="dark:text-white text-sm font-semibold">
                {user?.userName}
              </span>
              <span className="dark:text-dark-subtle text-sm flex space-x-1">
                {msg && (user.text || user.media) ? (
                  <>
                    <div>
                      {user.text.length > 10
                        ? user.text.slice(0, 10) + "..."
                        : user.text}
                    </div>
                    {user.media.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <p>{user.media.length}</p>
                        <BsFillImageFill className="dark:text-white" size={14} />
                      </div>
                    )}
                  </>
                ) : (
                  user?.fullName
                )}
              </span>
            </div>
          </div>
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}

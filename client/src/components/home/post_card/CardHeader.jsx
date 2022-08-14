import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Avatar";
import moment from "moment";
import DropdownRender from "../../Dropdown";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { MdContentCopy } from "react-icons/md";
import { useSelector } from "react-redux";
export default function CardHeader({
  post,
  handleDeletePost,
  openModalStatus,
  handleCopyLink,
}) {
  const { profile } = useSelector((state) => state.user);
  const handleEditPost = () => {
    openModalStatus(post);
  };
  const options = [
    { title: "Chỉnh sửa bài viết", Icon: AiFillEdit, onClick: handleEditPost },
    {
      title: "Xoá bài viết",
      Icon: AiFillDelete,
      onClick: handleDeletePost,
    },
    {
      title: "Copy link",
      Icon: MdContentCopy,
      onClick: handleCopyLink,
    },
  ];
  const option2 = [
    {
      title: "Copy link",
      Icon: MdContentCopy,
      onClick: handleCopyLink,
    },
  ];

  return (
    <div className="flex justify-between ">
      <div className="flex space-x-2 p-2">
        <Avatar url={post.user.avatar?.url} size="big" />
        <div>
          <h6>
            <Link
              className="dark:text-white text-black font-semibold"
              to={`/profile/${post.user?._id}`}
            >
              {post.user.userName}
            </Link>
          </h6>
          <small className="dark:text-dark-subtle text-sm">
            {moment(post.createdAt).fromNow()}
          </small>
        </div>
      </div>
      <div className="relative z-[3]">
        {profile._id === post.user?._id ? (
          <DropdownRender options={options} />
        ) : (
          <DropdownRender options={option2} />
        )}
      </div>
    </div>
  );
}

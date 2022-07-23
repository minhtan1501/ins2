import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Avatar";
import moment from "moment";
import DropdownRender from "../../Dropdown";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

export default function CardHeader({ post }) {
  const options = [
    { title: "Chỉnh sửa bài viết", Icon: AiFillEdit },
    {
      title: "Xoá bài viết",
      Icon: AiFillDelete,
    },
  ];
  return (
    <div className="flex justify-between">
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
      <DropdownRender options={options} />
    </div>
  );
}

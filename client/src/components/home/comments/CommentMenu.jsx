import React from "react";
import Dropdown from "../../Dropdown";
import { IoMdMore } from "react-icons/io";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
export default function CommentMenu({ comment, post,handleRemove, auth,setOnEdit }) {
  const opiton1 = [
    { title: "Chỉnh sửa", Icon: AiFillEdit, onClick: setOnEdit },
    { title: "Xóa", Icon: AiFillDelete, onClick: handleRemove },

  ];
  const opiton2 = [{ title: "Xóa", Icon: AiFillDelete, onClick: null }];

  const checkPermission = (comment, post, auth) => {
    return post.user._id === auth.profile._id
      ? comment.user._id === auth.profile._id
        ? opiton1
        : opiton2
      : comment.user._id === auth.profile._id
      ? opiton1
      : [];
  };

  return (
    <div className="">
      {(post.user._id === auth.profile.id ||
        comment.user._id === auth.profile._id) && (
        <Dropdown
          options={checkPermission(comment, post, auth)}
          Icon={IoMdMore}
        />
      )}
    </div>
  );
}

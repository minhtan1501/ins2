import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { BsBookmark } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useNotify from "../../../hooks/useNotify";
import { likePost, unLikePost } from "../../../redux/slice/postSlide";
import LikeButton from "./LikeButton";
export default function CardFooter({ post }) {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user);
  const {setNotify} = useNotify()
  useEffect(() => {
    if (post.likes.find((like) => like._id === auth.profile._id)) {
      setIsLike(true);
    }
  }, [post.likes, auth.profile._id]);

  const handleLike = async () => {
    try {
      setIsLike(true);
      setLoadLike(true);
      const res =  await dispatch(likePost({ auth, post }));
      unwrapResult(res)
    } catch (error) {
      setNotify('error', error.message);
      setLoadLike(false);
      setIsLike(false);
    }
  };

  const handleUnLike = async () => {
    try {
      setIsLike(false);
      setLoadLike(true);
      await dispatch(unLikePost({ auth, post }));
    } catch (error) {
      setNotify('error', error.message);
      setLoadLike(false);
    }
  };

  return (
    <div className="border-t-[1px]">
      <div className="flex justify-between px-[15px] cursor-pointer items-center">
        <div className="flex space-x-3 text-2xl m-[10px] items-center dark:text-white">
          <LikeButton
            isLike={isLike}
            handleLike={handleLike}
            handleUnLike={handleUnLike}
          />
          <Link to={`/post/${post._id}`}>
            <FaRegComment />
          </Link>

          <TbSend />
        </div>
        <BsBookmark size={24} className="dark:text-white" />
      </div>
      <div className="flex justify-between pb-2">
        <h6 className="px-[30px] cursor-pointer font-semibold text-sm dark:text-yellow-500 text-sky-500">
          {post.likes?.length} lượt thích
        </h6>
        <h6 className="px-[30px] cursor-pointer font-semibold text-sm dark:text-yellow-500 text-sky-500">
          {post.comments?.length} bình luận
        </h6>
      </div>
    </div>
  );
}

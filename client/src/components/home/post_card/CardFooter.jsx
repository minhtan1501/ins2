import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useNotify from "../../../hooks/useNotify";
import notifySlice, {
  createNotify,
  deleteNotify,
} from "../../../redux/slice/notifySlide";
import {
  likePost,
  savePost,
  unLikePost,
  unSavePost,
} from "../../../redux/slice/postSlide";
import userSlice from "../../../redux/slice/userSlice";
import { BASE_URL } from "../../../utils/config";
import ShareModal from "../../Modal/ShareModal";
import LikeButton from "./LikeButton";
export default function CardFooter({ post, handleUpdatePost }) {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadSave, setLoadSave] = useState(false);
  const dispatch = useDispatch();
  const {
    user: auth,
    socket: { info: socket },
  } = useSelector((state) => state);
  const { setNotify } = useNotify();

  const handleLike = async () => {
    try {
      if (loadLike) return;
      setIsLike(true);
      setLoadLike(true);
      const res = await dispatch(
        likePost({ auth, post, socket, handleUpdatePost })
      );
      const msg = {
        id: auth.profile._id,
        text: "thích bài viết của bạn",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0]?.url,
      };
      await dispatch(createNotify({ msg, socket, auth }));
      unwrapResult(res);
      setLoadLike(false);
    } catch (error) {
      setNotify("error", error.message);
      setLoadLike(false);
      setIsLike(false);
    }
  };

  const handleUnLike = async () => {
    try {
      if (loadLike) return;
      setIsLike(false);
      setLoadLike(true);
      await dispatch(unLikePost({ auth, post, socket, handleUpdatePost }));
      const msg = {
        id: auth.profile._id,
        text: "thích bài viết của bạn",
        recipients: [post.user._id],
        url: `/post/${post._id}`,
        content: post.content,
        image: post.images[0]?.url,
      };
      await dispatch(deleteNotify({ auth, socket, msg }));
      setLoadLike(false);
    } catch (error) {
      setNotify("error", error.message);
      setLoadLike(false);
    }
  };

  const handleSavePost = async () => {
    try {
      if (loadSave) return;
      setLoadSave(true);
      setSaved(true);
      const newUser = {
        ...auth.profile,
        saved: [...auth.profile.saved, post._id],
      };
      dispatch(userSlice.actions.updateProfile({ profile: newUser }));
      await dispatch(savePost({ auth, post }));
      setLoadSave(false);
    } catch (error) {
      setLoadSave(false);
    }
  };

  const handleUnSavePost = async () => {
    try {
      if (loadSave) return;
      setLoadSave(true);
      setSaved(false);
      const newUser = {
        ...auth.profile,
        saved: auth.profile.saved.filter((p) => p._id !== post._id),
      };
      dispatch(userSlice.actions.updateProfile({ profile: newUser }));
      await dispatch(unSavePost({ auth, post }));
      setLoadSave(false);
    } catch (error) {
      setLoadSave(false);
    }
  };

  useEffect(() => {
    if (post.likes.find((like) => like._id === auth.profile._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, auth.profile._id]);

  useEffect(() => {
    if (auth.profile.saved?.find((id) => id === post._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [post, auth.profile._id]);

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

          <TbSend onClick={() => setIsShare((pre) => !pre)} />
        </div>
        {saved ? (
          <BsFillBookmarkFill
            onClick={handleUnSavePost}
            size={24}
            className="dark:text-white"
          />
        ) : (
          <BsBookmark
            onClick={handleSavePost}
            size={24}
            className="dark:text-white"
          />
        )}
      </div>
      <div className="flex justify-between pb-2">
        <h6 className="px-[30px] cursor-pointer font-semibold text-sm dark:text-yellow-500 text-sky-500">
          {post.likes?.length} lượt thích
        </h6>
        <h6 className="px-[30px] cursor-pointer font-semibold text-sm dark:text-yellow-500 text-sky-500">
          {post.comments?.length} bình luận
        </h6>
      </div>
      {isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} />}
    </div>
  );
}

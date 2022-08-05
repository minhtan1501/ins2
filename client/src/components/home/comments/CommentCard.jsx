import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useNotify from "../../../hooks/useNotify";
import {
  likeComment,
  removeComment,
  unLikeComment,
  updateComment,
} from "../../../redux/slice/postSlide";
import Avatar from "../../Avatar";
import LikeButton from "../post_card/LikeButton";
import CommentMenu from "./CommentMenu";
import InputComment from "../InputComment";

export default function CommentCard({ children, comment, post, commentId }) {
  const auth = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [readMore, setReadMore] = useState(false);

  const [isLike, setIsLike] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [onReply, setOnReply] = useState(false);
  const { setNotify } = useNotify();

  const handleLike = async () => {
    try {
      if (loadLike) return;
      setLoadLike(true);
      const result = await dispatch(likeComment({ comment, post, auth }));
      unwrapResult(result);
      setIsLike(true);
      setLoadLike(false);
    } catch (error) {
      setLoadLike(false);
    }
  };

  const handleUnLike = async () => {
    try {
      if (loadLike) return;
      setLoadLike(true);
      const result = await dispatch(unLikeComment({ comment, post, auth }));
      unwrapResult(result);
      setIsLike(false);
      setLoadLike(false);
    } catch (error) {
      setLoadLike(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (content !== comment.content) {
        const res = await dispatch(
          updateComment({ auth, comment, post, content })
        );
        unwrapResult(res);
        setOnEdit(false);
        setNotify("success", "Cập nhật thành công");
      } else {
        setOnEdit(false);
      }
    } catch (err) {
      setOnEdit(false);
      setNotify("error", err);
    }
  };

  const handleReply = () => {
    if (onReply) return setOnReply(false);
    setOnReply({ ...comment, commentId });
  };

  useEffect(() => {
    setContent(comment.content);
    if (comment.likes.find((like) => like._id === auth.profile._id)) {
      setIsLike(true);
    }
  }, [comment, auth.profile._id]);

  const styleCard = {
    opacity: comment._id ? 1 : 0.5,
    pointerEvents: comment._id ? "inherit" : "none",
  };
  const handleRemove = async () => {
    try {
      const res = await dispatch(removeComment({post,comment,auth}))
      unwrapResult(res);
    } catch (error) {
      setNotify('error',error)
    }
  }

  return (
    <div className="mt-1" style={styleCard}>
      <div className="dark:bg-[#3c3c3c] p-2 rounded bg-gray-50">
        <button>
          <Link
            to={`/profile/${comment.user._id}`}
            className="flex dark:text-white space-x-2 font-semibold "
          >
            <Avatar url={comment.user.avatar.url} />
            <h6>{comment.user.userName}</h6>
          </Link>
        </button>

        <div className="mt-2 flex justify-between space-x-1">
          {onEdit ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              className="resize-none bg-transparent w-full outline-none 
              dark:text-white border-2 rounded p-1 
              dark:border-dark-subtle border-light-subtle
              dark:focus:border-white transition 
              focus:border-primary custom-scroll-bar"
            />
          ) : (
            <div className="dark:text-white ">
              {comment.tag && comment.user._id !== comment.tag._id && (
                <Link
                  className="mr-1 dark:text-yellow-500 text-sky-500 font-semibold"
                  to={`/profile/${comment.tag._id}`}
                >
                  @{comment.tag.userName}
                </Link>
              )}
              {content.length < 100
                ? content
                : readMore
                ? content + " "
                : content.slice(0, 100) + "..."}
              {content.length > 100 && (
                <span
                  className="cursor-pointer dark:text-[#ccc] text-light-subtle text-sm font-semibold hover:opacity-70"
                  onClick={() => setReadMore((pre) => !pre)}
                >
                  {readMore ? "ẩn bớt" : "đọc tiếp"}
                </span>
              )}
            </div>
          )}

          {!onEdit && (
            <div className="flex items-center">
              <CommentMenu
                post={post}
                comment={comment}
                auth={auth}
                setOnEdit={() => setOnEdit(true)}
                handleRemove={handleRemove}
              />
              <div className="-translate-y-1">
                <LikeButton
                  isLike={isLike}
                  handleLike={handleLike}
                  handleUnLike={handleUnLike}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="space-x-3 dark:text-dark-subtle flex items-center ml-2">
          <small className="font-semibold cursor-pointer">
            {comment.likes.length} Lượt thích
          </small>
          {onEdit ? (
            <>
              <small
                onClick={handleUpdate}
                className="font-semibold cursor-pointer"
              >
                Cập nhật
              </small>
              <small
                onClick={() => {
                  setOnEdit(false);
                  setContent(comment.content);
                }}
                className="font-semibold cursor-pointer"
              >
                Hủy bỏ
              </small>
            </>
          ) : (
            <small
              onClick={handleReply}
              className="font-semibold cursor-pointer "
            >
              {onReply ? "Hủy bỏ" : "Phản hồi"}
            </small>
          )}
          <small className="dark:text-dark-subtle">
            {moment(comment.createdAt).fromNow()}
          </small>
        </div>
      </div>
      {onReply && (
        <InputComment post={post} onReply={onReply} setOnReply={setOnReply}>
          <Link
            to={`/profile/${onReply.user._id}`}
            className="dark:text-yellow-500 mr-2 text-sky-500 font-semibold"
          >
            {comment.user._id !== auth.profile._id &&
              "@" + onReply.user.userName}
          </Link>
        </InputComment>
      )}
      {children}
    </div>
  );
}

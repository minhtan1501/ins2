import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNotify from "../../hooks/useNotify";
import postSlide, { createComment } from "../../redux/slice/postSlide";
export default function InputComment({ children,handleUpdatePost, post,onReply,setOnReply }) {
  const [content, setContent] = useState("");
  const auth = useSelector((state) => state.user);
  const { setNotify } = useNotify();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!content.trim()) {
        if(setOnReply) return setOnReply(false);
      }
      const newComment = {
        content,
        likes: [],
        user: auth.profile,
        createdAt: new Date().toISOString(),
        reply: onReply && onReply.commentId,
        tag: onReply && onReply.user 
      };
      const newPost = {...post,comments: [...post.comments,newComment]}
      handleUpdatePost && handleUpdatePost(newPost)
      dispatch(postSlide.actions.updatePost(newPost))
      const res = await dispatch(createComment({ post, newComment, auth }));
      handleUpdatePost && handleUpdatePost({...res.payload})
      
      unwrapResult(res);
      setContent("");
      if(setOnReply) return setOnReply(false);
    } catch (error) {
      setNotify("error", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full dark:bg-[#3c3b3b] p-2 flex items-center bg-[#fbfbfb]"
    >
      {children}
      <input
        className="border-none outline-none bg-transparent dark:text-white flex-1 overflow-auto text-primary dark:placeholder-white"
        type="text"
        value={content}
        placeholder="Bình luận..."
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="text-sky-500 dark:text-yellow-500 font-semibold"
      >
        Post
      </button>
    </form>
  );
}

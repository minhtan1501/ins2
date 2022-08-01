import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../redux/slice/postSlide";

export default function InputComment({ children, post }) {
  const [content, setContent] = useState("");
  const auth = useSelector(state => state.user);
  const dispatch = useDispatch();
  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      if(!content.trim()) return;
      const newComment = {
        content,
        likes: [],
        user: auth.profile,
        createdAt: new Date().toISOString(),
      }
      const res = await dispatch(createComment({post,newComment,auth}))
      unwrapResult(res);
      setContent('')
    } catch (error) {
      
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full dark:bg-[#3c3b3b] p-2 flex items-center bg-[#fbfbfb]">
      {children}
      <input
        className="border-none outline-none bg-transparent dark:text-dark-subtle flex-1 overflow-auto text-light-subtle"
        type="text"
        value={content}
        placeholder="Bình luận..."
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="text-sky-500 dark:text-yellow-500 font-semibold">Post</button>
    </form>
  );
}

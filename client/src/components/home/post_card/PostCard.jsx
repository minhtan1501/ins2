import React, { useState } from "react";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import CardBody from "./CardBody";
import StatusModal from "../../Modal/StatusModal";
import Comments from "../Comments";
import InputComment from "../InputComment";
import { useDispatch } from "react-redux";
import postSlide, { deletePost } from "../../../redux/slice/postSlide";
import { useNavigate } from "react-router-dom";
import useNotify from "../../../hooks/useNotify";
import { unwrapResult } from "@reduxjs/toolkit";

export default function PostCard({ data, handleUpdatePost, auth }) {
  const navigate = useNavigate();
  const [visibleModalStatus, setVisibleModalStatus] = useState(false);
  const [post, setPost] = useState({});
  const dispatch = useDispatch();
  const { setLoading, setNotify } = useNotify();
  const openModalStatus = (post = {}) => {
    setPost({ ...post });
    setVisibleModalStatus(true);
  };

  const closeModalStatus = () => {
    setPost({});
    setVisibleModalStatus(false);
  };
  const handleDeletePost = async () => {
    try {
      setLoading(true);
      const res = await dispatch(deletePost({ auth, post: data }));
      unwrapResult(res);
      setLoading(false);
      navigate("/", { replace: true });
    } catch (error) {
      setLoading(false);
      setNotify("error", error);
    }
  };

  return (
    <>
      <div className="dark:bg-secondary rounded dark:drop-shadow-xl shadow bg-white ">
        <CardHeader
          handleDeletePost={handleDeletePost}
          post={data}
          openModalStatus={openModalStatus}
        />
        <CardBody post={data} />
        <CardFooter post={data} />

        <Comments post={data} handleUpdatePost={handleUpdatePost} />
        <InputComment post={data} handleUpdatePost={handleUpdatePost} />
      </div>
      <StatusModal
        handleUpdatePost={handleUpdatePost}
        visible={visibleModalStatus}
        onClose={closeModalStatus}
        post={post}
      />
    </>
  );
}

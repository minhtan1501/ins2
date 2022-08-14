import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useNotify from "../../../hooks/useNotify";
import { deleteNotify } from "../../../redux/slice/notifySlide";
import { deletePost } from "../../../redux/slice/postSlide";
import { BASE_URL } from "../../../utils/config";
import ConfirmModal from "../../Modal/ConfirmModal";
import StatusModal from "../../Modal/StatusModal";
import Comments from "../Comments";
import InputComment from "../InputComment";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";

export default function PostCard({ data, handleUpdatePost, auth, socket }) {
  const navigate = useNavigate();
  const [visibleModalStatus, setVisibleModalStatus] = useState(false);
  const [post, setPost] = useState({});
  const [visibleModalCf, setVisibleModalCf] = useState(false);
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
      setVisibleModalCf(false);
      setLoading(true);
      const res = await dispatch(deletePost({ auth, post: data,socket }));
       const msg = {
        id: res.payload._id,
        text: "added a new post.",
        recipients: res.payload.user.followers,
        url: `/post/${res.payload._id}`,
      };
      dispatch(deleteNotify({ auth, socket, msg }));
      unwrapResult(res);
      setLoading(false);
      navigate("/", { replace: true });
    } catch (error) {
      setLoading(false);
      setNotify("error", error);
    }
  };

  const handleOpenModalCf = () => {
    setVisibleModalCf(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/post/${data._id}`);
  };

  return (
    <div className="mt-0">
      <div className="dark:bg-secondary rounded dark:drop-shadow-xl shadow bg-white ">
        <CardHeader
          handleDeletePost={handleOpenModalCf}
          post={data}
          openModalStatus={openModalStatus}
          handleCopyLink={handleCopyLink}
        />
        <CardBody post={data} />
        <CardFooter post={data} handleUpdatePost={handleUpdatePost} />

        <Comments post={data} handleUpdatePost={handleUpdatePost} />
        <InputComment post={data} handleUpdatePost={handleUpdatePost} />
      </div>
      <StatusModal
        handleUpdatePost={handleUpdatePost}
        visible={visibleModalStatus}
        onClose={closeModalStatus}
        post={post}
      />
      <ConfirmModal
        handleConfirm={handleDeletePost}
        content="Hành động này không thể quay lại, bạn vẫn muốn xóa?"
        visible={visibleModalCf}
        onClose={() => setVisibleModalCf(false)}
      />
    </div>
  );
}

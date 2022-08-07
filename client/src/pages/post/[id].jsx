import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDataApi } from "../../api/userApi";
import useNotify from "../../hooks/useNotify";
import NotFound from "../../components/NotFound";
import Container from "../../components/Container";
import PostCard from "../../components/home/post_card/PostCard";
export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { setLoading } = useNotify();
  const auth = useSelector((state) => state.user);
  const { homePosts } = useSelector((state) => state);

  const handleUpdate = (data) => {
    setPost({...data})
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getDataApi(`posts/${id}`, auth.token);
        setPost(res.data.post ? { ...res.data.post } : null);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setPost({});
      }
    })();
  }, [id, auth]);


  return (
    <div className=" dark:bg-primary bg-white min-h-screen">
      <div className="max-w-screen-xl mx-auto mt-[50px]">
      {!post ? <NotFound /> : <PostCard data={post} handleUpdatePost ={handleUpdate}/>}

      </div>
    </div>
  );
}

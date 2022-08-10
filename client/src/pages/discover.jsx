import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDataApi } from "../api/userApi";
import LoadMoreBtn from "../components/LoadMoreBtn";
import PostThumb from "../components/PostThumb";
import useNotify from "../hooks/useNotify";
import discoverSlide, { getDicoverPosts } from "../redux/slice/discoverSlice";
import Container from "../components/Container";
import { ImSpinner3 } from "react-icons/im";
export default function Discover() {
  const auth = useSelector((state) => state.user);
  const discover = useSelector((state) => state.discover);
  const dispatch = useDispatch();
  const { setLoading } = useNotify();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        if (!discover.firstLoad) {
          setLoading(true);
          const res = await dispatch(getDicoverPosts({ token: auth.token }));
          unwrapResult(res);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    })();
  }, [auth, discover.firstLoad]);
  const handleLoadMore = async () => {
    try {
      setLoad(true);

      const res = await getDataApi(
        `posts_discover?limit=${discover.page * 9}`,
        auth.token
      );
      dispatch(discoverSlide.actions.updatePosts({posts:res.data.posts,result:res.data.result}));
      setLoad(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white dark:bg-primary min-h-screen">
      <Container className="mt-12 flex flex-col">
        <PostThumb posts={discover.posts} result={discover.result} />

        {load ? (
          <ImSpinner3
            size={40}
            className="animate-spin dark:text-white text-primary block mx-auto"
          />
        ) : (
          <LoadMoreBtn
            result={discover.result}
            page={discover.page}
            handleLoadMore={handleLoadMore}
            load={load}
          />
        )}
      </Container>
    </div>
  );
}

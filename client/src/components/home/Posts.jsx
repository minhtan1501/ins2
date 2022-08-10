import React, { useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useDispatch, useSelector } from "react-redux";
import { getDataApi } from "../../api/userApi";
import postSlide from "../../redux/slice/postSlide";
import LoadMoreBtn from "../LoadMoreBtn";
import PostCard from "./post_card/PostCard";
export default function Posts() {
  const { homePosts } = useSelector((state) => state);
  const auth = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const handleLoadMore = async () => {
    try {
      setLoad(true);
      const res = await getDataApi(
        `posts?limit=${homePosts.page * 9}`,
        auth.token
      );
      dispatch(
        postSlide.actions.loadMorePosts({
          posts: res.data.posts,
          result: res.data.result,
        })
      );
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };
  return (
    <div className="space-y-5 ">
      {homePosts.posts.map((post) => {
        return <PostCard key={post._id} data={post} auth={auth} />;
      })}
      {load ? (
        <ImSpinner3
          size={40}
          className="animate-spin dark:text-white text-primary block mx-auto my-3"
        />
      ) : (
        <LoadMoreBtn
          result={homePosts.result}
          page={homePosts.page}
          handleLoadMore={handleLoadMore}
          load={load}
        />
      )}
    </div>
  );
}

import React from "react";
import { useSelector } from "react-redux";
import PostCard from "./post_card/PostCard";
export default function Posts() {
  const { homePosts } = useSelector((state) => state);

  return (
    <div className="space-y-5 ">
      {homePosts.posts.map((post) => {
        return <PostCard key={post._id} data={post} />;
      })}
    </div>
  );
}

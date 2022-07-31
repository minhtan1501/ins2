import React, { useState } from "react";
import { useSelector } from "react-redux";
import CardBody from "./post_card/CardBody";
import CardFooter from "./post_card/CardFooter";
import CardHeader from "./post_card/CardHeader";
import StatusModal from "../Modal/StatusModal";
import PostCard from "./post_card/PostCard";
export default function Posts() {
  const { homePosts } = useSelector((state) => state);

  return (
    <div className="space-y-4 ">
      {homePosts.posts.map((post) => {
        return <PostCard key={post._id} data={post} />;
      })}
    </div>
  );
}

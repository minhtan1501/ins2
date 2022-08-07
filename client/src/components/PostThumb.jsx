import React from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function PostThumb({ posts,result }) {

  if(result === 0) return <h2 className="dark:text-dark-subtle font-semibold text-4xl text-center text-light-subtle">Không có bài viết!</h2>


  return (
    <div className="post__thumb__display w-full grid grid-cols-postThumb gap-2.5 overflow-hidden my-[15px] dark:bg-secondary bg-white drop-shadow">
      {posts.map((post, index) => (
        <Link to={`/post/${post._id}`} key={post._id}>
          <div className=" min-w-[300px] h-[300px] w-full relative cursor-pointer overflow-hidden">
            <img
              className="w-full h-full block "
              src={post?.images[0].url}
              alt={post?.images[0].url}
            />

            <div className="hover:opacity-100 dark:text-yellow-500 text-white font-semibold space-x-5 absolute top-0 left-0 w-full h-full bg-[#0008] dark:bg-[rgb(39 39 39 / 50%)] flex justify-center items-center opacity-0 transition">
              <div className="flex items-center space-x-1">
                <AiOutlineHeart size={24} />
                <p>{post.likes?.length}</p>
              </div>
              <div className="flex items-center space-x-1">
                <FaRegComment size={24} />
                <p>{posts.comments?.length}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

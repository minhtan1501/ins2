import React, { useState } from "react";
import Carousel from "./Carousel";

export default function CardBody({ post }) {
  const [readMore, setReadMore] = useState(false);
  return (
    <>
      <div className="p-6 mt-[-10px] ">
        <span className="dark:text-white ">
          {post.content?.length < 60
            ? post.content
            : readMore
            ? post.content + " "
            : post.content.slice(0, 60) + "..."}
        </span>
        {post.content?.length > 60 && (
          <span
            className="cursor-pointer dark:text-[#ccc] text-light-subtle text-sm font-semibold hover:opacity-70"
            onClick={() => setReadMore((pre) => !pre)}
          >
            {readMore ? "đọc tiếp" : "ẩn bớt"}
          </span>
        )}
      </div>
      <div className="border-t-[1px]">
        {post.images.length > 0 && <Carousel images={post.images} />}
      </div>
    </>
  );
}

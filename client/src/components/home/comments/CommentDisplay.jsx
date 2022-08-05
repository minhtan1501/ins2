import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import CommentCard from "./CommentCard";

export default function CommentDisplay({ comment, post, replyCm }) {
  const [showRep,setShowRep] = useState([]);
  const [next,setNext] = useState(1);

  useEffect(() => {
    setShowRep(replyCm.filter((_,index) => index < next ))
  },[replyCm,next])
  
  return (
    <div className="py-[10px] px-[25px]">
      <CommentCard comment={comment} post={post} commentId={comment._id}>
        <div className="pl-4">
          {showRep.map((item) => (
            item.reply && 
              <CommentCard
                key={item._id}
                comment={item}
                commentId={comment._id}
                post={post}
              />
            
          ))}
        </div>
        {replyCm.length - next > 0 ? (
        <div
          onClick={() =>
            setNext((pre) =>
              pre + 5 > replyCm.length ? replyCm.length + 1 : pre + 5
            )
          }
          className="dark:text-yellow-500 text-sky-500 ml-2 cursor-pointer text-sm font-semibold "
        >
          Xem thêm bình luận
        </div>
      ) : (
        replyCm.length  > 1 && (
          <div
            onClick={() => setNext((pre) => pre - 5 < 1 ? 1 : pre - 5)}
            className="dark:text-yellow-500 text-sky-500 ml-2 cursor-pointer text-sm font-semibold "
          >
            Ẩn bớt bình luận
          </div>
        )
      )}
      </CommentCard>
    </div>
  );
}

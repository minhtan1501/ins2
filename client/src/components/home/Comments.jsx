import React, { useEffect, useState } from "react";
import CommentDisplay from "./comments/CommentDisplay";

export default function Comments({updateCommentByAd, post,handleUpdatePost }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(2);

  const [replyComments, setReplyComments] = useState([]);

  useEffect(() => {
    const newCm = post.comments.filter((cm) => !cm.reply);
    setComments(newCm);
    setShowComments(newCm.filter((_, i) => i < next));
  }, [post.comments, next]);

  useEffect(() => {
    const newRep = post.comments.filter((cm) => cm.reply);
    setReplyComments(newRep);
  }, [post.comments]);

  return (
    <div>
      {showComments.map((comment, index) => {
        return (
          <CommentDisplay
          updateCommentByAd={updateCommentByAd}
          handleUpdatePost={handleUpdatePost}
            key={comment._id || index}
            comment={comment}
            post={post}
            replyCm={replyComments.filter((cm) => cm.reply === comment._id)}
          />
        );
      })}
      {comments.length - next > 0 ? (
        <div
          onClick={() =>
            setNext((pre) =>
              pre + 5 > comments.length ? comments.length + 1 : pre + 5
            )
          }
          className="dark:text-yellow-500 text-sky-500 ml-2 cursor-pointer font-semibold text-sm"
        >
          Xem thêm bình luận
        </div>
      ) : (
        comments.length > 2 && (
          <div
            onClick={() => setNext((pre) => pre - 5  < 2? 2 : pre -5 )}
            className="dark:text-yellow-500 text-sky-500 ml-2 cursor-pointer font-semibold text-sm"
          >
            Ẩn bớt bình luận
          </div>
        )
      )}
    </div>
  );
}

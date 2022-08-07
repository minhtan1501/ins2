import React, { useEffect, useState } from "react";
import PostThumb from "../PostThumb";

export default function Post({ auth, id, dispatch, profile, data={} }) {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(0);
  useEffect(() => {
    setPosts([...data?.posts]);
    setResult(data?.result);
  }, [data, id]);
  console.log(result);
  return (
    <div className="">
      <PostThumb posts={posts} result={result} />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { getDataApi } from "../../api/userApi";
import LoadMoreBtn from "../LoadMoreBtn";
import PostThumb from "../PostThumb";

export default function Saved({ auth, dispatch }) {
  const [posts, setPosts] = useState([]);
  const [result, setResult] = useState(9);
  const [page, setPage] = useState(2);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    (async ()=>{
        try {
            setLoad(true)
            const res = await getDataApi('get-save-posts',auth.token);
            setPosts([...res.data.posts])
            setResult(res.data.result)
            setLoad(false)

        } catch (error) {
            setLoad(false)
            
        }
    })()
    return () => setPosts([])
  }, [auth]);
  const handleLoadMore = async () => {
    try {
      setLoad(true);
      const res = await getDataApi(
        `get-save-posts?limit=${page * 9}`,
        auth.token
      );

      setPosts([...res.data?.posts]);
      setResult(res.data.result);
      setPage((pre) => pre + 1);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };
  return (
    <div className="">
      {load ? (
        <ImSpinner3
          size={40}
          className="animate-spin dark:text-white text-primary block mx-auto my-3"
        />
      ) : (
        <>
          <PostThumb posts={posts} result={result} />
          <LoadMoreBtn
            result={result}
            page={page}
            handleLoadMore={handleLoadMore}
            load={load}
          />
        </>
      )}
    </div>
  );
}

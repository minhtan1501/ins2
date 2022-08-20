import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDataApi } from "../../api/userApi";
import Container from "../../components/Container";
import PostCard from "../../components/home/post_card/PostCard";

export default function Posts() {
  const [data, setData] = useState([]);
  const auth = useSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      const res = await getDataApi("get-post-by-admin", auth.token);
      setData(res.data.posts);
    })();

    return () => {
      setData([]);
    };
  }, [auth]);

  const handleDeletePostByAd = (post) => {
    const newData = data.filter(d => d._id !== post._id);
    setData(newData);
  }

const updateUiPost = (post) => {
  const newData = data.map(d => d._id === post._id ? post : d);
    setData(newData);
}
  return (
    <>
      <div className="bg-white dark:bg-primary min-h-screen mt-12">
        <Container>
          <div className="grid grid-cols-12 flex-1 gap-3">
            <div className="sm:col-span-10 lg:ml-0 ml-4 col-span-12">
              {data.length > 0 &&
                data.map((d) => <PostCard updateUiPost={updateUiPost} handleDeletePostByAd={handleDeletePostByAd} key={d._id} data={d} auth={auth} />)}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getDataApi } from "../../api/userApi";
import Container from "../../components/Container";
import Info from "../../components/profile/Info";
import Post from "../../components/profile/Post";
import useNotify from "../../hooks/useNotify";
export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user);
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState({posts: [], result:9});
  
  const { setNotify, setLoading } = useNotify();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (id !== auth.profile._id) {
          const { data } = await getDataApi("user/" + id, auth.token);
          setProfile({ ...data.profile });
        } else {
          setProfile({ ...auth.profile });
        }
        const res = await getDataApi(`user_posts/${id}`, auth.token);
        setPosts({posts:[...res.data.posts],result:res.data.result});
        setLoading(false);
      } catch (error) {
        setNotify("error", error.response.data?.msg);
        setLoading(false);
      }
    })();
  }, [id, auth]);
  return (
    <div className="dark:bg-primary bg-white mt-12 min-h-screen">
      <Container className='flex flex-col space-y-2'>
      <Info id={id} auth={auth} profile={profile} dispatch={dispatch} />
      <Post id={id} auth={auth} data={posts} dispatch={dispatch}/>
        
      </Container>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { AiOutlineReload } from "react-icons/ai";
import { useSelector } from "react-redux";
import { getDataApi } from "../../api/userApi";
import UserCard from "../UserCard";
import { ImSpinner3 } from "react-icons/im";
import FollowBtn from "../profile/FollowBtn";
export default function RightSideBar() {
  const {
    user: auth,
    socket: { info: socket },
  } = useSelector((state) => state);
  const [sugges, setSugges] = useState([]);
  const [load, setLoad] = useState(false);

  const fetchData = async () => {
    try {
      setLoad(true);
      const res = await getDataApi("suggestions-user", auth.token);
      setSugges([...res.data.users]);
      setLoad(false);
    } catch (error) {
      setLoad(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <UserCard
        user={auth.profile}
        className="hover:bg-transparent dark:hover:bg-transparent"
      />

      <div className="flex space-x-2 items-center justify-between mx-2">
        <h5 className="dark:text-white text-primary text-lg font-semibold">
          Gợi ý cho bạn
        </h5>
        {!load && (
          <AiOutlineReload
            onClick={() => fetchData()}
            className="cursor-pointer dark:text-white text-primary"
            size={20}
          />
        )}
      </div>
      {load ? (
        <div>
          <ImSpinner3
            className="animate-spin block mx-auto dark:text-white"
            size={30}
          />
        </div>
      ) : (
        <div className="max-h-[50vh] overflow-auto custom-scroll-bar">
          {sugges.map((u, index) => (
            <div key={index}>
              {!auth.profile.following.find((a) => a._id === u._id) && (
                <UserCard
                  user={u}
                  className="dark:hover:bg-transparent hover:bg-transparent"
                >
                  {!auth.profile.following.find((p) => u._id === p._id) && (
                    <FollowBtn user={u} auth={auth} socket={socket} />
                  )}
                </UserCard>
              )}
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
}

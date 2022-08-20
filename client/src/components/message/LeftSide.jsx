import React, { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNotify from "../../hooks/useNotify";
import { getDataApi } from "../../api/userApi";
import UserCard from "../../components/UserCard";
import { useNavigate, useParams } from "react-router-dom";
import messageSlice, { getConversation } from "../../redux/slice/messageSlice";
import { BsFillCircleFill } from "react-icons/bs";
import { useEffect } from "react";

export default function LeftSide() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  const [page, setPage] = useState(0);

  const { user: auth, message, online } = useSelector((state) => state);
  const pageEnd = useRef();
  const navigate = useNavigate();
  const { setNotify } = useNotify();
  const { id } = useParams();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return setSearchUsers([]);
    try {
      const res = await getDataApi(`search?username=${search}`, auth.token);
      setSearchUsers([...res.data.result]);
    } catch (error) {
      setNotify("error", error.response.data?.msg);
    }
  };

  const handleAddUser = (e, user) => {
    setSearch("");
    setSearchUsers([]);
    if (message.users.every((u) => u._id !== user._id)) {
      dispatch(messageSlice.actions.addUser(user));
    }
    navigate(`/message/${user._id}`);
  };

  const isActive = (user) => {
    if (id === user._id) return true;
  };

  useEffect(() => {
    if (message.firstLoad) return;
    (async () => {
      try {
        await dispatch(getConversation({ auth }));
      } catch (error) {}
    })();
  }, [auth, dispatch, message.firstLoad]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(pageEnd.current);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (message.resultUsers >= (page - 1) * 9 && page > 1) {
          const res = await dispatch(getConversation({ auth, page }));
          console.log(res);
        }
      } catch (error) {}
    })();
  }, [message.resultData, page, id, auth, dispatch]);

  useEffect(() => {
    if (message.firstLoad)
      dispatch(messageSlice.actions.checkUserOnline(online.data));
  }, [dispatch, online.data, message.firstLoad]);

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="w-full h-[60px] border-b-[1px] flex justify-between items-center bg-[#f9f9f9] dark:bg-primary px-2"
      >
        <input
          className="bg-transparent outline-none p-2 flex-1 dark:placeholder:text-dark-subtle dark:text-dark-subtle"
          type="text"
          value={search}
          placeholder="Tìm kiếm..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="hidden">
          Tìm kiếm
        </button>
      </form>
      <div className="h-[calc(100%-60px)]">
        {searchUsers?.length !== 0 ? (
          <>
            {searchUsers.map((user) => (
              <div
                onClick={(e) => handleAddUser(e, user)}
                key={user._id}
                className={` hover:dark:bg-[#2e2c2c80] hover:bg-[#f9f9f9] p-4 overflow-hidden border-[1px] ${
                  isActive(user) && "dark:bg-[#2e2c2c80] bg-[#f9f9f9]"
                }`}
              >
                <UserCard user={user} msg={true} />
              </div>
            ))}
          </>
        ) : (
          <>
            {message.users.map((user) => (
              <div
                onClick={(e) => handleAddUser(e, user)}
                key={user._id}
                className={`hover:dark:bg-[#2e2c2c80] hover:bg-[#f9f9f9]  p-4 overflow-hidden border-[1px] ${
                  isActive(user) && "dark:bg-[#2e2c2c80] bg-[#f9f9f9]"
                }`}
              >
                <UserCard msg={true} user={user}>
                  {user.online ? (
                    <BsFillCircleFill size={8} className="text-green-500" />
                  ) : (
                    auth.profile.following.find((i) => i._id === user._id) && (
                      <BsFillCircleFill
                        size={8}
                        className={"dark:text-dark-subtle text-light-subtle"}
                      />
                    )
                  )}
                </UserCard>
              </div>
            ))}
          </>
        )}
        <button ref={pageEnd} className=" opacity-0 w-full">
          Hiện thị thêm
        </button>
      </div>
    </>
  );
}

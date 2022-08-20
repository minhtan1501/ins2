import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDataApi } from "../../api/userApi";
import UserCardAdmin from "../components/UserCardAdmin";

export default function Users() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(2);
  const auth = useSelector((state) => state.user);
  useEffect(() => {
    (async () => {
      try {
        const res = await getDataApi("get-all-users", auth.token);
        setData(res.data.users);
      } catch (error) {}
    })();

    return () => {
      setData([]);
    };
  }, [auth]);

  const handleUpdateData = (d) => {
    const newData = data.map((u) => (u._id === d._id ? d : u));
    setData(newData);
  };

  const handleDeleteData = (d) => {
    const newData = data.filter((u) => u._id !== d._id);
    setData(newData);
  };

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  grid-cols-1 gap-2">
      {!!data.length &&
        data.map((u) => (
          <UserCardAdmin
          handleDeleteData={handleDeleteData}
            handleUpdateData={handleUpdateData}
            auth={auth}
            user={u}
            key={u._id}
          />
        ))}
    </div>
  );
}

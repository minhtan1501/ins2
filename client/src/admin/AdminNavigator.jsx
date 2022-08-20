import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "../components/NotFound";
import NavbarAdmin from "./components/NavbarAdmin";
import Posts from "./pages/Posts";
import Users from "./pages/Users";

function AdminNavigator() {
  
  return (
    <>
      <div className="min-h-screen">
        <div className="flex">
          <div className=" min-h-screen">
            <NavbarAdmin />
          </div>
          <div className="flex-1 mt-2 ml-2">
            <Routes>
              <Route path="/" element={<Users />} />
              <Route path="/users" element={<Users />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminNavigator;

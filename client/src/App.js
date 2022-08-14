import { unwrapResult } from "@reduxjs/toolkit";
import { useRef } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/header/Header";
import PageRender from "./customRouter/PageRender";
import useNotify from "./hooks/useNotify";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { getPosts } from "./redux/slice/postSlide";
import { refreshToken } from "./redux/slice/userSlice";

import { io } from "socket.io-client";
import socketSlice from "./redux/slice/socketSlice";
import SocketClient from "./SocketClient";
import { getNotify } from "./redux/slice/notifySlide";
function App() {
  const auth = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const isLogin = localStorage.getItem("firstLogin");
  const timerId = useRef();
  const { setLoading, setNotify } = useNotify();

  useEffect(() => {
    const refresh_token = async () => {
      try {
        setLoading(true);
        const res = await dispatch(refreshToken());
        unwrapResult(res);
        setLoading(false);
      } catch (err) {
        if (!err === "test") {
          setNotify("error", err);
        }
        setLoading(false);
      }
    };
    refresh_token();
    const socket = io();

    dispatch(socketSlice.actions.updateSocket(socket));

    timerId.current = setInterval(() => {
      if (timerId) clearInterval(timerId);
      refresh_token();
    }, 60 * 1000 * 10);

    return () => {
      clearInterval(timerId);
      socket.close();
    };
  }, []);

  // get posts

  useEffect(() => {
    (async () => {
      try {
        dispatch(getPosts(auth.token));
        dispatch(getNotify({ token: auth.token }));
      } catch (error) {}
    })();
  }, [auth.token]);

  useEffect(() => {
    if (auth.mode === "light") {
      return document.documentElement.classList.remove("dark");
    }
    document.documentElement.classList.add("dark");
  }, [auth.mode]);

  return (
    <>
      {auth?.token && <Header />}
      {auth.token && <SocketClient />}
      <Routes>
        <Route path="/" element={auth?.token ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <Route path="/:page" element={<PageRender />} />
        <Route path="/:page/:id" element={<PageRender />} /> */}

        <Route
          exact
          path="/:page"
          element={isLogin ? <PageRender /> : <Navigate to="/" />}
        />

        <Route
          exact
          path="/:page/:id"
          element={isLogin ? <PageRender /> : <Navigate to="/" />}
        />
      </Routes>
      <div className="mb-12"></div>
    </>
  );
}

export default App;

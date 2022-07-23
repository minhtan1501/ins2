import React from "react";
import { useSelector, useDispatch } from "react-redux";
import notifySlice from "../../redux/slice/notifySlide";
import userSlice from "../../redux/slice/userSlice";
import Loading from "./Loading";
import Toast from "./Toast";
export default function Notify() {
  const { type,msg, loading } = useSelector((state) => state.notify);
  const dispatch = useDispatch();
  const handleClose  = () =>{
    dispatch(notifySlice.actions.clearNotify());
  }

  return (
    <>
      {loading ? <Loading /> : null}
      {!!type ? <Toast handleShow={handleClose} msg={msg}  title={type} /> :null}
    </>
  );
}

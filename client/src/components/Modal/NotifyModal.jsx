import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsBellFill, BsBellSlashFill, BsCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import notifySlice, {
  deleteAllNotifies,
  isReadNotify,
} from "../../redux/slice/notifySlide";
import Avatar from "../Avatar";
import ConfirmModal from "./ConfirmModal";
export default function NotifyModal({ visible, onClose,handleDeleteAll }) {
  const { user: auth, notify } = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      const { parentElement, id = "" } = e.target;
      if (parentElement?.id === "notify-modal" || id === "notify-modal") return;
      onClose();
    };

    document.addEventListener("click", handleClose);

    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);

  const handleSound = () => {
    dispatch(notifySlice.actions.updateSound(!notify.sound));
  };

  const handleIsRead = async (msg) => {
    try {
      await dispatch(isReadNotify({ msg, auth }));
      dispatch(
        notifySlice.actions.updateIsReadNotify({ ...msg, isRead: true })
      );
    } catch (error) {}
  };


  if (!visible) return;
  return (
    <div
      id="notify-modal"
      className="absolute top-[100%]  min-w-[300px] right-0 dark:bg-primary bg-white drop-shadow p-2"
    >
      <div id="notify-modal" className="flex justify-between items-center">
        <h3 className="dark:text-white font-semibold text-2xl">Thông báo</h3>
        {notify.sound ? (
          <BsBellFill
            onClick={handleSound}
            id="notify-modal"
            size={24}
            className="text-[crimson]"
          />
        ) : (
          <BsBellSlashFill
            onClick={handleSound}
            id="notify-modal"
            size={24}
            className="text-[crimson]"
          />
        )}
      </div>
      <hr />
      {!notify.data?.length && (
        <img className="w-full" src="notice.png" alt="Notification" />
      )}
      <div
        style={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}
        className="custom-scroll-bar"
      >
        {notify.data?.map((msg, index) => (
          <div className="px-2 my-3" key={index}>
            <Link
              to={`${msg.url}`}
              className="flex items-center"
              onClick={() => handleIsRead(msg)}
            >
              <div>
                <Avatar url={msg.user?.avatar?.url} size="big" />
              </div>

              <div className="mx-1 flex flex-col">
                <div className="flex-1 space-x-1 dark:text-dark-subtle">
                  <strong className="dark:text-white">
                    {msg.user.userName}
                  </strong>
                  <span>{msg.text}</span>
                </div>
                {msg.content && (
                  <small className="dark:text-dark-subtle">
                    {msg.content.slice(0, 20) + "..."}
                  </small>
                )}
              </div>
              <div className="w-[30px]">
                {msg.image && <Avatar url={msg.image} />}
              </div>
            </Link>
            <small className="flex justify-between px-2">
              <p className="dark:text-dark-subtle">
                {moment(msg.createdAt).fromNow()}
              </p>

              {!msg.isRead && (
                <BsCircleFill size={10} className="text-sky-600" />
              )}
            </small>
          </div>
        ))}
      </div>
      <hr />
      <div className="text-end text-red-600 ">
        <span className="cursor-pointer" onClick={handleDeleteAll}>
          Xóa tất cả
        </span>
      </div>
      
    </div>
  );
}

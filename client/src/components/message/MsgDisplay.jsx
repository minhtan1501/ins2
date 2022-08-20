import React, { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessages } from "../../redux/slice/messageSlice";
import { imageShow, videoShow } from "../../utils/mediaShow";
import Avatar from "../Avatar";
import ConfirmModal from "../Modal/ConfirmModal";
export default function MsgDisplay({ user, msg, data }) {
  const dispatch = useDispatch();
  const { user: auth } = useSelector((state) => state);
  const [visibleModal, setVisibleModal] = useState(false);

  const handleDeleteMessage = async () => {
    try {
      if (data) {
        await dispatch(deleteMessages({ msg, data, auth }));
        setVisibleModal(false);
      }
    } catch (error) {
      setVisibleModal(false);
    }
  };

  return (
    <>
      <div className="mb-[3px] flex space-x-2">
        <Avatar url={user.avatar?.url} size="small" />
        <span className="dark:text-white font-semibold">{user?.userName}</span>
      </div>
      <div className="relative">
        {user._id === auth.profile._id && (
          <AiFillDelete
            onClick={() => setVisibleModal(true)}
            className=" opacity-0 hover:opacity-100 absolute top-[50%] left-[-15px] -translate-y-2/4 text-red-500 "
            size={18}
          />
        )}

        <div>
          {msg?.text && <div className="chat__text">{msg.text}</div>}
          <div className="space-y-2">
            {!!msg.media.length &&
              msg.media.map((item, index) => (
                <div className="" key={index}>
                  {item.url.match(/video/i)
                    ? videoShow(item.url, true)
                    : imageShow(item.url)}
                </div>
              ))}
          </div>
        </div>
      </div>

      {msg?.createdAt && (
        <div className="dark:text-dark-subtle text-sm text-light-subtle">
          {new Date(msg?.createdAt).toLocaleString()}
        </div>
      )}
      <ConfirmModal
        content="Bạn có chắc muốn xóa, hành động này không thể khôi phục lại?"
        handleConfirm={handleDeleteMessage}
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
    </>
  );
}

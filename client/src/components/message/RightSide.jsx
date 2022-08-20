import Picker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { BsFillImageFill } from "react-icons/bs";
import { ImSpinner3 } from "react-icons/im";
import { RiSendPlaneFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import useNotify from "../../hooks/useNotify";
import messageSlice, {
  addMessage,
  deleteConversation,
  getMessages,
} from "../../redux/slice/messageSlice";
import { imageUploadPost } from "../../utils/imageUpload";
import { imageShow, videoShow } from "../../utils/mediaShow";
import UserCard from "../UserCard";
import MsgDisplay from "./MsgDisplay";

export default function RightSide() {
  const {
    user: auth,
    message,
    socket: { info: socket },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [loadMedia, setLoadMedia] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [data, setData] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();
  const { setNotify } = useNotify();
  const messageRef = useRef();
  useEffect(() => {
    if (id && message.users.length > 0) {
      const newUser = message.users.find((user) => user._id === id);
      if (newUser) {
        setUser(newUser);
      }
    }
  }, [message.users, id]);

  const handleChangeMedia = (e) => {
    const files = [...e.target.files];
    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = "File rỗng");

      if (file.size > 1024 * 1024 * 5) {
        return (err = "Ảnh quá lớn!");
      }
      return newImages.push(file);
    });
    if (err) setNotify("error", err);

    setMedia((pre) => (newImages.length ? [...pre, ...newImages] : [...pre]));
    e.target.value = "";
  };

  const handleDeleteMedia = (index) => {
    const newArr = [...media];
    newArr.splice(index, 1);
    setMedia(newArr);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!text.trim() && !media.length) return;
      setLoadMedia(true);
      let newArr = [];
      if (media.length > 0) newArr = await imageUploadPost(media);

      const msg = {
        sender: auth.profile._id,
        recipient: id,
        text,
        media: newArr,
        createdAt: new Date().toISOString(),
      };
      await dispatch(addMessage({ auth, socket, msg }));
      setLoadMedia(false);
      setText("");
      setMedia([]);
    } catch (error) {
      setLoadMedia(false);
    }
  };

  const onEmojiClick = (e, obj) => {
    setText((pre) => pre + obj.emoji);
  };

  // handleLoadMore

  const handleScroll = async (e) => {
    try {
      if (loadMore) return;
      if (e.target.scrollTop === 0 && data.result > data?.messages.length) {
        setLoadMore(true);
        dispatch(messageSlice.actions.updateLoad(true));

        await dispatch(getMessages({ auth, id, page: data.page + 1 }));

        setLoadMore(false);
      } else if (message.load) {
        dispatch(messageSlice.actions.updateLoad(false));
      }
    } catch (error) {
      setLoadMore(false);
    }
  };

  const handleDeleteConversation = async () => {
    try {
      const res = await dispatch(
        deleteConversation({
          auth,
          id,
          data: message.data,
          users: message.users,
        })
      );
      navigate("/message", { replace: true });
    } catch (error) {}
  };
  //get message
  useEffect(() => {
    if (id) {
      const getMessagesData = async () => {
        if (message.data.every((item) => item._id !== id)) {
          setLoadMore(true);
          setData([]);
          const res =  await dispatch(getMessages({ auth, id }));
          setLoadMore(false);
        }
      };
      getMessagesData();
    }
  }, [id, auth, dispatch]);

  useEffect(() => {
    if (messageRef.current?.childNodes.length && !message.load) {
      const div = Array.from(messageRef.current?.childNodes).slice(-1);
      div[0]?.scrollIntoView({
        behavior: "smooth",
      });
    }
    if (message.load) {
      const a = Array.from(
        document.querySelector("#chat__list").childNodes
      ).filter((_, i) => {
        return 9 === i;
      });
      a[0]?.scrollIntoView({
        behavior: "smooth",
      });
      dispatch(messageSlice.actions.updateLoad(false));
    }
  }, [data?.messages, id]);

  useEffect(() => {
    messageRef.current.scrollTo({
      top: window.screen.height,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const newData = message.data.find((item) => item._id === id);
    if (newData) {
      setData({ ...newData });
    }
  }, [message.data, auth.profile, id]);

  return (
    <>
      <div>
        {user.length !== 0 && (
          <UserCard user={user}>
            <AiFillDelete
              onClick={handleDeleteConversation}
              className="text-red-500 hover:opacity-70"
              size={24}
            />
          </UserCard>
        )}
      </div>

      <div
        style={{ height: media.length > 0 ? "calc(100% - 180px)" : "" }}
        className="w-full h-[calc(100%-110px)] px-[10px] flex flex-col justify-end "
      >
        <div
          ref={messageRef}
          id="chat__list"
          className="overflow-auto custom-scroll-bar p-1 "
          onScroll={handleScroll}
        >
          {loadMore && (
            <div className="flex justify-center">
              <ImSpinner3 className="animate-spin dark:text-white" size={24} />
            </div>
          )}
          {!!data?.messages?.length &&
            data?.messages?.map((msg, index) => (
              <div className="" key={index}>
                {msg.sender !== auth.profile._id && (
                  <div className="chat__row other__message">
                    <MsgDisplay user={user} msg={msg} />
                  </div>
                )}
                {msg.sender === auth.profile._id && (
                  <div className="chat__row you__message">
                    <MsgDisplay user={auth.profile} msg={msg} data={data} />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {!!media.length && !loadMedia && (
        <div className="w-full h-[70px] grid messThumb place-items-center gap-[10px] rounded px-[5px] bg-[#f3f3f3]">
          {media.map((item, index) => (
            <div
              className="w-full h-full max-w-[70px] max-h-[70px] relative "
              key={index}
            >
              {item.type.match(/video/i)
                ? videoShow(URL.createObjectURL(item))
                : imageShow(URL.createObjectURL(item))}
              <span
                className="absolute text-[crimson] top-0 right-0 z-10 bg-white border-[1px] border-[crimson] rounded-full cursor-pointer text-[10px] "
                onClick={() => handleDeleteMedia(index)}
              >
                <AiOutlineClose size={12} />
              </span>
            </div>
          ))}
        </div>
      )}
      {openEmoji && (
        <Picker
          disableSearchBar={true}
          pickerStyle={{ width: "100%", height: "200px", boxShadow: "unset" }}
          onEmojiClick={onEmojiClick}
        />
      )}
      {loadMedia && (
        <div className="flex justify-end mr-3">
          <ImSpinner3 className="animate-spin dark:text-white" size={24} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className=" flex items-center justify-between p-[10px] border-[1px] space-x-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Nhập tin nhắn..."
          className="outline-none flex-1 bg-transparent dark:text-white"
        />
        <div
          className="mr-2 hover:opacity-70 cursor-pointer"
          onClick={() => setOpenEmoji((pre) => !pre)}
        >
          😊
        </div>
        <div className="relative mx-2">
          <BsFillImageFill className="dark:text-white" size={20} />
          <input
            className="absolute top-0 left-0 right-0 opacity-0"
            onChange={handleChangeMedia}
            type="file"
            accept="video/*,image/*"
            multiple
          />
        </div>

        <button
          type="submit"
          disabled={text || media.length ? false : true}
          className={`${
            text || media.length > 0 ? "opacity-100" : "opacity-60"
          } dark:text-white `}
        >
          <RiSendPlaneFill size={24} />
        </button>
      </form>
    </>
  );
}

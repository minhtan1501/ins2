import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillCamera, AiOutlineClose } from "react-icons/ai";
import { BsFillImageFill, BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { patchDataApi, postDataApi } from "../../api/userApi";
import useNotify from "../../hooks/useNotify";
import { createNotify } from "../../redux/slice/notifySlide";
import postSlide from "../../redux/slice/postSlide";
import { imageUploadPost } from "../../utils/imageUpload";
import TextareaFiled from "../formFiled/TextareaFiled";
import SubmitBtn from "../SubmitBtn";
import ModalContainer from "./ModalContainer";
import Picker from "emoji-picker-react";
import { imageShow, videoShow } from "../../utils/mediaShow";
export default function StatusModal({
  handleUpdatePost,
  onClose,
  visible,
  post = {},
}) {
  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(false);
  const [tracks, setTracks] = useState("");
  const [busy, setBusy] = useState(false);
  const [openEmoji, setOpenEmoji] = useState(false);

  const videoRef = useRef();
  const refCanvas = useRef();

  const dispatch = useDispatch();
  const {
    user: auth,
    socket: { info: socket },
  } = useSelector((state) => state);
  const { setNotify, setLoading } = useNotify();

  const schema = yup.object().shape({
    content: yup.string().required("Không được bỏ trống"),
  });
  const { handleSubmit, formState, control, reset, getValues } = useForm({
    defaultValues: {
      content: "",
    },
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const handleChangeImages = (e) => {
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

    setImages((pre) => (newImages.length ? [...pre, ...newImages] : [...pre]));
    e.target.value = "";
  };

  // handle delete image
  const deleteImages = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages([...newArr]);
  };

  const handleStream = () => {
    setStream(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
          const track = mediaStream.getTracks();
          setTracks(track[0]);
        })
        .catch((err) => {
          setStream(false);
          setNotify("error", "Không tìm thấy máy ảnh");
        });
    }
  };

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width);
    refCanvas.current.setAttribute("height", height);
    const ctx = refCanvas.current.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, width, height);
    let URL = refCanvas.current.toDataURL();
    setImages([...images, { camera: URL }]);
  };
  const handleStopStream = () => {
    tracks.stop();
    setStream(false);
  };

  const handleOnSubmit = async (e) => {
    let media = [];
    let res;
    try {
      setBusy(true);
      setLoading(true);
      if (Object.keys(post).length) {
        const imgNewUrl = images.filter((img) => !img.url);
        const imgOldUrl = images.filter((img) => img.url);
        if (
          post.content === e.content &&
          imgNewUrl.length === 0 &&
          imgOldUrl.length === post.images.length
        ) {
          setBusy(false);
          setLoading(false);
          return;
        }

        if (imgNewUrl.length > 0) media = await imageUploadPost(imgNewUrl);

        res = await patchDataApi(
          `/posts/${post._id}`,
          { ...e, images: [...imgOldUrl, ...media] },
          auth.token
        );
        dispatch(postSlide.actions.updatePost(res.data?.newPost));
      } else {
        if (images.length < 0) return setNotify("error", "Vui lòng thêm ảnh");

        media = await imageUploadPost(images);

        res = await postDataApi("/posts", { ...e, images: media }, auth.token);

        dispatch(postSlide.actions.createPost(res.data?.post));

        const msg = {
          id: res.data.post._id,
          text: "added a new post.",
          recipients: res.data.post.user.followers,
          url: `/post/${res.data.post._id}`,
          content: e.content,
          image: media[0]?.url,
        };
        dispatch(createNotify({ auth, msg, socket }));
      }
      handleUpdatePost && handleUpdatePost(res.data?.post);

      setLoading(false);
      setNotify("success", res.data?.msg);
      reset();
      setImages([]);
      onClose && onClose();
      if (tracks) tracks.stop();
      setBusy(false);
    } catch (error) {
      setBusy(false);
      console.log(error);
      setNotify("error", error.response?.data?.msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(post).length) {
      setImages([...post.images]);
      reset({ content: post.content });
    }
    return () => {
      setImages([]);
      reset({ content: "" });
      setOpenEmoji(false);
    };
  }, [visible]);


  const onEmojiClick = (e, obj) => {
    reset({ content: getValues("content") + obj.emoji });
  };

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="space-y-3 bg-white dark:bg-primary drop-shadow w-96 p-6 rounded"
      >
        <div className="flex justify-between items-center border-b-[1px] p-1 mb-2">
          <h5 className="text-xl font-semibold dark:text-white text-primary">
            Tạo mới post
          </h5>
          <AiOutlineClose
            onClick={onClose}
            size={20}
            className="font-bold cursor-pointer dark:text-white text-primary"
          />
        </div>
        <div className="space-y-2">
          <TextareaFiled
            className="outline-none min-h-[150px]"
            name="content"
            errors={errors}
            control={control}
          />
          {openEmoji && (
            <Picker
              pickerStyle={{ width: "100%", boxShadow: "unset" }}
              onEmojiClick={onEmojiClick}
            />
          )}

          <div className="place-items-center max-h-[250px] w-full overflow-y-auto space-y-2 custom-scroll-bar grid grid-cols-img gap-4">
            {images.map((i, index) => {
              return (
                <div
                  className="drop-shadow h-full w-full relative rounded overflow-hidden show-img"
                  key={index}
                >
                  {i.camera ? (
                    imageShow(i.camera)
                  ) : i.url ? (
                    <>
                      {i.url.match(/video/i)
                        ? videoShow(i.url)
                        : imageShow(i.url)}
                    </>
                  ) : (
                    <>
                      {i.type.match(/video/i)
                        ? videoShow(URL.createObjectURL(i))
                        : imageShow(URL.createObjectURL(i))}
                    </>
                  )}
                  <span className="absolute inset-0 flex justify-center items-center dark:bg-secondary opacity-70 bg-white">
                    <BsTrash
                      onClick={() => deleteImages(index)}
                      className="text-[crimson] cursor-pointer"
                      size={24}
                    />
                  </span>
                </div>
              );
            })}
          </div>

          {stream && (
            <div className="relative">
              <video
                width="100%"
                height="100%"
                ref={videoRef}
                src=""
                autoPlay
                muted
              />
              <span
                className="absolute top-0 right-0 dark:text-yellow-500 text-sky-500 text-xl font-bold cursor-pointer"
                onClick={handleStopStream}
              >
                &times;
              </span>
              <canvas ref={refCanvas} className="hidden" />
            </div>
          )}

          <div className="flex justify-center cursor-pointer ">
            {stream ? (
              <AiFillCamera
                size={24}
                className="cursor-pointer"
                onClick={handleCapture}
              />
            ) : (
              <>
                <AiFillCamera
                  size={24}
                  className=" dark:text-white hover:opacity-70"
                  onClick={handleStream}
                />
                <div className="overflow-hidden relative mx-2">
                  <BsFillImageFill size={24} className=" dark:text-white " />
                  <input
                    onChange={handleChangeImages}
                    className="absolute inset-0 opacity-0 "
                    type="file"
                    name="file"
                    multiple={true}
                    accept="image/*,video/*"
                  />
                </div>
                <div
                  className="hover:opacity-70"
                  onClick={() => setOpenEmoji((pre) => !pre)}
                >
                  😊
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <SubmitBtn
            busy={busy}
            disabled={busy}
            type="submit"
            className="w-auto px-4 py-2"
          >
            Post
          </SubmitBtn>
        </div>
      </form>
    </ModalContainer>
  );
}

import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillCamera, AiOutlineClose } from "react-icons/ai";
import { BsFillImageFill, BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { postDataApi } from "../../api/userApi";
import useNotify from "../../hooks/useNotify";
import postSlide from "../../redux/slice/postSlide";
import { imageUploadPost } from "../../utils/imageUpload";
import TextareaFiled from "../formFiled/TextareaFiled";
import SubmitBtn from "../SubmitBtn";
import ModalContainer from "./ModalContainer";
export default function StatusModal({ onClose, visible }) {
  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(false);
  const [tracks, setTracks] = useState("");
  const videoRef = useRef();
  const refCanvas = useRef();

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user);
  const { setNotify, setLoading } = useNotify();
  const schema = yup.object().shape({
    content: yup.string().required("Không được bỏ trống"),
  });
  const { handleSubmit, formState, control, reset } = useForm({
    defaultValues: {
      content: "",
    },
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  const handleChangeImages = (e) => {
    console.log(e);
    const files = [...e.target.files];
    let err = "";
    let newImages = [];

    files.forEach((file) => {
      if (!file) return (err = "File rỗng");

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        return (err = "Ảnh không đúng định dạng!");
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
    try {
      if (!images.length) return setNotify("error", "Vui lòng thêm ảnh");
      setLoading(true);
      const media = await imageUploadPost(images);
      const res = await postDataApi(
        "/posts",
        { ...e, images: media },
        auth.token
      );

      dispatch(postSlide.actions.createPost(res.data?.post));
      setLoading(false);
      setNotify("success", res.data?.msg);
      reset();
      setImages([]);
      onClose && onClose();
      if (tracks) tracks.stop();
    } catch (error) {
      setNotify("error", error.response.data?.msg);
      setLoading(false);
    }
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

          <div className="place-items-center max-h-[250px] w-full overflow-y-auto space-y-2 custom-scroll-bar grid grid-cols-img gap-4">
            {images.map((i, index) => {
              return (
                <div
                  className="drop-shadow h-full w-full relative rounded overflow-hidden show-img"
                  key={index}
                >
                  <img
                    className="block w-full h-full object-fill"
                    src={i.camera ? i.camera : URL.createObjectURL(i)}
                    alt=""
                  />
                  <span className="absolute inset-0 flex justify-center items-center bg-secondary opacity-80 backdrop-blur-sm ">
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

          <div className="flex justify-center ">
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
                  className="cursor-pointer"
                  onClick={handleStream}
                />
                <div className="overflow-hidden relative mx-2">
                  <BsFillImageFill size={24} className="cursor-pointer" />
                  <input
                    onChange={handleChangeImages}
                    className="absolute inset-0 opacity-0 "
                    type="file"
                    name="file"
                    multiple={true}
                    accept="image/*"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <SubmitBtn type="submit" className="w-auto px-4 py-2">
            Post
          </SubmitBtn>
        </div>
      </form>
    </ModalContainer>
  );
}

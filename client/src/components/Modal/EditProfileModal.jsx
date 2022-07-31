import React, { useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import FullNameField from "../formFiled/FullNameFiled";
import ModalContainer from "./ModalContainer";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputFiled from "../formFiled/InputFiled";
import StoryFiled from "../formFiled/StoryFiled";
import GenderFiled from "../formFiled/GenderFiled";
import useNotify from "../../hooks/useNotify";
import SubmitBtn from "../SubmitBtn";
import { imageUpload } from "../../utils/imageUpload";
import { patchDataApi } from "../../api/userApi";
import userSlice from "../../redux/slice/userSlice";
export default function EditProfileModal({
  visible,
  onClose,
  user,
  onSuccess,
}) {
  const [avatar, setAvatar] = useState("");
  const { setNotify, setLoading } = useNotify();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.user);
  const schema = yup.object().shape({
    fullName: yup
      .string()
      .required("Họ và tên không được bỏ trống")
      .trim()
      .test("should has at least two words", "Nhập ít nhất 2 từ", (value) => {
        return value.split(" ").length >= 2;
      })
      .max(40, "Họ và tên không vượt quá 40 ký tự"),
    avatar: yup
      .mixed()
      .test("fileSize", "File quá lớn", (value) => {
        if (!value.length) return true;
        return value[0]?.size <= 1024 * 1024;
      })
      .test("fileType", "Ảnh không đúng định dạng", (value) => {
        if (!value.length) return true;
        return (
          value[0]?.type !== "image/jpeg" || value[0]?.type !== "image/png"
        );
      }),
    gender: yup.string().required("Giới tính không được bỏ trống"),
    story: yup.string().max(200, "Giới thiệu không được vượt quá 200 ký tự"),
  });
  const { handleSubmit, register, formState, control, reset, getValues } =
    useForm({
      mode: "onChange",
      defaultValues: {
        fullName: "",
        avatar: {},
        address: "",
        website: "",
        story: "",
        gender: "",
        mobile: "",
      },
      resolver: yupResolver(schema),
    });
  const { errors } = formState;

  const handleChangeAvatar = async ({ target }) => {
    const file = target.files[0];
    setAvatar(file);
  };
  useEffect(() => {
    if (errors["avatar"]) {
      setNotify("error", errors.avatar?.message);
      setAvatar("");
    }
  }, [errors["avatar"]]);

  useEffect(() => {
    if (!visible) return reset();
    reset({
      fullName: user.fullName,
      mobile: user.mobile,
      address: user.address,
      website: user.website,
      story: user.story,
      gender: user.gender,
    });
  }, [user, visible]);

  const handleOnSubmit = async (e) => {
    try {
      let media;
      console.log(e);
      setLoading(true);
      if (e?.avatar) media = await imageUpload(e.avatar);
      const res = await patchDataApi(
        "user",
        {
          ...e,
          avatar: avatar ? media[0] : auth.profile?.avatar,
        },
        auth?.token
      );
      onSuccess && onSuccess({ ...res.data.result });
      dispatch(userSlice.actions.updateProfile({ profile: res.data.result }));
      setNotify("success", res.data?.msg);
      setLoading(false);
      onClose();
    } catch (e) {}
  };
  if (!visible) return null;
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="w-96 dark:bg-primary bg-white p-6 custom-scroll-bar rounded">
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="info_avatar h-36 w-36 overflow-hidden rounded-full cursor-pointer border-[1] my-[15px] mx-auto relative drop-shadow">
            <img
              className="w-full h-full block object-cover"
              src={
                avatar ? URL.createObjectURL(avatar) : auth.profile.avatar?.url
              }
              alt="avatar"
            />
            <span className="absolute bottom-[-100%] left-0 w-full h-full text-center  font-semibold dark:text-yellow-500 transition-all flex flex-col  justify-center items-center text-white">
              <AiOutlineCamera />
              <p>Thay đổi</p>
              <input
                onChange={handleChangeAvatar}
                className="absolute top-0 left-0 w-full h-full cursor-point opacity-0 cursor-pointer"
                type="file"
                name="avatar"
                id="file_up"
                {...register("avatar", {
                  onChange: (e) => handleChangeAvatar(e),
                })}
                accept="image/*"
              />
            </span>
          </div>
          <FullNameField
            errors={errors}
            control={control}
            name="fullName"
            label="Họ và Tên"
          />
          <InputFiled
            errors={errors}
            control={control}
            name="mobile"
            label="Điện thoại"
            type="number"
          />
          <InputFiled
            errors={errors}
            control={control}
            name="address"
            label="Địa chỉ"
          />
          <InputFiled
            errors={errors}
            control={control}
            name="website"
            label="Website"
          />
          <StoryFiled
            errors={errors}
            control={control}
            name="story"
            label="Giới thiệu"
          />
          <GenderFiled
            errors={errors}
            control={control}
            name="gender"
            label="Giới tính"
          />
          <div className="mt-2">
            <SubmitBtn type="submit">Xác nhận</SubmitBtn>
          </div>
        </form>
      </div>
    </ModalContainer>
  );
}

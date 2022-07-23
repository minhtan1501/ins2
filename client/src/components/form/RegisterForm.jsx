import React from "react";
import CustomLink from "../CustomLink";
import InputFiled from "../formFiled/InputFiled";
import PasswordFiled from "../formFiled/PasswordFiled";
import SubmitBtn from "../SubmitBtn";
import FormContainer from "./FormContainer";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import GenderFiled from "../formFiled/GenderFiled";
import { register } from "../../redux/slice/userSlice";
import useNotify from "../../hooks/useNotify";
import { unwrapResult } from "@reduxjs/toolkit";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const {setLoading,setNotify} = useNotify();
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email không được bỏ trống")
      .email("Email không đúng định dạng"),
    password: yup
      .string()
      .required("Mật khẩu không được bỏ trống")
      .min(8, "Mật khẩu tối thiểu 8 ký tự"),
    userName: yup
      .string()
      .required("User name không được bỏ trống")
      .min(6, "User name tối thiểu 6 ký tự"),
    "new-password": yup
      .mixed()
      .required("Mật khẩu không được bỏ trống")
      .oneOf([yup.ref("password")], "Nhập lại mật khẩu không trùng khớp"),
    gender: yup.string().required("Giới tính không được bỏ trống"),
    fullName: yup
      .string()
      .required("Họ và tên không được bỏ trống")
      .trim()
      .test(
        "should has at least two words",
        "Nhập ít nhất 2 từ",
        (value) => {
          return value.split(" ").length >= 2;
        }
      ).max(40,"Họ và tên không vượt quá 40 ký tự"),
  });
  const { handleSubmit, formState, control } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      "new-password": "",
      fullName: "",
      userName: "",
      gender: "",
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = async (e) => {
   try {
    setLoading(true)
     const res =  await dispatch(register(e))
     unwrapResult(res)
     setLoading(false)
   } catch (error) {
      setNotify('error',error);
      setLoading(false)
   }
  };
  const { errors } = formState;
  return (
    <FormContainer>
      <div className="space-y-3">
        <form
          action=""
          className="bg-white dark:bg-secondary drop-shadow w-96 flex space-y-2 flex-col p-6 rounded"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex justify-center">
            <img className="dark:brightness-[10]" src="logoins.png" alt="" />
          </div>
          <InputFiled
            name="email"
            label="Email"
            control={control}
            errors={errors}
          />
          <InputFiled
            name="fullName"
            label="Họ và Tên"
            control={control}
            errors={errors}
          />
          <InputFiled
            name="userName"
            label="User Name"
            control={control}
            errors={errors}
          />
          <PasswordFiled
            name="password"
            label="Mật khẩu"
            control={control}
            errors={errors}
          />
          <PasswordFiled
            name="new-password"
            label="Xác nhận mật khẩu"
            control={control}
            errors={errors}
          />
          <GenderFiled control={control} name="gender" errors={errors} />
          <SubmitBtn disabled={!formState.isValid} type="submit">
            Đăng kí
          </SubmitBtn>
        </form>
        <div className="bg-white drop-shadow w-96 p-4 text-center rounded dark:bg-secondary">
          <span className="dark:text-dark-subtle text-light-subtle">
          Đã có tài khoản!{" "}
            </span> 
          <CustomLink className="text-submit-btn dark:text-yellow-500" path="/login">
            Đăng nhập
          </CustomLink>
        </div>
      </div>
    </FormContainer>
  );
}

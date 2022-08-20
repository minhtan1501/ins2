import { yupResolver } from "@hookform/resolvers/yup";
import { unwrapResult } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import useNotify from "../../hooks/useNotify";
import { login } from "../../redux/slice/userSlice";
import CustomLink from "../CustomLink";
import InputFiled from "../formFiled/InputFiled";
import PasswordFiled from "../formFiled/PasswordFiled";
import SubmitBtn from "../SubmitBtn";
import FormContainer from "./FormContainer";
export default function LoginForm() {
  const { setLoading, setNotify } = useNotify();
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email không được bỏ trống")
      .email("Email không đúng định dạng"),
    password: yup
      .string()
      .required("Mật khẩu không được bỏ trống")
      .min(8, "Mật khẩu tối thiểu 8 ký tự"),
  });
  const { handleSubmit, formState, control } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = async (e) => {
    try {
      setLoading(false);
      const res = await dispatch(login(e));
      unwrapResult(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setNotify("error", error);
      setLoading(false);
    }
  };
  const { errors } = formState;
  return (
    <FormContainer>
      <div className="space-y-3">
        <form
          action=""
          className="bg-white dark:bg-secondary drop-shadow w-72 flex space-y-2 flex-col p-6 rounded"
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
          <PasswordFiled
            name="password"
            label="Password"
            control={control}
            errors={errors}
          />
          <SubmitBtn disabled={!formState.isValid} type="submit">
            Đăng nhập
          </SubmitBtn>
          <div className="flex items-center">
            <div className="flex-1 bg-[#dbdbdb] h-[1px]"></div>
            <p className="px-2 text-sm text-[#dbdbdb]">OR</p>
            <div className="flex-1 bg-[#dbdbdb] h-[1px]"></div>
          </div>
          <div className="flex justify-center">
            <CustomLink className="text-[12px] text-[#00376b] dark:text-yellow-400" path="/forgetpassword">
              Quên mật khẩu?
            </CustomLink>
          </div>
        </form>
        <div className="bg-white dark:bg-secondary rounded drop-shadow w-72 p-4 text-center">
          <span className="dark:text-dark-subtle text-light-subtle">Chưa có tài khoản?</span>
          <CustomLink className="text-submit-btn dark:text-yellow-500" path="/register">
           {" "} Đăng kí
          </CustomLink>
        </div>
      </div>
    </FormContainer>
  );
}

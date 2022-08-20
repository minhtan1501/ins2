import React, { useState } from "react";
import InputFiled from "../components/formFiled/InputFiled";
import CustomLink from "../components/CustomLink";
import useNotify from "../hooks/useNotify";
import FormContainer from "../components/form/FormContainer";
import Container from "../components/Container";
import SubmitBtn from "../components/SubmitBtn";
import Title from "../components/Title";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { postDataApi } from "../api/userApi";
function ForgetPassword() {
  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email không được bỏ trống")
      .email("Email không đúng định dạng"),
  });
  const { handleSubmit, formState, control, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const { setNotify } = useNotify();
  const [loading, setLoading] = useState(false);

  const handleOnSubmit = async (e) => {
    try {
      setLoading(true);
      const res = await postDataApi("forget-password", { email: e.email });
      setNotify("success", res.data.msg);
      reset();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setNotify("error", err.response.data?.msg);
    }
  };
  const { errors } = formState;
  return (
    <FormContainer>
      <Container className="space-y-2">
        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          action=""
          className={
            " w-72 space-y-2 dark:bg-secondary bg-white drop-shadow p-4 rounded"
          }
        >
          <Title>Vui lòng nhập email</Title>
          <InputFiled
            control={control}
            name="email"
            label="Email"
            errors={errors}
          />
          <SubmitBtn type="submit" busy={loading}>Khôi phục</SubmitBtn>
          <div className="flex justify-between">
            <CustomLink path="/register">Đăng ký</CustomLink>
            <CustomLink path="/login">Đăng nhập</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default ForgetPassword;

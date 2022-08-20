import React, { useEffect, useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormContainer from "../components/form/FormContainer";
import Container from "../components/Container";
import useNotify from "../hooks/useNotify";
import Title from "../components/Title";
import SubmitBtn from "../components/SubmitBtn";
import { postDataApi } from "../api/userApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PasswordFiled from "../components/formFiled/PasswordFiled";

function ResetPassword() {
  const schema = yup.object().shape({
    password: yup
      .string()
      .required("Mật khẩu không được bỏ trống")
      .min(8, "Mật khẩu tối thiểu 8 ký tự"),
    "confirm-password": yup
      .mixed()
      .required("Mật khẩu không được bỏ trống")
      .oneOf([yup.ref("password")], "Nhập lại mật khẩu không trùng khớp"),
  });
  const { handleSubmit, formState, control } = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
      "confirm-password": "",
    },
    resolver: yupResolver(schema),
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const { setNotify } = useNotify();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    try {
      console.log(e);
      setLoading(true);
      const res = await postDataApi("reset-password", {
        password: e.password,
        userId: id,
      });
      setNotify("success", res.data.msg);
      setLoading(false);
      navigate("/login", { replace: true });
    } catch (err) {
      setLoading(false);
      setNotify("error", err.response?.data?.msg);
    }
  };

  const isValidToken = async () => {
    try {
      if (token && id) {
        const res = await postDataApi("verify-pass-reset-token", { token, id });
        console.log(res);
        setIsVerifying(false);
        if (!res.data.valid) {
          setIsValid(false);
        }
        setIsValid(true);
      }
    } catch (err) {
      navigate("/forgetpassword", { replace: true });
      setNotify("error", err.response.data?.msg);
    }
  };

  useEffect(() => {
    isValidToken();
  }, [token, id]);

  if (!isValid) {
    return (
      <FormContainer>
        <Container>
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary ">
              Sorry the token is invalid
            </h1>
          </div>
        </Container>
      </FormContainer>
    );
  }

  if (isVerifying) {
    return (
      <FormContainer>
        <Container>
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary ">
              Please wait we are verifying your token!
            </h1>
            <ImSpinner3 className="text-primary dark:text-white animate-spin text-4xl" />
          </div>
        </Container>
      </FormContainer>
    );
  }

  const { errors } = formState;
  return (
    <FormContainer>
      <Container>
        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          action=""
          className={
            " w-96 space-y-2 bg-white dark:bg-primary drop-shadow p-4 rounded "
          }
        >
          <Title>Nhập mật khẩu mới</Title>
          <PasswordFiled
            name="password"
            control={control}
            errors={errors}
            label="Mật khẩu"
          />
          <PasswordFiled
            name="confirm-password"
            control={control}
            errors={errors}
            label="Xác nhận mật khẩu"
          />
          <SubmitBtn type="submit" disabled={!formState.isValid} busy={loading}>
            Xác nhận
          </SubmitBtn>
        </form>
      </Container>
    </FormContainer>
  );
}

export default ResetPassword;

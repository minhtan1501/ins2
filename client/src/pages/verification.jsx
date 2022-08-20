import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// import { commonModalClasses } from '../../utils/theme';
import { useNavigate } from "react-router-dom";
// import { resendEmailVerificationToken, verifyEmail } from '../../api/auth';
import { useDispatch, useSelector } from "react-redux";
// import { parseError } from '../../utils/helper';
import useNotify from "../hooks/useNotify";
import FormContainer from "../components/form/FormContainer";
import Container from "../components/Container";
import SubmitBtn from "../components/SubmitBtn";
import Title from "../components/Title";
import { postDataApi } from "../api/userApi";
import userSlice from "../redux/slice/userSlice";
const isValidOTP = (otp) => {
  let valid = false;
  for (let item of otp) {
    valid = !isNaN(parseInt(item));
    if (!valid) break;
  }
  return valid;
};

function Verification() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState("");
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // get state from singup
  const stateUser = state?.user;
  const { user: auth } = useSelector((state) => state);
  // notification
  const { setNotify } = useNotify();
  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };
  const focusPreInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;

    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }, index) => {
    const { value } = target;
    const newOTP = [...otp];
    if (!value) {
      newOTP[index] = "";
      return setOtp(newOTP);
    }
    newOTP[index] = value.substring(value.length - 1, value.length);
    if (!value) focusPreInputField(index);
    else focusNextInputField(index);
    setOtp(newOTP);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "") {
      focusPreInputField(index);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (!isValidOTP(otp)) {
        setLoading(false);
        return setNotify("error", "Mã xác thực không hợp lệ");
      }
      const res = await postDataApi("verify-email", {
        otp: otp.join(""),
        userId: stateUser,
      });
      dispatch(userSlice.actions.verifyEmail());
      setNotify("success", res.data.msg);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setNotify("error", error.response.data?.msg);
    }
  };

  const handleOTPResend = async () => {
    try {
      setLoading(true);
      const res = await postDataApi(
        "/resend-verify-email",
        { userId: stateUser },
        auth.token
      );
      setNotify("success", res.data.msg);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
      setNotify("error", error.response.data?.msg);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  // check user
  useEffect(() => {
    if (!stateUser) navigate("/not-found");
    if (auth.profile?.isVerify) navigate("/");
  }, [stateUser, navigate, auth.profile.isVerify]);
console.log(state);
  return (
    <FormContainer>
      <Container className=" dark:bg-secondary drop-shadow bg-white p-4 rounded">
        <form onSubmit={handleSubmit} action="">
          <Title>Vui lòng nhập mã xác thực tài khoản</Title>
          <p className="text-center text-primary  dark:text-dark-subtle">
            Mã OTP đã được gửi đến email của bạn!
          </p>
          <div className=" my-2 flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex === index ? inputRef : null}
                  key={index}
                  type="number"
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="text-center focus:border-primary text-primary font-semibold text-xl dark:text-white w-12 h-12 border-2 border-light-subtle dark:border-dark-subtle dark:focus:border-white rounded bg-transparent outline-none"
                />
              );
            })}
          </div>
          <div>
            <SubmitBtn type="submit" disabled={loading} busy={loading}>
              Xác thực tài khoản
            </SubmitBtn>
            <button
              type="button"
              onClick={handleOTPResend}
              className="dark:text-white font-semibold mt-2  hover:underline text-blue-500 "
            >
              Bạn chưa nhận được mã?
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}

export default Verification;

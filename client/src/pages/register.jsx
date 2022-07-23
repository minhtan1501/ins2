import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import RegisterForm from "../components/form/RegisterForm";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const auth = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (auth?.token) navigate("/", { replace: true });
  }, [auth?.token]);
  return <RegisterForm />;
}

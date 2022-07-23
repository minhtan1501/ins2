import { Route, Navigate } from "react-router-dom";
export default function PrivateRouter({ props }) {
  const firstLogin = localStorage.getItem("firstLogin");

  return firstLogin ? <Route {...props} /> : <Navigate to="/" />;
}

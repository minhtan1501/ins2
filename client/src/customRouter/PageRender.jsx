import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import NotFound from "../components/NotFound";
const generatePage = (pageName) => {
  const component = () => require(`../pages/${pageName}`).default;
  try {
    return React.createElement(component());
  } catch (err) {
    return <NotFound />;
  }
};

export default function PageRender() {
  const { page, id } = useParams();
  const auth = useSelector((state) => state.user);
  let pageName = "";
  if (auth?.token) {
    if (id) {
      pageName = `${page}/[id]`;
    } else {
      pageName = `${page}`;
    }
  }
  return <>{generatePage(pageName)}</>;
}

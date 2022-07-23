import { useState } from "react";
import {
  AiFillCompass,
  AiFillHome,
  AiOutlineCompass,
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdFavorite, MdNearMe, MdOutlineNearMe } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import userSlice, { logout } from "../../redux/slice/userSlice";
import SearchModal from "../Modal/SearchModal";
import UserMenu from "./UserMenu";
const navLink = [
  {
    label: "Trang chủ",
    Icon: AiOutlineHome,
    Active: AiFillHome,
    path: "/",
  },
  {
    label: "Tin nhắn",
    Icon: MdOutlineNearMe,
    Active: MdNearMe,
    path: "/message",
  },
  {
    label: "Discover",
    Icon: AiOutlineCompass,
    Active: AiFillCompass,
    path: "/discover",
  },
  {
    label: "Thông báo",
    Icon: AiOutlineHeart,
    Active: MdFavorite,
    path: "/notify",
  },
];

export default function Menu({ openModalSearch }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const onProfile = () => {
    navigate("/profile/" + user.profile?._id, { replace: true });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
    } catch (error) {}
  };

  const handleOnChangeTheme = () => {
    dispatch(userSlice.actions.changeMode());
  };

  return (
    <>
      <div className="flex items-center space-x-5">
        <AiOutlineSearch
          size={24}
          className="md:hidden dark:text-white"
          onClick={openModalSearch}
        />
        {navLink.map(({ label, Icon, path, Active }) => {
          return (
            <Link to={path} key={label}>
              {pathname === path ? (
                <Active className="dark:text-white" size={24} />
              ) : (
                <Icon className="dark:text-white" size={24} />
              )}
            </Link>
          );
        })}
        <UserMenu
          onChangeTheme={handleOnChangeTheme}
          onLogout={handleLogout}
          onProfile={onProfile}
        />
      </div>
    </>
  );
}

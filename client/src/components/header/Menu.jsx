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
import NotifyModal from "../Modal/NotifyModal";
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
];

const notify = {
  label: "Thông báo",
  Icon: AiOutlineHeart,
  Active: MdFavorite,
  path: "/notify",
};

export default function Menu({ openModalSearch }) {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visibleNotifyModal, setVisibleNotifyModal] = useState(false);
  const { user, notify } = useSelector((state) => state);
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

  const handleOpenModalNotify = (e) =>{
    e.stopPropagation()
    setVisibleNotifyModal(true);
  }

  const handleCloseModalNotify = () =>{
    setVisibleNotifyModal(false);
  }
  return (
    <>
      <div className="flex items-center space-x-5 relative">
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
        <div className="relative cursor-pointer">
          {visibleNotifyModal ? (
            <MdFavorite size={24} className="dark:text-white"  onClick={handleCloseModalNotify}/>
          ) : (
            <AiOutlineHeart size={24} className="dark:text-white"  onClick={handleOpenModalNotify}/>
          )}
          <p className=" select-none absolute top-0 right-[-5px] -translate-y-1/2 text-white  px-[5px] text-sm rounded-full font-semibold bg-[crimson]">
            {notify.data?.length
              ? notify.data.length > 5
                ? "5+"
                : notify.data.length
              : null}
          </p>
        </div>
        <NotifyModal visible={visibleNotifyModal} onClose={handleCloseModalNotify}/>

        <UserMenu
          onChangeTheme={handleOnChangeTheme}
          onLogout={handleLogout}
          onProfile={onProfile}
        />
      </div>
    </>
  );
}

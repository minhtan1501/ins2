import { useEffect, useRef, useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { CgDarkMode, CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import Avatar from "../Avatar";
export default function UserMenu({
  onProfile,
  onChangeTheme = null,
  onLogout = null,
}) {
  const auth = useSelector((state) => state.user);
  const options = [
    {
      title: "Thông tin",
      onClick: onProfile,
      icon: CgProfile,
    },
    {
      title: auth.mode === "light" ? "Chế độ tối" : "Chế độ sáng",
      onClick: onChangeTheme,
      icon: CgDarkMode,
    },
    {
      title: "Đăng xuất",
      onClick: onLogout,
      icon: BiLogOut,
    },
  ];
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center">
      <div className="relative ">
        <Avatar
        className="cursor-pointer"
          url={auth.profile?.avatar?.url}
          onClick={() => setVisible((pre) => !pre)}
        />
      <CreateOptions
        options={options}
        visible={visible}
        onClose={() => setVisible(false)}
      />
      </div>
    </div>
  );
}

const CreateOptions = ({ options, visible, onClose }) => {
  const container = useRef();
  const containerId = "option-container";
  useEffect(() => {
    const handleClose = (e) => {
      if (!visible) return;
      const { parentElement, id = "" } = e.target;

      if (parentElement?.id === containerId || id === containerId) return;

      if (!container.current.classList.contains("animate-scale")) {
        container.current.classList.add("animate-scale-reverse");
      }
    };

    document.addEventListener("click", handleClose);

    return () => {
      document.removeEventListener("click", handleClose);
    };
  }, [visible]);
  const handleAnimationEnd = (e) => {
    if (e.target.classList.contains("animate-scale-reverse")) onClose();
    e.target.classList.remove("animate-scale");
  };
  const handleClick = (fn) => {
    fn();
    onClose();
  };
  if (!visible) return null;
  return (
    <div
      ref={container}
      id={containerId}
      className="animate-scale  min-w-max
      absolute bg-white dark:bg-secondary
      text-base py-2
      list-none text-left rounded-lg
      drop-shadow z-50 
      bg-clip-padding top-full
      border-none right-2 "
      onAnimationEnd={handleAnimationEnd}
    >
      <ul className="">
        {options.map(({ title, onClick, icon }) => {
          return (
            <Option
              key={title}
              onClick={() => handleClick(onClick)}
              Icon={icon}
            >
              {title}
            </Option>
          );
        })}
      </ul>
    </div>
  );
};

const Option = ({ children, onClick, Icon }) => {
  return (
    <li>
      <div
        className="
              text-sm py-2 px-4
              font-normal block w-full cursor-pointer
              whitespace-nowrap bg-transparent hover:bg-dark-subtle
              dark:text-white  border-b-[1px] dark:border-dark-subtle
              "
        onClick={onClick}
      >
        <div className=" flex justify-between items-center space-x-2">
          <div>
            <Icon size={20} />
          </div>
          <div className="font-semibold">{children}</div>
        </div>
      </div>
    </li>
  );
};

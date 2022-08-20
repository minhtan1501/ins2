import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteAllNotifies } from "../../redux/slice/notifySlide";
import Container from "../Container";
import SearchFiled from "../formFiled/SearchFiled";
import ConfirmModal from "../Modal/ConfirmModal";
import SearchModal from "../Modal/SearchModal";
import Menu from "./Menu";

export default function Header() {
  const [visible, setVisible] = useState(false);
  const [openModalCf, setOpenModalCf] = useState(false);
  const {user:auth,notify} = useSelector(state => state);
  const dispatch = useDispatch();
  const openModalSearch = () => {
    setVisible(true);
  };

  const hideModalSearch = () => {
    setVisible(false);
  };
  const handleDeleteAll = (e) => {
    e.stopPropagation();
    const newArr = notify.data.filter((item) => item.isRead === false);
    if (newArr.length === 0) return setOpenModalCf(true);
  };
  const handleConfirmDeleteAll = async () => {
    try {
      await dispatch(deleteAllNotifies(auth.token));
      setOpenModalCf(false);
    } catch (err) {}
  };
  return (
    <>
      <nav className="p-2 bg-[#ffffff] dark:bg-secondary drop-shadow fixed z-50 top-0 left-0 right-0">
        <Container>
          <div className="flex items-center justify-between w-full">
            <div className="max-w-[100px]">
              <Link to="/">
                <img
                  onClick={() => window.scrollTo({ top: 0 })}
                  className="w-full dark:brightness-[10]"
                  src="logoins.png"
                  alt=""
                />
              </Link>
            </div>
            <div className="min-w[220px] w-[220px] md:block hidden">
              <SearchFiled />
            </div>

            <Menu handleDeleteAll={handleDeleteAll} openModalSearch={openModalSearch} />
          </div>
        </Container>
      </nav>
      <ConfirmModal
          handleConfirm={handleConfirmDeleteAll}
          onClose={() => setOpenModalCf(false)}
          content="Hành động này sẽ xóa toàn bộ thông báo, bạn chắc chứ?"
          visible={openModalCf}
        />
      <SearchModal visible={visible} onClose={hideModalSearch} />
    </>
  );
}

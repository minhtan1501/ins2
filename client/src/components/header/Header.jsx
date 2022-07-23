import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../Container";
import SearchFiled from "../formFiled/SearchFiled";
import SearchModal from "../Modal/SearchModal";
import Menu from "./Menu";

export default function Header() {
  const [visible,setVisible] = useState(false);
  const openModalSearch = () =>{
    setVisible(true);
  }

  const hideModalSearch = () =>{
    setVisible(false)
  }
  return (
    <>
    <nav className="p-2 bg-[#ffffff] dark:bg-secondary drop-shadow relative z-50">
      <Container>
        <div className="flex items-center justify-between w-full">
          <div className="max-w-[100px]">
            <Link to="/">
              <img
                className="w-full dark:brightness-[10]"
                src="logoins.png"
                alt=""
              />
            </Link>
          </div>
          <div className="min-w[220px] w-[220px] md:block hidden">
            <SearchFiled />
          </div>

          <Menu openModalSearch={openModalSearch}/>
        </div>
      </Container>
    </nav>
    <SearchModal visible={visible} onClose={hideModalSearch}/>
    </>
  );
}

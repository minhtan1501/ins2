import { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { ImSpinner3 } from "react-icons/im";
import { useSelector } from "react-redux";
import { getDataApi } from "../../api/userApi";
import debounce from "../../utils/debounce";
import UserCard from "../UserCard";
let timer;
export default function SearchFiled({ className, onClose = null }) {
  const [value, setValue] = useState("");
  const [visibleInput, setVisibleInput] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const refInput = useRef();
  const [users, setUsers] = useState([]);
  const auth = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const handleOnChange = ({ target }) => {
    if (timer) clearTimeout(timer);
    setLoading(true);
    if (!target.value) setLoading(false);
    setValue(target.value?.toLowerCase().replace(/ /g, ""));
  };

  const handleSearch = async () => {
    if (value) {
      setLoading(true);
      const res = await getDataApi(`search?username=${value}`, auth.token);
      setLoading(false);
      setUsers([...res.data?.result]);
    } else {
      setLoading(true);
      setUsers([]);
    }
  };

  const searchDebounce = debounce(handleSearch, 500);
  useEffect(() => {
    searchDebounce();
  }, [value,visibleInput]);

  const handleCloseSearch = async (e) => {
    setValue("");
    setUsers([]);
    setVisibleInput(false);
  };

  const handleSelected = () => {
    if (onClose) onClose();
    setVisibleInput(false);
    setInputFocus(false);
    setUsers([]);
  };

  const handleVisibleInput = async ({ target }) => {
    if (target?.closest("#visible-input")) {
      setVisibleInput(true);
      setInputFocus(true);
      setLoading(true);
    } else {
      setVisibleInput(false);
      setInputFocus(false);
      setUsers([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer) clearTimeout(timer);
    if (loading) {
      timer = setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    return () => {
      setLoading(false);
      clearTimeout(timer);
    };
  }, [loading]);

  // handle focus and blur
  useEffect(() => {
    document.documentElement.addEventListener("click", handleVisibleInput);

    return () => {
      document.documentElement.removeEventListener("click", handleCloseSearch);
    };
  }, []);

  useEffect(() => {
    if (visibleInput) refInput.current?.focus();
  }, [visibleInput]);
  return (
    <div
      id="visible-input"
      className={
        className +
        `
       rounded h-[36px] w-full
      bg-[#EFEFEF] dark:bg-secondary transition
      border-2 dark:border-dark-subtle  
      p-3 flex items-center  relative cursor-pointer` +
        (inputFocus ? "dark:border-[#ffffff] " : "")
      }
    >
      {!visibleInput ? (
        <div className="flex items-center w-full " id="visible-input">
          <AiOutlineSearch size={20} className="text-gray-400 " />
          <p className="dark:text-dark-subtle text-light-subtle">
            {value?.length > 16 ? value?.slice(0, 16) + "..." : value}
          </p>
        </div>
      ) : null}
      <div
        className={
          "flex items-center justify-between " +
          (visibleInput ? "block" : "hidden")
        }
      >
        <input
          ref={refInput}
          value={value}
          onChange={handleOnChange}
          type="text"
          className="bg-transparent outline-none dark:text-white text-light-subtle flex-1 "
        />
        <div onClick={handleCloseSearch}>
          <AiFillCloseCircle className="text-gray-400 cursor-pointer fixed -translate-y-2/4" />
        </div>
      </div>
      {visibleInput ? (
        <div className="search-results rounded w-80 bg-white drop-shadow top-full mt-3 left-0 dark:bg-secondary -translate-x-10 absolute z-50 custom-scroll-bar">
          {users.map((u) => {
            return (
              <div
                className="border-b-[1px] dark:border-b-[#ccc] p-2"
                key={u._id}
              >
                <UserCard user={u} handleSelected={handleSelected} />
              </div>
            );
          })}
          <div
            className={
              "overlay-search flex items-center justify-center fixed inset-0 " +
              (users.length > 0 ? "hidden" : "block")
            }
          >
            {loading ? (
              <ImSpinner3
                size={24}
                className="animate-spin dark:text-dark-subtle"
              />
            ) : (
              <h1 className="dark:text-dark-subtle text-light-subtle text-xl font-semibold">
                Không tìm thấy kết quả nào
              </h1>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

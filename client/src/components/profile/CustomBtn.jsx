import React from "react";

export default function CustomBtn({ children, onClick,className='' }) {
  return (
    <button
    onClick={onClick}
      className={` outline-none border-[1px] p-2 rounded 
                  border-sky-400 text-sky-400 dark:text-yellow-500
                   dark:border-yellow-500 font-semibold text-sm 
                   dark:hover:bg-yellow-500 hover:bg-sky-500
                   dark:hover:text-black hover:text-white transition ${className}`}
    >
      {children}
    </button>
  );
}

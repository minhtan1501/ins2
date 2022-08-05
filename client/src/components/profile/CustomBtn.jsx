import React from "react";

export default function CustomBtn({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={` outline-none border-[1px] p-2 rounded 
                    font-semibold text-sm
                   dark:hover:text-black hover:text-white transition ${className}`}
    >
      {children}
    </button>
  );
}

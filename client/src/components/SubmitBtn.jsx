import React from "react";

export default function SubmitBtn({ disabled, children, type = "button",className =''}) {
  return (
    <button
      className={"w-full bg-submit-btn dark:bg-yellow-500 dark:text-primary disabled:opacity-40 p-1 rounded text-white font-semibold " + className }
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

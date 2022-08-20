import React from "react";
import {ImSpinner3} from  'react-icons/im'
export default function SubmitBtn({ disabled,onClick=null, children, type = "button",className ='',busy = false}) {
  return (
    <button
      className={"w-full bg-submit-btn dark:bg-yellow-500 dark:text-primary disabled:opacity-40 p-1 rounded text-white font-semibold " + className }
      disabled={disabled}
      type={type}
    >
      {busy ? <span className="flex justify-center"><ImSpinner3 className="animate-spin dark:text-primary text-white " size={20}/></span>:children}
    </button>
  );
}

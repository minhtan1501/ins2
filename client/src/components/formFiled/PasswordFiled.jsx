import React, { useState } from "react";
import { useRef } from "react";
import { Controller } from "react-hook-form";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineVisibility } from "react-icons/md";
export default function PasswordFiled({
  errors,
  placeholder,
  label,
  name,
  control,
}) {
  const [visible, setVisible] = useState(false);
  const [focusInput, setFocusInput] = useState(false);
  const ref = useRef();
  const handleOnFocus = () => {
    ref.current.classList.remove("dark:border-secondary");
    ref.current.classList.remove("border-light-subtle");

    ref.current.classList.add("dark:border-white");
    ref.current.classList.add("border-primary");

    setFocusInput(true);
  };
  const handleOnBlur = () => {
    ref.current.classList.remove("dark:border-white");
    ref.current.classList.remove("border-primary");

    ref.current.classList.add("border-light-subtle");
    ref.current.classList.add("dark:border-dark-subtle");

    setFocusInput(false);
  };
  const handleOnClick = () => {
    setVisible((pre) => !pre);
  };
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className={`
        transition
        font-semibold dark:text-dark-subtle text-light-subtle
        self-start ${focusInput ? "dark:text-white text-primary" : null}
              `}
      >
        {label}
      </label>
      <div
        ref={ref}
        className={`
        flex items-center 
        space-x-1 border-2 p-1 dark:border-dark-subtle border-light-subtle 
        rounded transition ${errors[name] ? 'border-red-600':null}`}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
            {...field}
              onFocus={handleOnFocus}
              onBlur={(handleOnBlur)}
              placeholder={placeholder}
              type={visible ? "text" : "password"}
              className="
              outline-none rounded 
              text-lg dark:text-white 
              bg-transparent peer flex-1"
            />
          )}
        />
        {
          control._formValues[name] ? (
            visible ? (
              <AiOutlineEyeInvisible className="text-dark-subtle text-light-subtle" size={20} onClick={handleOnClick} />
            ) : (
              <MdOutlineVisibility className="text-dark-subtle text-light-subtle" size={20} onClick={handleOnClick} />
            )
          ): null
        }
       
      </div>
      {errors[name] ? (
        <p className="text-red-500 text-[12px]">{errors[name]?.message}</p>
      ) : null}
    </div>
  );
}

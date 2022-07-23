import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
export default function StoryFiled({
  errors,
  placeholder = '',
  label,
  name,
  control,
}) {
  const [focusInput, setFocusInput] = useState(false);
  const ref = useRef();
  const handleOnFocus = () => {
    ref.current.classList.remove("dark:border-dark-subtle");
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
  const handleOnChange = (field, { target }) => {
    if (target.value?.length > 200) return;
    field.onChange(target.value);
  };
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className={`
            transition
            font-semibold dark:text-dark-subtle text-light-subtle
            self-start ${focusInput ? "text-primary dark:text-white" : null}
              `}
      >
        {label}
      </label>
      <div
        ref={ref}
        className={`
        flex items-center 
        space-x-1 border-2 p-1 dark:border-dark-subtle border-light-subtle 
        rounded transition ${errors[name] ? "border-red-600" : null}`}
      >
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <>
              <textarea
                {...field}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                placeholder={placeholder}
                onChange={(e) => handleOnChange(field, e)}
                cols="30"
                rows="4"
                className="
          outline-none rounded resize-none
          text-lg dark:text-white
          bg-transparent peer flex-1 custom-scroll-bar"
              />
              <span className="text-[10px] text-sky-400 dark:text-yellow-500">
                {field.value?.length}/200
              </span>
            </>
          )}
        />
      </div>
      {errors[name] ? (
        <p className="text-red-500 text-[12px]">{errors[name]?.message}</p>
      ) : null}
    </div>
  );
}

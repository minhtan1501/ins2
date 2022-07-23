import React, { useState } from "react";
import { Controller } from "react-hook-form";

export default function GenderFiled({ control, name, errors }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <label className="text-gray-400 font-semibold" htmlFor="">
            Giới tính
          </label>

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name={name}
                {...field}
                value="Nam"
                checked={field.value === "Nam"}
              />
              <label htmlFor="" className="dark:text-white font-semibold">
                Nam
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name={name}
                {...field}
                value="Nữ"
                checked={field.value === "Nữ"}
              />
              <label htmlFor="" className="dark:text-white font-semibold">
                Nữ
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name={name}
                {...field}
                value="Khác"
                checked={field.value === "Khác"}
              />
              <label htmlFor="" className="dark:text-white font-semibold">
                Khác
              </label>
            </div>
          </div>
          {errors[name] ? (
            <p className="text-[12px] text-red-500">{errors[name]?.message}</p>
          ) : null}
        </div>
      )}
    />
  );
}

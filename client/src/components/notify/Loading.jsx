import React from "react";

export default function Loading() {
  return (
    <div className="
    bg-[rgba(0,0,0,0.5333)]  fixed  w-screen h-screen 
    text-white inset-0 z-[1000005]
    flex items-center justify-center text-center">
      <svg className="
        loading-text text-[5px] 
        font-semibold
        uppercase tracking-[1.2px]" width="250" height="250" viewBox="0 0 40 50">
        <polygon
          stroke="#fff"
          strokeWidth="1"
          fill="none"
          points="20,1 40,40 1,40"
        />
        <text className="
         
        " fill="#fff" x="5" y="47">
          Loading...
        </text>
      </svg>
    </div>
  );
}

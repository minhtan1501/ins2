import React from "react";
import CustomBtn from "./CustomBtn";

export default function FollowBtn() {
    
  return (
    <CustomBtn
      className="text-red-500 hover:bg-red-500 border-red-500 hover:text-white"
      onClick={handleUnFollow}
    >
      Theo dõi
    </CustomBtn>
  );
}

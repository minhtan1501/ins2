import React from "react";
import Container from "../../components/Container";
import LeftSIde from "../../components/message/LeftSide";
import RightSide from "../../components/message/RightSide";
export default function Conversation() {
  return (
    <div className="min-h-screen dark:bg-primary bg-white">
      <Container className="">
        <div
          className="grid grid-cols-12 flex-1 rounded border-[1px] mt-16 mx-2 lg:mx-0 "
          style={{ height: "calc(100vh - 100px)" }}
        >
          <div className="col-span-4 border-r-[1px] overflow-auto">
            <LeftSIde />
          </div>
          <div className="col-span-8 flex flex-col  justify-end overflow-hidden">
           <RightSide />
          </div>
        </div>
      </Container>
    </div>
  );
}

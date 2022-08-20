import React from "react";
import Container from "../../components/Container";
import LeftSIde from "../../components/message/LeftSide";
import { BsMessenger } from "react-icons/bs";
export default function Message() {
  return (
    <div className="min-h-screen dark:bg-primary bg-white">
      <Container className="">
       
        <div className="grid grid-cols-12 flex-1 mt-14 rounded  "
        style={{ height: "calc(100vh - 100px)"}} >
          <div className="col-span-4 border-r-[1px]">
            <LeftSIde />
            
          </div>
          <div className="col-span-8">
          <div className="flex justify-center items-center flex-col h-full">
              <BsMessenger size={40} className='text-sky-500'/>
              <h4 className="dark:text-white text-primary text-4xl">Tin nhắn</h4>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

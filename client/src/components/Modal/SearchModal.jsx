import React from "react";
import SearchFiled from "../formFiled/SearchFiled";
import ModalContainer from "./ModalContainer";

export default function SearchModal({ visible, onClose }) {
  return (
    <ModalContainer visible={visible} onClose={onClose}>
      <div className="w-96 dark:bg-primary  rounded h-[50vh] p-6 flex justify-center">
      <div className='w-[220px]'>
        <SearchFiled className="w-full" onClose={onClose} />
      </div>

      </div>
    </ModalContainer>
  );
}

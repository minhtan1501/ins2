import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Avatar from '../Avatar'
import StatusModal from '../Modal/StatusModal';

export default function Status() {
    const auth = useSelector((state) => state.user);
    const [visibleModal,setVisibleModal] = useState(false);

    const openModal = () =>{
      setVisibleModal(true);
    }

    const closeModal = () =>{
      setVisibleModal(false)
    }

  return (
    <>
    <div className="flex my-3 bg-white drop-shadow p-5 rounded space-x-2">
        <Avatar url={auth.profile.avatar?.url} size='big'/>
        <button onClick={openModal} className="hover:bg-[#ddd] flex-1 text-left bg-gray-100 rounded-[30px] px-[10px] outline-none text-[#555]">
            {auth.profile.userName}, Bạn đang nghĩ gì vậy?
        </button>

    </div>
    <StatusModal onClose={closeModal} visible={visibleModal}/>
    </>
  )
}

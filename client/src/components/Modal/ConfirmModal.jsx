import React from 'react'
import ModalContainer from './ModalContainer'

export default function ConfirmModal({ handleConfirm,visible,onClose,content=''}) {
  return (
    <ModalContainer visible={visible} onClose={onClose}>
    <div className="w-72 dark:bg-primary bg-white rounded">
    <div className='dark:text-white text-center p-3 border-b-[1px] font-semibold text-2xl'>
        Thông báo
    </div>
    <div className="dark:text-dark-subtle font-semibold text-light-subtle p-3 border-b-[1px]">
        {content}
    </div>
    <div className='flex justify-end space-x-3 p-3'>
        <button onClick={onClose} className='hover:opacity-60 p-2 bg-red-500 text-white rounded font-semibold'>
            Hủy bỏ
        </button>
        <button onClick={handleConfirm} className='hover:opacity-60 p-2 bg-green-500 text-white rounded font-semibold'>
            Xác nhận
        </button>
    </div>
    </div>
  </ModalContainer>
  )
}

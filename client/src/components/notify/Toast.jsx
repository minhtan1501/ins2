import React, { useEffect, useRef } from 'react'

export default function Toast({msg,handleShow,title}) {
    let bgColor = 'bg-error';
    const ref = useRef()
    const toastRef = useRef()
    if(title === 'error'){
    bgColor = 'bg-error'
  }
  else if(title === 'success'){
    bgColor = 'bg-success'
  }
  else bgColor = 'bg-warning'

  const handleClose = () =>{
    if (!toastRef.current.classList.contains('toast-right-to-left')) {
      toastRef.current.classList.add('toast-left-to-right');
    }
  }

  useEffect(()=>{
    if(ref.current) clearTimeout(ref.current)
    ref.current = setTimeout(()=>{
      handleClose()
    },[2000])
    
      return () =>{
        clearTimeout(ref.current)
      }
  },[ref.current])

  const handleAnimationEnd = (e) =>{

    if (e.target.classList.contains('toast-left-to-right')) handleShow();
    e.target.classList.remove('toast-right-to-left');
  }
console.log(msg);
  return (
    <div onAnimationEnd={handleAnimationEnd} ref={toastRef} className={`fixed top-[5px] right-[5px] min-w-[200px] z-[9999] ${bgColor} space-x-2 rounded overflow-hidden p-2 toast-right-to-left`}>
        <div className={`bg-${bgColor} flex justify-between items-center border-b-[1px]`}>
            <strong className="text-white ml-2">{title.charAt(0).toUpperCase() + title.slice(1)}</strong>
            <button onClick={handleClose} className="mr-2 -translate-y-1/4  text-xl font-semibold text-gray-300 outline-none">&times;</button>
        </div>
        <div className='text-white'>{msg}</div>
    </div>
  )
}

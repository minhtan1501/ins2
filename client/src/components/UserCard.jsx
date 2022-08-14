import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
export default function UserCard({user,handleSelected = null,onClose = null,children,className}) {

  const handleOnClick = () => {
    handleSelected && handleSelected()
    onClose && onClose()
  }
  if(!user) return null
  return (
    <div className="flex justify-between items-center mx-2 my-2">
    <Link
    to={"/profile/" + user?._id}
    onClick={handleOnClick}
    
  >
    <div className={'flex items-center  space-x-2 dark:hover:bg-dark-subtle hover:bg-[#f9f9f9] '+className}>
        <div>
          <Avatar url={user.avatar?.url} size ='big' />
        </div>
        <div className='flex flex-col'>
          <span className='dark:text-white text-sm font-semibold'>{user?.fullName}</span>
          <span className='dark:text-dark-subtle text-sm'>{user?.userName}</span>
        </div>
    </div>

  </Link>
      <div className='cursor-pointer'>
        {children}

      </div>
    </div>
  )
}

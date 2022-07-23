import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
export default function UserCard({user,handleSelected = null,onClose = null}) {

  const handleOnClick = () => {
    handleSelected && handleSelected()
    onClose && onClose()
  }

  if(!user) return null
  return (
    <Link
    to={"/profile/" + user?._id}
    onClick={handleOnClick}
  >
    <div className='flex items-center  space-x-2 dark:hover:bg-dark-subtle hover:bg-[#f9f9f9]'>
        <div>
          <Avatar src={user?.avatar?.url} size ='big' />
        </div>
        <div className='flex flex-col'>
          <span className='dark:text-white text-sm font-semibold'>{user?.fullName}</span>
          <span className='dark:text-dark-subtle text-sm'>{user?.userName}</span>
        </div>
    </div>

  </Link>
  )
}

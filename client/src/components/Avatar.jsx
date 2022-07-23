import React from 'react'

export default function Avatar({url,onClick,size = '',className}) {
  let avatarSize = 'h-8 w-8'
  if(size === 'small'){
    avatarSize = 'h-6 w-6'
  }
  else if(size === 'big'){
    avatarSize = 'h-12 w-12'
  }
  else if(size === 'supper'){
    avatarSize = 'sm:h-28 sm:w-28 h-16 w-16'
  }

  return (
    <div
    className={`
     overflow-hidden border-[2px] dark:border-dark-subtle border-light-subtle
    rounded-[50%] ${avatarSize} ${className}
    `}
    type="button"
    onClick={onClick}
  >
    <img className="w-full h-full object-cover" src={url ? url :"profilePic.png"} alt="" />
  </div>
  )
}

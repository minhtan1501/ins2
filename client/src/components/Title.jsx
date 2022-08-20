import React from 'react'

export default function Title({children}) {
  return (
    <div className="dark:text-white text-xl text-secondary font-semibold text-center tracking-wide">{children}</div>
  )
}

import React from 'react'

export default function FormContainer({children}) {
  return (
    <div className="dark:bg-primary min-h-screen flex mx-auto items-center justify-center">{children}</div>
  )
}

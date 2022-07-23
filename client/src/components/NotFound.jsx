import React from 'react'

export default function NotFound() {
  console.log("Not Found")
  return (
    <div className="min-h-screen  dark:bg-primary bg-white sticky z-[2]  flex items-center justify-center">
      <h2 className="dark:text-dark-subtle text-light-subtle text-4xl  animate-pulse">404 | Not Found.</h2>
    </div>
  )
}

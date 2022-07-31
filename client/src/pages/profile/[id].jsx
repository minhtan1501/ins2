import React from 'react'
import Info from '../../components/profile/Info'
import Post from '../../components/profile/Post'
export default function Profile() {
  return (
    <div className='dark:bg-primary bg-white mt-12'>
      <Info/>
      <Post />
    </div>
  )
}

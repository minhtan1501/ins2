import React from 'react'
import { useSelector } from 'react-redux'
import CardBody from './post_card/CardBody';
import CardFooter from './post_card/CardFooter';
import CardHeader from './post_card/CardHeader';

export default function Posts() {
  const {homePosts} = useSelector((state) => state);


  return (
    <div className="space-y-4 ">
      {homePosts.posts.map((post) =>{
        return (
         <div key={post._id} className="dark:bg-secondary rounded dark:drop-shadow-xl drop-shadow bg-white ">
          <CardHeader post={post}/>
          <CardBody post={post}/>
          <CardFooter post={post}/>
         </div>
        )
      })}
    </div>
  )
}

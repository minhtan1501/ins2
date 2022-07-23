import React from 'react'
import {Link} from 'react-router-dom'
export default function CustomLink({children,path,className}) {
  return (
    <Link className={'font-semibold hover:opacity-80 transition ' + className}  to={path}>{children}</Link>
    )
}

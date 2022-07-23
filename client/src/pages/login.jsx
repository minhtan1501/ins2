import React, { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/form/LoginForm'

export default function Login() {
  const auth = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if(auth.token){
      navigate('/',{replace:true})
    }
  },[auth])

  return (
    <LoginForm/>
  )
}

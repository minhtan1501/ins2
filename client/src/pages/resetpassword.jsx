import React, { useEffect, useState } from 'react'
import { ImSpinner3 } from 'react-icons/im'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FormContainer from '../components/form/FormContainer'
import Container from '../components/Container'
import useNotify from '../hooks/useNotify'
import Title from '../components/Title'
import SubmitBtn from '../components/SubmitBtn'
import { postDataApi } from '../api/userApi'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const id = searchParams.get('id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const {setNotify} = useNotify()
  const [loading,setLoading] = useState(false)
  const [password,setPassword] = useState({
    passwordOne: '',
    passwordTwo: '',
  })
  const nagative = useNavigate()


  const handleChangePassword = (e) =>{
    setPassword(pre =>({
      ...pre,
      [e.target.name]: e.target.value
    }))
  }
  const handleSubmit = async(e) => {
    try {
      e.preventDefault()

      if(password.passwordOne.trim().length < 8) return setNotify('error','Password must be 8 characters long!')
      if(password.passwordOne !== password.passwordTwo) return setNotify('error',"Password do not match!")
      setLoading(true);
    //   const res = await resetPassword({newPassword:password.passwordOne,userId:id,token:token});
    //   setNotify('success',res.message);
      setLoading(false);
      nagative('/login',{replace:true})
      
    }
    catch(error) {
      setLoading(false);
      setNotify('error',)
    }

  }

  const isValidToken = async () => {
    try {
      if(token && id ){
        const res = await  postDataApi('verify-pass-reset-token',({token,id}));
        console.log(res);
        setIsVerifying(false)
        if(!res.data.valid){
          setIsValid(false)
        } 
        setIsValid(true)
      }
      
    }
    catch (err) {
    //   nagative('/forgotpassword',{replace:true})
    //   setNotify('error',err?.toString().replace("Error:",'').trim())
    }
  }

  useEffect(()=>{
    isValidToken()
  },[token,id])

  if(!isValid) {
    return (
      <FormContainer>
        <Container>
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary ">
              Sorry the token is invalid
            </h1>
           
          </div>
        </Container>
      </FormContainer>
    )
  }

  if(!isVerifying) {
    return (
      <FormContainer>
        <Container>
          <div className="flex flex-col space-y-4 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary ">
              Please wait we are verifying your token!
            </h1>
            <ImSpinner3 className="text-primary dark:text-white animate-spin text-4xl"/>
          </div>
        </Container>
      </FormContainer>
    )
  }
  return (
    <FormContainer>
    <Container>
      <form onSubmit={handleSubmit} action="" className={" w-96"}>
        <Title>Nhập mật khẩu mới</Title>
        {/* <InputFiled
          name="passwordOne"
          type="password"
          onChange={handleChangePassword}
          placeholder="Password"
          label="New Password"
          value={password.passwordOne}
        />
          <InputFiled
          value={password.passwordTwo}
          name="passwordTwo"
          type="password"
          onChange={handleChangePassword}
          placeholder="Confirm Password"
          label="Confirm Password"
        /> */}
        <SubmitBtn  disabled={loading} busy={loading}>
            Gửi link
        </SubmitBtn>

      </form>
    </Container>
  </FormContainer>
  )
}

export default ResetPassword
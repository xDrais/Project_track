import React,{useEffect, useState} from 'react'
import {useNavigate,useSearchParams} from 'react-router-dom'
import Loader from "../Components/Loader";
import { Form ,Button,Container } from 'react-bootstrap'
import { resetPassword } from '../userredux/useraction' 
import { useDispatch , useSelector } from "react-redux";
import video from "../Components/HeroSection/pottery2.mp4"
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
    const dispatch =useDispatch()
    const navigate =useNavigate()
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const token = searchParams.get('token')
    const [password,setPassword]=useState(()=>{return ""})
    const [confirmpassword,setConfirmPassword]=useState(()=>{return ""})

    const resetpass = useSelector(state => state.resetpass)
    const {loading , error } = resetpass

    const submitHandler=(e)=>{
        e.preventDefault()
        if (password === confirmpassword && password.length !==0 ) {
                dispatch(resetPassword(password,id,token))
                navigate('/login') 
        }  
    }
    useEffect(()=>{
        if(error){
            toast.error(error)
        }
    },[error])
  return (
    <>
    <Container>
    <div className='hero-container'>
        <video src={video} autoPlay loop muted />
      {/* {error && <Toast message={error}></Toast>} */}
      {loading && <Loader />}
      {console.log(error)}
      <Form className='login' onSubmit={submitHandler}>
      <center><h3 className="sign">Reset Password</h3></center>

            <Form.Group controlId="password">
                <Form.Label>
                   Password
                </Form.Label>
                <Form.Control 
                 type="password"
                 placeholder="password"
                 minLength={8} 
                 value={password} 
                 onChange={(e)=> 
                 setPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="Confirm password">
                <Form.Label>
                   Confirm Password
                </Form.Label>
                <Form.Control 
                 type="password"
                 minLength={8}
                 placeholder="Confirm password" 
                 value={confirmpassword} 
                 onChange={(e)=> 
                 setConfirmPassword(e.target.value)}>
                </Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" >Submit</Button>
        </Form>
        </div>
        <ToastContainer></ToastContainer>
    </Container>
    </>
  )
}

export default ResetPassword
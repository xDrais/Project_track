import React,{  useEffect, useState} from 'react'
import Loader from "../Components/Loader";
import { Form ,Button,Container } from 'react-bootstrap'
import { Forget_Password } from '../userredux/useraction'
import { useDispatch , useSelector } from "react-redux";
import video from "../Components/HeroSection/pottery2.mp4"
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const ForgetPassword = () => {
    const dispatch = useDispatch()
    const [email,setEmail]=useState(()=>{return ""} )
    const forgetPassword = useSelector(state => state.forgetPassword)
    const {loading , error,success } = forgetPassword
    const submitHandler=(e)=>{
        e.preventDefault()
        dispatch(Forget_Password(email)) 
    }
    useEffect(()=>{
        if (error){
            toast.error(error)
        }
        if (success){
            toast.success("check your'e email")
        }
    },[error,success])
  return (
    <>
    <Container>
    <div className='hero-container'>
        <video src={video} autoPlay loop muted />
        {loading && <Loader />}   
      <h1 className="sign">Forget Password</h1>
      <Form className='login' onSubmit={submitHandler}>
            <Form.Group controlId="email">
                <Form.Label >
                    Email Address
                </Form.Label>
                <Form.Control type="email"
                 placeholder="Email"
                 value={email}
                 onChange={(e)=>
                 setEmail(e.target.value)}>
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

export default ForgetPassword
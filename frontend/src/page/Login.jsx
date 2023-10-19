import React, {useState,useEffect} from "react";
import {Link, redirect, useNavigate, useParams,} from 'react-router-dom'
import {Form , Button,Row,Col} from 'react-bootstrap'
import { useDispatch , useSelector , } from "react-redux";
import { login } from "../userredux/useraction";
import video from "../Components/HeroSection/pottery2.mp4"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css"
 //import log from '../page/login.css'
 import Message from "../Components/Message";
 import Loader from "../Components/Loader.js";
 import {verifyEmail} from "../userredux/useraction"
 import g from "../page/google.png"
 import git from "../page/github.png"
 import { Alert } from "react-bootstrap";
import FormContainer from "../Components/FormContainer";
import { withRouter } from "react-router-dom";

const Login = (props) => {
  
  const navigate = useNavigate()
  const {emailToken}=useParams()
  console.log(emailToken)
    const [email , setEmail]=useState('')
    const [password , setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} =userLogin
    const {loading , error } = userLogin

    
    useEffect(()=>{
        dispatch(verifyEmail(emailToken))
    },[dispatch,emailToken])

    const submitHandler=(e)=>{
        e.preventDefault()

        dispatch(login(email, password))

         
        ;

    }
    const isAdmin = userInfo?.role?.name === "adminRole";
    const isUser = userInfo?.role?.name === "userRole";
    if (isAdmin) {
      // redirect the admin to the dashboard page
      navigate("/dashboard");
    } else if (isUser) {
      navigate("/");
    }

    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    useEffect(() => {
      const result = EMAIL_REGEX.test(email);
      console.log(result);
      console.log(email);
      setValidEmail(result);
    }, [email]);
  
    useEffect(() => {
      const result = PWD_REGEX.test(password);
      console.log(result);
      console.log(password);
      setValidPassword(result);
    }, [password]);
    const google = () => {
      window.open("http://localhost:5000/auth/google/callback", "_self");
    };
    const github = () => {
      window.open("http://localhost:5000/auth/github/callback", "_self");
    };
// const isAdmin = userInfo?.role?.name === "adminRole";
// if(isAdmin){
//   navigate('/dashboard')
// }

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
    const messageSuccess = "";
    
    return (
      <>      
          <div className='hero-container'>
          <video src={video} autoPlay loop muted />
          
          
           
        {loading && <Loader />}
  
          <form className="login" onSubmit={submitHandler}>
          {error && <div className="alert">{error}</div>}
          {messageSuccess && <div className="alert">{messageSuccess}</div>}
          <center>  
            <h1 className="sign">Sign In</h1> </center>
  
                  <label htmlFor="email">
                      Email Address
                  </label>
                  <input id="email" required type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)}>
                  </input>
                  <p
                  id="noteemail"
                  className={email && !validEmail ? "none" : "hide"}
                >
                  Enter a valid e-mail adress{" "}
                </p>
                
                  <label htmlFor="password">
                      Password
                  </label>               
                  <input id="password" required  
                  placeholder="Password" 
                  type={showPassword ? "text" : "password"}
                  value={password} 
                  onChange={(e)=> setPassword(e.target.value)} >
                  </input> <div className="visibility-icon" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
           
                  
              <Button type="submit" variant="primary"  >Sign In</Button> 
              <Link to="/forget-password"  >Forget Password</Link>
             <div className="google">
            <img src={g} alt="" onClick={google} className="icon" />
            <img src={git} alt="" onClick={github} className="icon" />
            </div>
              <Row className="py-3">
                  <Col>
                          New Customer?{''}  <Link to="/register" >

                        Register                        </Link>
                  </Col>
                  <Link to="/forget-password"  >Forget Password</Link>
              </Row>
          </form>
           </div>
      </>
    )
}

export default Login
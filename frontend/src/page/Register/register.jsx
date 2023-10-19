import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import video from "../../Components/HeroSection/pottery2.mp4";
import "../../Components/HeroSection/HeroSection.css";
import "./register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding,faChalkboardUser} from '@fortawesome/free-solid-svg-icons';
import UploadfFile from "../UploadfFile";
import SpecialButton from "../../Components/Button/button";
import Loader from "../../Components/Loader";
import { register } from "../../userredux/useraction";
import ReCAPTCHA from "react-google-recaptcha";
import {
  ArrowWrapperLeft,
  ArrowWrapperRight,
} from "../../Components/Arrows/Arrows";

const Register = () => {
  //State taa el captcha keni verified wala le
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  //3in icon 
  const [showPassword, setShowPassword] = useState(false);

  //steps taa el form
  const [step, setStep] = useState(1);
  // states taa simple user
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cin, setCin] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
 
  //validateurs simple user
  const [validFirstName, setValidFirstName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validCin, setValidCin] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validDateOfBirth, setValidDateOfBirth] = useState(false);
  const [validImageUrl, setValidImageUrl] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);


  //box taa terms and conditions
  function handleRadioChange() {
    setIsChecked(!isChecked);
  }

  // Clear the input field when the user interacts with it

  function handleInputFocus(e) {
    e.target.value = "";
  }

  //Controle de saisie taa el user
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{2,23}$/;
  const CIN_REGEX = /^[0-1][0-9]{7}$/;

  const PHONE_REGEX = /^[2-9][0-9]{7}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
  const DATE_REGEX =
    /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
  const IMAGE_REGEX = /\.(png|jpe?g)$/i;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const dispatch = useDispatch();
  //use selector tjibli fel reducer eli houwa userRegister eml store 
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error,messageSuccess } = userRegister;
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  //hedhi bch taamelek el redirection
  const navigate = useNavigate();

  //Fonction etat el captcha
  const handleCaptcha = (value) => {
    if (value) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(false);
    }
  };
    //RADIOBOX taa terms and conditions

  const [isChecked, setIsChecked] = useState(false);

  // Creating the user
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      register(
       { firstName,
        lastName,
        phone,
        cin,
        dateOfBirth,
        imageUrl,
        email,
        password}
        
      )
    );
  };

  //Fonction Onclick taa el previous step
  const handlePrevStep = () => {
    if (step === 4) {
      setStep(1);
    } else if (step === 3) {
      setStep(1);
      if (step === 5) setStep(1);
    } else setStep((prevStep) => prevStep - 1);
  }
  //Fonction Onclick taa el next step

  const handleNextStep = () => {
    if (step === 4) {
      setStep(5);
    } else if (step === 3) {
      setStep(5);
    } else setStep((prevStep) => prevStep + 1);
  };

  {
    /* use effects taa controle de saisie */
  }

  useEffect(() => {
    const result = USER_REGEX.test(firstName);
    console.log(result);
    console.log(firstName);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = USER_REGEX.test(lastName);
    console.log(result);
    console.log(lastName);
    setValidLastName(result);
  }, [lastName]);

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

  useEffect(() => {
    const result = CIN_REGEX.test(cin);
    console.log(result);
    console.log(cin);
    setValidCin(result);
  }, [cin]);
  useEffect(() => {
    const result = PHONE_REGEX.test(phone);
    console.log(result);
    console.log(phone);
    setValidPhone(result);
  }, [phone]);

  useEffect(() => {
    const result = IMAGE_REGEX.test(imageUrl.name);
    console.log(result);
    console.log(imageUrl.name);
    setValidImageUrl(result);
  }, [imageUrl]);
  useEffect(() => {
    if (dateOfBirth) {
      const inputDate = new Date(dateOfBirth);
      const today = new Date();
      const diffInMilliseconds = today.getTime() - inputDate.getTime();
      const age = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24 * 365));
      if (age >= 18) {
        setValidDateOfBirth(true);
      } else {
        setValidDateOfBirth(false);
      }
    }
  }, [dateOfBirth]);




  
  return (
    <>
      {/* el video taa el background */}
      <div className="hero-container">
        <video src={video} autoPlay loop muted />
        {/* el message taa el controle de saisie w el loader   */}
       
        <section className="marginTops">
          {error && <div className="alert">{error}</div>}
          {messageSuccess && <div className="alertgreen">{messageSuccess}</div>}

          {loading && <Loader />}
        </section>
        {/* form start    */}
        <form
          className="register"
          onSubmit={submitHandler}
          encType="multipart/form-data"
        >
          <div
            align="center"
            style={{ marginBottom: "20px", marginTop: "-20px" }}
          >
          
          </div>
          {/* les boutons mtaa previous w next */}

          <ArrowWrapperLeft
            onClick={handlePrevStep}
            disabled={step === 1}
            visibility={step === 2 ? "hidden" : "visible"}
          />
          <ArrowWrapperRight
            onClick={handleNextStep}
            disabled={
              step === 5 ||
              !validCin ||
              !validEmail ||
              !validFirstName ||
              !validLastName ||
              !validPhone ||
              !validPassword
            }
            visibility={step === 2 ? "hidden" : "visible"}
          />

          {/* step lowla mtaa el form eli fiha el info taa simple user */}
          {step === 1 && (
            <>
             
            <h1>Sign Up</h1>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                required
                onChange={(e) => setFirstName(e.target.value)}
              ></input>

              <p
                id="notefirstname"
                className={firstName && !validFirstName ? "none" : "hide"}
              >
                First Name is at least 3 letters and cannot contain special
                characters or numbers
              </p>
              <input
                id="lastName"
                required
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
              <p
                id="notelastname"
                className={lastName && !validLastName ? "none" : "hide"}
              >
                Last Name is at least 3 letters and cannot contain special
                characters or numbers
              </p>
              <input
                id="email"
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <p
                id="noteemail"
                className={email && !validEmail ? "none" : "hide"}
              >
                Enter a valid e-mail adress{" "}
              </p>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>

<div className="visibility-icon" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            
              <p
                id="notepwd"
                className={password && !validPassword ? "none" : "hide"}
              >
                Password needs to contain at least 1 UpperCase letter , 1
                LowerCase letter, 1 Number and at least 8{" "}
              </p>

              <input
                id="cin"
                type="text"
                placeholder="Cin"
                required
                value={cin}
                onChange={(e) => setCin(e.target.value)}
              ></input>
              <p id="noteCIN" className={cin && !validCin ? "none" : "hide"}>
                Cin begins with 0 or 1 and is 8 digits long{" "}
              </p>

              <input
                id="phone"
                type="phone"
                placeholder="phone number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></input>
              <p
                id="noteephone"
                className={phone && !validPhone ? "none" : "hide"}
              >
                Phone contains 8 digits{" "}
              </p>
              {dateOfBirth ? (
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  required
                  onFocus={handleInputFocus}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                />
              ) : (
                <input
                  id="dateOfBirth"
                  type="text"
                  required
                  value=""
                  placeholder="Date of Birth"
                  onFocus={handleInputFocus}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                />
              )}

              <p
                id="noteedate"
                className={dateOfBirth && !validDateOfBirth ? "none" : "hide"}
              >
                You need to be at least 18 years old{" "}
              </p>
              <input
                id="imageUrl"
                type="file"
                name="imageUrl"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => setImageUrl(e.target.files[0])}
              ></input>

              <p
                id="noteimag"
                className={imageUrl && !validImageUrl ? "none" : "hide"}
              >
                Enter Valid image type : png , jpg or jpeg{" "}
              </p>
             
            </>
          )}

          {/* step 2 mtaa terms of use w submit simple user */}

          {step === 2 && (
            <>


                <ReCAPTCHA
                sitekey="6Ldzy-UkAAAAAOF98pseL_XgounD7zAY-IT1kms1"
                onChange={handleCaptcha}
              />
              <div className="tacbox">
                <input
                  id="checkbox"
                  type="checkbox"
                  onChange={handleRadioChange}
                />

                <label htmlFor="checkbox">
                  {" "}
                  I agree to these <a href="#">Terms and Conditions</a>.
                </label>
              </div>

              <Button
                style={{ marginTop: "5px" }}
                type="submit"
                disabled={!isChecked || !isCaptchaVerified                }
              >
                Sign Up
              </Button>
              <Row className="py-3">
                <Col>
                  Have an account?{""} <Link to="/login">Login</Link>
                </Col>
              </Row>

            </>
          )}
        </form>
        {/* fin form */}
      </div>{" "}
      {/* fin video background */}
    </>
  );
};

export default Register;

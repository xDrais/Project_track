import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col, ListGroup, Image, Card, } from 'react-bootstrap'
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import AssignmentIcon from '@material-ui/icons/Assignment';
import backg from "./test.jpg";
import Palette from "@material-ui/icons/Palette";
import add from "@material-ui/icons/Add";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faDashboard, faShop,faChalkboard, faShopLock} from '@fortawesome/free-solid-svg-icons';
import Favorite from "@material-ui/icons/Favorite";
// core components
// import Header from "/components/Header/Header.js";
// import Footer from "/components/Footer/Footer.js";
import Button from "../Components/CustomButtons/Button.js";
import GridContainer from "../Components/Grid/GridContainer.js";
import GridItem from "../Components/Grid/GridItem.js";
import NavPills from "../Components/NavPills/NavPills.js"
import Parallax from "../Components/Parallax/Parallax.js";
import Shepherd from 'shepherd.js';
import "../Components/Navbar/navbar.css"
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Typography } from '@material-ui/core';
import { Table, TableHead, TableRow, TableCell, TableBody ,TablePagination  } from '@material-ui/core';

import styles from "../Components/styles/jss/nextjs-material-kit/pages/profilePage.js";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Components/Loader.js";
import { toast,ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Input from "../Components/Input.jsx";
import UploadfFile from "./UploadfFile.jsx";
import { Link, useNavigate } from "react-router-dom";
import { FaChalkboard, FaChalkboardTeacher } from "react-icons/fa";
import SpecialButton from "../Components/Button/button";

const useStyles = makeStyles(styles);

export default function Profile() {
  const navigate = useNavigate();

const GotoUserDashboard=()=>{

  navigate('/userdashboard');

}
const GotoCoachDashboard=()=>{
  navigate('/coachdashboard');

}
  const handle=()=>{
    if (show ){
      return setShow(!show)
    }
    return setShow(!show)
  }
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

    const [toggle,setToggle]=useState(()=> {return ['a']}) 
    const userLogin = useSelector(state => state.userLogin)
    const {loading , error,userInfo } = userLogin  
    
    const addFiled=()=>{
      if (toggle.length<5) {
        setToggle([...toggle,'&'])
      }
    }
    
const dispatch = useDispatch();




    const [show,setShow]=useState(false)
   



  const classes = useStyles();
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('hasCompletedTour');
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true
        },
        classes: 'popup',
        scrollTo: { behavior: 'smooth', block: 'center' },
        modal: true,
        highlightClass: 'shepherd-highlight'
        
      }
    });     
   
   
 
   
    tour.start();
    // localStorage.setItem('hasCompletedTour', true);
  
  }, []);
  
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
    <div>

    {loading && <Loader></Loader>} 
      <Parallax small filter image="/images/test.jpg" />       

      <div style={{backgroundColor: "#43312d",backgroundImage:`url(${backg})`}} className={classNames(classes.main, classes.mainRaised)}>        <div> <div></div>
          <div className={classes.container}>
            <GridContainer  justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div>
                    <img
                      src={"/images/"+userInfo.imageUrl}
                      alt="..."
                      style={{"borderRadius": "50%","height":"160px"}}
                    />
                  </div>
                  {userInfo.certified ? (
   <><FontAwesomeIcon   id="shopicon" className="iconn"style={{marginTop:"-300px",marginRight:"30px"}} onClick={GotoUserDashboard} icon={faShop}   color="#FCFFE7" size="3x" />

  </>

) : (  <FontAwesomeIcon  className="iconn" style={{marginTop:"-300px"}}  icon={faShopLock}   color="#FCFFE7" size="3x" />
)}
 { userInfo.role.name === "coach" ? 
  <FontAwesomeIcon id="courseicon" className="iconn" style={{marginTop:"-300px"}} onClick={GotoCoachDashboard} icon={faChalkboardTeacher}  color="#FCFFE7" size="3x" /> : 

( <></>
)}

                  <div className={classes.name +"py-3"}>
                    <h3 style={{ color: "#FCFFE7"}}className={classes.title}>{userInfo.lastName+" "+userInfo.firstName}</h3>
                     <h6 style={{ color: "#FCFFE7"}}> {userInfo.role.name}</h6> 
                    <Button justIcon link className={classes.margin5}>
                      <i className={"fab fa-twitter"} />
                    </Button>
                    <Button justIcon link className={classes.margin5}>
                      <i className={"fab fa-instagram"} />
                    </Button>
                    <Button justIcon link className={classes.margin5}>
                      <i className={"fab fa-facebook"} />
                    </Button>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description}>
              <p>
               
              </p>
            </div>
            <GridContainer justify="center">
  <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
  <GridContainer justify="center">
  <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
    <GridContainer justify="center">
      {userInfo && (
        <>
          <GridItem xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Email:</Typography>
            <Typography variant="body1">{userInfo.email}</Typography>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>First Name:</Typography>
            <Typography variant="body1">{userInfo.firstName}</Typography>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Last Name:</Typography>
            <Typography variant="body1">{userInfo.lastName}</Typography>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>CIN:</Typography>
            <Typography variant="body1">{userInfo.cin}</Typography>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Phone Number:</Typography>
            <Typography variant="body1">{userInfo.phone}</Typography>
          </GridItem>
          <GridItem xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Date of Birth:</Typography>
            <Typography variant="body1">
              {userInfo.dateOfBirth && new Date(userInfo.dateOfBirth).toLocaleDateString()}
            </Typography>
          </GridItem>
          {/* Add more fields as needed */}
        </>
      )}
    </GridContainer> 
  </GridItem>
</GridContainer>

  </GridItem>
</GridContainer>
            
          </div>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
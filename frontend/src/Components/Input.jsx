import React, { useEffect, useState } from 'react'
import { Form ,Button,Container } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import UploadfFile from '../page/UploadfFile';
import { coachaction,sponsoraction } from "../userredux/useraction.js";
import {toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Input = () => {
    const userLogin = useSelector(state => state.userLogin)
    const {userInfo } = userLogin  
    const coachReducer = useSelector(state => state.coachReducer)
    const {succes,error } = coachReducer  
    const sponsorReducer = useSelector(state => state.sponsorReducer)
    const {succes:sponssu,error:sponserr } = sponsorReducer  
    const dispatch=useDispatch()
    const [file,setFile]=useState()
    const[coach,setCoach]=useState({
        user:userInfo._id,
        speciality:"",
        descriptionCoach:"",
        dateDebutExperience:"",
        dateFinExperience:"",
        titrePoste:"",
        file:""
      })
      const[sponsor,setSponsor]=useState({
          user:userInfo._id,
          entrepriseName:"",
          sector:"",
          descriptionSponsor:"",
          file:""
      })
      const handlesponsor =async(e)=>{
        e.preventDefault()   
       
        dispatch(sponsoraction(sponsor))
        
    }
    const handlecoach =async(e)=>{
      e.preventDefault()   
     
      dispatch(coachaction(coach))
    }
    useEffect(()=>{
        setCoach(coach=>({
            ...coach,
            file:file
         }))
         setSponsor(sponsor=>({
          ...sponsor,file:file
        }))

        if(succes||sponssu){
            toast.success("done")
        }
        if(error||sponserr){
            toast.error(error)
        }
    },[setCoach,setSponsor,file,succes,sponssu,error,sponserr])
   
  return (
    <>
    
    {userInfo.role.name==="coach"?<>
    <Form  onSubmit={handlecoach}>
        <UploadfFile setFile={setFile} setFi={setFile} ></UploadfFile>
            <Form.Group controlId="text">
                <Form.Label >
                speciality
                </Form.Label>
                <Form.Control type="text"
                 placeholder="speciality"
                 value={coach.speciality}
                 onChange={(e)=>
                 setCoach(coach =>({
                    ...coach, speciality:e.target.value
                 }))}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="text">
                <Form.Label >
                descriptionCoach
                </Form.Label>
                <Form.Control type="text"
                 placeholder="descriptionCoach"
                 value={coach.descriptionCoach}
                 onChange={(e)=>
                    setCoach(coach =>({
                       ...coach, descriptionCoach:e.target.value
                    }))}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="text">
                <Form.Label >
                dateDebutExperience
                </Form.Label>
                <Form.Control type="date"
                 placeholder="dateDebutExperience"
                 value={coach.dateDebutExperience}
                 max={coach.dateFinExperience}
                 onChange={(e)=>
                    setCoach(coach =>({
                       ...coach, dateDebutExperience:e.target.value
                    }))}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="text">
                <Form.Label >
                dateFinExperience
                </Form.Label>
                <Form.Control type="date"
                 placeholder="dateFinExperience"
                 
                 value={coach.dateFinExperience}
                 onChange={(e)=>
                    setCoach(coach =>({
                       ...coach, dateFinExperience:e.target.value
                    }))}>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="text">
                <Form.Label >
                titrePoste
                </Form.Label>
                <Form.Control type="text"
                 placeholder="titrePoste"
                 value={coach.titrePoste}
                 onChange={(e)=>
                    setCoach(coach =>({
                       ...coach, titrePoste:e.target.value
                    }))}>
                </Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" >Submit</Button>
                        
        </Form>
        <ToastContainer></ToastContainer>
        </>
        :userInfo.role.name==="sponsor" && <>
        <Form  onSubmit={handlesponsor}>
        <Form.Group controlId="text">
            <Form.Label >
            entrepriseName
            </Form.Label>
            <Form.Control type="text"
             placeholder="entrepriseName"
             value={sponsor.entrepriseName}
             onChange={(e)=>
             setSponsor(sponsor=>({
                ...sponsor,entrepriseName:e.target.value
             }))}>
            </Form.Control>
        </Form.Group>
        <Form.Group controlId="text">
            <Form.Label >
            sector
            </Form.Label>
            <Form.Control type="text"
             placeholder="sector"
             value={sponsor.sector}
             onChange={(e)=>
                setSponsor(sponsor=>({
                   ...sponsor,sector:e.target.value
                }))}>
            </Form.Control>
        </Form.Group>
        <Form.Group controlId="text">
            <Form.Label >
            descriptionSponsor
            </Form.Label>
            <Form.Control type="text"
             placeholder="descriptionSponsor"
             value={sponsor.descriptionSponsor}
             onChange={(e)=>
                setSponsor(sponsor=>({
                   ...sponsor,descriptionSponsor:e.target.value
                }))}>
            </Form.Control>
        </Form.Group>
        <UploadfFile setFile={setFile} setFi={setFile} ></UploadfFile>
        <Button type="submit" variant="primary" >Submit</Button>
                {console.log(sponsor)}
                {console.log(file)}
    </Form>
     <ToastContainer></ToastContainer>
     </>}
    

        </>
  )
}

export default Input
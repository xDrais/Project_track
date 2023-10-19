import React,{useState} from 'react'
import { Form , Button ,Container } from 'react-bootstrap'
import Loader from '../Components/Loader'
import axios from 'axios'
import FileUplload from '../Components/FileUplload'


const UploadfFile = ({setFile ,setFi}) => {
    const formData = new FormData()
    const [upload,setUpload]=useState(()=> {return false})    
    const [toggle,setToggle]=useState(()=> {return ['a']})    
  
    const uploadFileHandler = (e) =>{
        const file = e.target.files[0] ;
        formData.append('file',file)  
        formData.forEach((d)=>{
            console.log(d)
        })
        console.log("send")
    }
    const addFiled=()=>{
      if (toggle.length<5) {
        setToggle([...toggle,'&'])
      }
    }

    

    const handlesubmit =async(e)=>{
        const file = e.target.files[0] ;
        formData.append('file',file)  
       e.preventDefault()     
       setUpload(true)
        try{
        const config ={
        headers:{
        'Content-Type':'multipart/form-data'
        }
        }
        const {data} =  await axios.post('http://localhost:5000/api/upload',formData,config)
        setFile(data.file?._id)
        setFi(data.file?._id)
        console.log(data.file?._id)
        setUpload(false)
        }catch(error){
          console.error(error)
          setUpload(false)
        }
    }
  return (
    <>
    
    {upload && <Loader></Loader>}
    <FileUplload key={Math.random()}  handle={handlesubmit} />
    </>
  )
}

export default UploadfFile
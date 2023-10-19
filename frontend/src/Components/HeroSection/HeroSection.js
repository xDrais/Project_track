import React from 'react'
import video from "./pottery2.mp4"
import Button from '../Button/button';
import './HeroSection.css';
import img from "./ddd.png"

function HeroSection() {
  return (
    <div className='hero-container'>
        <video src={video} autoPlay loop muted />
       

    <div align="center" className='textoverlay'>
    <img style={{height:"70px"}}src={img} ></img>
      
    <h1 className="H2">
    Le territoire créatif, numérique et durable
    </h1>      

    <div style={{marginTop: '10px'}} >
    
<Button name="Learn More"> commandez</Button> 
    </div> </div> </div>
  )
}

export default HeroSection
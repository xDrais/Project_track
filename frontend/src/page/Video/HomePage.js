import React, { Component, useState } from 'react';
import { Input, Button, IconButton } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import "./Home.css"
import backg from "./backg.jpg";

const HomePage =()=> {
  	const [url ,setUrl]=useState("")
  	const [d ,setD]=useState("")

	const handleChange = (e) => {setUrl( e.target.value )
		setD(e.target.value)
		console.log(d)
	console.log(url)}

	const join = () => {
		console.log(url)
		console.log(d)
		if (url !== "") {
			var url = d.split("/")
			window.location.href = `/video/${d}`
		} else {
			var url = Math.random().toString(36).substring(2, 7)
			window.location.href = `/video/${url}`
		}
	}


		return (
			<body style={{backgroundImage:`url(${backg})`,height:"950px"}}>
			<div className="container2 ">
					<div style={{
					background: "white", width: "30%", height: "auto", padding: "20px", minWidth: "400px",
					textAlign: "center", margin: "auto", marginTop: "100px"
				}}>
					<h1 style={{ fontSize: "45px" }} >Video Meeting</h1>
					<p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>Start or join a meeting</p>
					<Input placeholder="URL" onChange={e => handleChange(e)} />
					<Button variant="contained" color="primary" onClick={join} style={{ margin: "20px" }}>Go</Button>
				</div>
			</div>
			</body>
		)
	
}

export default HomePage;
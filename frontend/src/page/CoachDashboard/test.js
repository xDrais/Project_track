import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./CoachDashboard.css"
import { useSpring, animated } from '@react-spring/web'

import {
  VictoryChart,
  VictoryAxis,
  VictoryPie,
  VictoryStack
} from 'victory';
import Loader from '../../Components/Loader';


function TEST() {
  const props = useSpring({
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0%)' },
    config: { tension: 200, friction: 20 },
  });
  const [popularCourseData, setPopularCourseData] = useState([]);
  const colorScale = ["#635139", "#bfbeb9", "#977d62", "#bc8e77", "#D2691E", "#A5673F", "#6B4423", "#654321", "#D2B48C", "#DEB887"];
  const animation = {
    duration: 2000,
    easing: 'bounce',
  };
  useEffect(() => {
    axios.get('http://localhost:5000/course/getPopularCat')
      .then(res => {
        const data = res.data.map(item => ({ label: item.category, value: Number(item.count) }));
        console.log(data);
        setPopularCourseData(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <animated.div style={props}>

   
        <h4 style={{color : "white",marginBottom : "-300px"}}> Popular Course Categories</h4>
        <div>
    {popularCourseData.length > 0 ? (
        <div>
  <VictoryPie  
  data={popularCourseData}          colorScale={colorScale}
  animate={animation}
  style={{
  labels: { fontSize: 1.8, fill: "white" } 
}}
  x="label"
  y="value"
  labelRadius={14}
  height={120}
  width={120}  

/> </div>
    ) : (
     <Loader />
    )}
  </div>     </animated.div>

  );
}

export default TEST;

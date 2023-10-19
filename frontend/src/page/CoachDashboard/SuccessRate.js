import { useState, useEffect } from "react";
import axios from "axios";
import { VictoryPie } from "victory";
import { useDispatch, useSelector } from "react-redux";
import TEST from "./test";
import EnrollChart from "./MostEnrolled";
import { useSpring, animated } from '@react-spring/web'
import Loader from "../../Components/Loader";

const SuccessRate = () => {
  const [data, setData] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const props = useSpring({
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0%)' },
    config: { tension: 200, friction: 20 },
  });
  const getCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/course/courseById/${userInfo._id}`,
        { method: "GET" }
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const successratepourcentage = async (courseId) => {
    try {
      const res = await axios.get(`http://localhost:5000/course/SuccessRate/${courseId}`);
      console.log(res);
      return res.data.count;
    } catch (err) {
      console.error(err);
      return 0;
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
        try {
          const courseData = await getCourse();

          console.log(courseData);
          const newData = await Promise.all(courseData.map(async (course) => {
            const successratepourcentaged = await successratepourcentage(course._id);
      console.log("successratepourcentaged:", successratepourcentaged); // log the value of successratepourcentaged
            return { 
              x: course.titleCourse,
              y: [ successratepourcentaged],
              labels: [ `${successratepourcentaged} successratepourcentage`],
              colorScale: ["#EFDC8D", "#F0904B", "#EFBE49"],
              labelRadius: 10,
            };
          }));
      
          // calculate the total success rate
          const totalSuccessRate = newData.reduce((total, courseData) => {
            return total + courseData.y[0];
          }, 0);
      
          // add the total success rate as a new item to the newData array
          newData.push({
            x: "Total Success Rate",
            y: [totalSuccessRate],
            labels: [`${totalSuccessRate}%`],
            colorScale: ["#EFDC8D", "#F0904B", "#EFBE49"],
            labelRadius: 10,
          });
      
          setData(newData.filter(d => !d.noData));
        } catch (error) {
          console.error(error);
        }
      };
      fetchData(); 
    }, [userInfo._id]);
  

  return (
    <animated.div style={props}>

    <div style={{display:"flex"}}> 
    {data ? (
  <>
    {data.map((d, index) => { 
      return ( 
        <div key={index}>
          <h4 style={{color: "white", marginBottom : "-30px"}}>{d.x}</h4>
          <VictoryPie  
            data={d.y.map((y, i) => ({ x: d.labels[i], y }))}
            colorScale={d.colorScale}
            labelRadius={d.labelRadius}
            style={{ marginTop : "-500px",
              labels: { fontSize: 12 , fontWeight: "bold", fill: "white" }
            }}
            height={300}
            width={300}  
            animate={{
              duration: 1000,
              easing: "bounce",
              onLoad: { duration: 500 }
            }}
          /> 
        </div>
      );
    })}
    <div>
      <h4 style={{color: "white", marginBottom : "-30px"}}>Total Success Rate</h4>
      <VictoryPie  
        data={[{ x: "Total Success Rate", y: [data.reduce((total, d) => total + d.y[0], 0)] }]}
        colorScale={["#EFDC8D", "#F0904B", "#EFBE49"]}
        labelRadius={10}
        style={{ marginTop : "-500px",
          labels: { fontSize: 12 , fontWeight: "bold", fill: "white" }
        }}
        height={300}
        width={300}  
        animate={{
          duration: 1000,
          easing: "bounce",
          onLoad: { duration: 500 }
        }}
      /> 
    </div>
  </>

    ):(<><Loader /> </>)}
    
 </div> </animated.div>
 );
};

export default SuccessRate;

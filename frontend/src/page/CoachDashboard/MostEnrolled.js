import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis,VictoryPie,VictoryLabel } from 'victory';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios'
import confetti from "https://esm.run/canvas-confetti@1";
import { useSpring, animated } from '@react-spring/web'

const EnrollChart = () => {
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [maxEnrollCourse, setMaxEnrollCourse] = useState([]);
  const [maxEnrollCount, setMaxEnrollCount] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Fetch the courses and enrollment count data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the courses for the user
        const courseResponse = await fetch(`http://localhost:5000/course/courseById/${userInfo._id}`);
        const courses = await courseResponse.json();
        console.log(courses);
        // Map over the courses to fetch the enrollment count for each course
        const countPromises = courses.map(course => {
          return axios.get(`http://localhost:5000/course/countEnroll/${course._id}`);
        });
        const countResponses = await Promise.all(countPromises);
        const counts = countResponses.map(response => response.data.count);
        console.log(counts);

        // Find the course with the highest enrollment count
        const maxEnrollCount = Math.max(...counts);
                setMaxEnrollCount(maxEnrollCount);
        const maxEnrollCourseIndex = counts.findIndex(count => count === maxEnrollCount);
        const maxEnrollCourse = courses[maxEnrollCourseIndex];
        console.log(maxEnrollCourse);


        // Set the state with the course with the highest enrollment count
        setMaxEnrollCourse(maxEnrollCourse);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userInfo._id]);
  
  return (
    
    <div style={{height:"300px"}} align="center">
                                <h4 style={{color: "white"}}> Most Popular course with {maxEnrollCount} Enrolls </h4>

      <VictoryPie 
        data={[{ x: maxEnrollCourse.titleCourse, y: maxEnrollCount }]}
        colorScale={["#FFD700", "#CD7F32", "#C0C0C0", "#ADD8E6", "#20B2AA", "#7B68EE"]}
        innerRadius={60}
        labelRadius={40}
        height={250}
        width={250}
        style={{ labels: { fontSize: 14, fontWeight: "bold", fill: "white" } ,marginTop: "-100px"}}
        labelComponent={<VictoryLabel />}
      />
    </div>
  );
};
export default EnrollChart;
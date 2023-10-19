import { useState, useEffect } from "react";
import axios from "axios";
import { VictoryPie } from "victory";
import { useSpring, animated } from '@react-spring/web'
import Loader from "../../Components/Loader";
import AgeSectionPourcentage from "./AgeSection";

const CoursesChart = ({ courseId }) => {
  const [courseData, setCourseData] = useState(null);
  const [notStarted, setNotStarted] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [completed, setCompleted] = useState(0);

  const props = useSpring({
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0%)' },
    config: { tension: 200, friction: 20 },
  });

  const fetchCourseData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/course/courseById/${courseId}`);
      setCourseData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEnrollmentCounts = async () => {
    try {
      const notStartedRes = await axios.get(`http://localhost:5000/course/countNotStartedEnrollments/${courseId}`);
      setNotStarted(notStartedRes.data.count);

      const inProgressRes = await axios.get(`http://localhost:5000/course/countInProgressEnrollments/${courseId}`);
      setInProgress(inProgressRes.data.count);

      const completedRes = await axios.get(`http://localhost:5000/course/countCompletedEnrollments/${courseId}`);
      setCompleted(completedRes.data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourseData();
    fetchEnrollmentCounts();
  }, [courseId]);

  if (!courseData) {
    return <Loader />;
  }

  const { titleCourse } = courseData;

  const data = [
    {
      x: titleCourse,
      y: [notStarted, inProgress, completed],
      labels: [`${notStarted} not started`, `${inProgress} in progress`, `${completed} completed`],
      colorScale: ["#b68871", "#918473", "#d09e85"],
      labelRadius: 10,
    }
  ];

  return (
    <animated.div style={props}>
      <div style={{display:'flex',Left:'600px'}} ><AgeSectionPourcentage courseId={courseId} />
      <div> <h3 style={{color:'white'}}> Completion rate </h3>
        <h4 style={{ color: "white", marginBottom : "-30px" }}>{titleCourse}</h4>
        <VictoryPie
          data={data[0].y.map((y, i) => ({ x: data[0].labels[i], y }))}
          colorScale={data[0].colorScale}
          labelRadius={data[0].labelRadius}
          style={{
            labels: { fontSize: 60 , fontWeight: "bold", fill: "white" }
          }}
          height={1000}
          width={1000}
          animate={{
            duration: 1000,
            easing: "bounce",
            onLoad: { duration: 500 }
          }}
        /> </div>
      </div>
    </animated.div>
  );
};

export default CoursesChart;

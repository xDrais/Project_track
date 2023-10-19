import { useState, useEffect } from "react";
import axios from "axios";
import { VictoryPie } from "victory";
import { useSelector } from "react-redux";

const AgeSectionPourcentage = ({courseId }) => {
  const [courseData, setCourseData] = useState([]);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const getCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/course/courseByIds/${courseId}`);
      setCourseData(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const AgePourcentage = async (courseId) => {
    try {
      const res = await axios.get(`http://localhost:5000/course/getAgePourcentage/${courseId}`);
      const data = res.data;
      const total = data.above30 + data.below30;
      const below30 = total > 0 ? ((data.below30 / total) * 100).toFixed(0) : 0;
      const above30 = total > 0 ? ((data.above30 / total) * 100).toFixed(0) : 0;
      return {
        below30: `${below30}%`,
        above30: `${above30}%`,
      };
    } catch (err) {
      console.error(err);
      return {
        below30: 'No data',
        above30: 'No data',
      };
    }
  };

  const fetchData = async () => {
    try {
      const courseData = await getCourse();
      const ageSectionPercentage = await AgePourcentage(courseData._id);

      const newData = [
        {
          x: "Below 30",
          y: parseInt(ageSectionPercentage.below30) || 0,
        },
        {
          x: "Above 30",
          y: parseInt(ageSectionPercentage.above30) || 0,
        },
      ];

      const totalAgeSectionPercentage = newData.reduce((total, data) => {
        return total + (data.y || 0);
      }, 0);

      

      setCourseData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {courseData && courseData.length > 0 ? (<> <div>
        <h3 style={{ marginBottom : "-20px",color:'white'}}>Students Age Group</h3>
        <VictoryPie
          data={courseData}
          colorScale={["#d09e85", "#878573", "#EFBE49"]}
          labelRadius={100}
          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
          style={{ marginTop:"-100px",
            labels: { fontSize: 60, fill: "White" },
          }}
          height={1000}
          width={1000}
          animate={{
            duration: 1000,
            easing: "bounce",
            onLoad: { duration: 500 },
          }}
        /> </div></> 
      ) : (
        <p>No data available.</p>
      )}
    </>
  );
};

export default AgeSectionPourcentage;

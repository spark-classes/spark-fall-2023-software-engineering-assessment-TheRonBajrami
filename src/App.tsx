import React, { useEffect, useState } from 'react';
import { fetchClasses, fetchAssignments, fetchStudents } from './utils/calculate_grade';
import { GradeTable } from './components/GradeTable';

function App() {
  const [classData, setClassData] = useState([]);
  const [gradeData, setGradeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const classes = await fetchClasses("Fall2023");
      setClassData(classes);

      if (classes.length > 0) {
        const classId = classes[0].classId; // Assuming you want to fetch data for the first class
        const assignments = await fetchAssignments(classId);
        const students = await fetchStudents(classId);

        // Perform any necessary data processing here

        setGradeData(processedData); // Update state with processed data
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <GradeTable classData={classData} gradeData={gradeData} />
    </div>
  );
}

export default App;

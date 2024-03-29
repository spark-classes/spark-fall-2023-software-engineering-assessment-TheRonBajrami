import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography, MenuItem, SelectChangeEvent } from "@mui/material";
import { BASE_API_URL, GET_DEFAULT_HEADERS, MY_BU_ID } from "./globals";
import { IUniversityClass, IStudentGrade } from "./types/api_types";
import { GradeTable } from './components/GradeTable';
import { fetchClasses, fetchAssignments, fetchStudents, calcAllFinalGrade } from './utils/calculate_grade';

// Added API utility functions based on the instructions
export async function enrollStudent(studentData: any) {
  const response = await fetch(`${BASE_API_URL}/student?buid=${MY_BU_ID}`, {
    method: "POST",
    headers: {
      ...GET_DEFAULT_HEADERS(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });
  if (!response.ok) {
    console.error("Failed to enroll student");
    return null;
  }
  return await response.json();
}

export async function fetchStudentById(studentId: string) {
  const response = await fetch(`${BASE_API_URL}/student/GetById/${studentId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      ...GET_DEFAULT_HEADERS(),
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch student by ID");
    return null;
  }
  return await response.json();
}

export async function fetchAssignmentsForClass(classId: string) {
  const response = await fetch(`${BASE_API_URL}/class/listAssignments/${classId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      ...GET_DEFAULT_HEADERS(),
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch assignments for class");
    return [];
  }
  return await response.json();
}

export async function fetchStudentsInClass(classId: string) {
  const response = await fetch(`${BASE_API_URL}/class/listStudents/${classId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      ...GET_DEFAULT_HEADERS(),
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch students in class");
    return [];
  }
  return await response.json();
}

function App() {
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [gradeData, setGradeData] = useState<IStudentGrade[]>([]);

  useEffect(() => {
    const fetchClassList = async () => {
      const classes = await fetchClasses("fall2022");
      setClassList(classes);
    };

    fetchClassList();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (currClassId) {
        const processedData = await calcAllFinalGrade(currClassId);
        setGradeData(processedData);
      }
    };

    fetchData();
  }, [currClassId]);

  useEffect(() => {
    const fetchData = async () => {
      if (currClassId) {
        const processedData = await calcAllFinalGrade(currClassId);
        setGradeData(processedData);
      }
    };

    fetchData();
  }, [currClassId]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Grid container spacing={2} style={{ padding: "1rem" }}>
        <Grid xs={12} container alignItems="center" justifyContent="center">
          <Typography variant="h2" gutterBottom>
            Spark Assessment
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <Typography variant="h4" gutterBottom>
            Select a class
          </Typography>
          <div style={{ width: "100%" }}>
            <Select
              value={currClassId}
              onChange={handleClassChange}
              fullWidth={true}
              label="Class"
            >
              {classList.map((uniClass: IUniversityClass) => (
                <MenuItem key={uniClass.classId} value={uniClass.classId}>
                  {uniClass.title}
                </MenuItem>
              ))}
            </Select>
          </div>
        </Grid>
        <Grid xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Final Grades
          </Typography>
          <GradeTable classData={classList} gradeData={gradeData} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

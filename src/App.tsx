import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography, MenuItem, SelectChangeEvent } from "@mui/material";
import { BASE_API_URL, GET_DEFAULT_HEADERS, MY_BU_ID } from "./globals";
import { IUniversityClass, IStudentGrade } from "./types/api_types";
import { GradeTable } from './components/GradeTable';
import { fetchClasses, fetchAssignments, fetchStudents, calcAllFinalGrade } from './utils/calculate_grade';

// Enrolls a student with the provided data to the API.
export async function enrollStudent(studentData: any) {
  const response = await fetch(`${BASE_API_URL}/student?buid=${MY_BU_ID}`, {
    method: "POST",
    headers: {
      ...GET_DEFAULT_HEADERS(),
      "Content-Type": "application/json",
      "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==", // Manually set token
    },
    body: JSON.stringify(studentData),
  });
  if (!response.ok) {
    console.error("Failed to enroll student");
    return null;
  }
  return await response.json();
}

// Fetches details of a student by their ID from the API.
export async function fetchStudentById(studentId: string) {
  const response = await fetch(`${BASE_API_URL}/student/GetById/${studentId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      ...GET_DEFAULT_HEADERS(),
      "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==", // Manually set token
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch student by ID");
    return null;
  }
  return await response.json();
}

// Fetches a list of assignments for a specific class from the API.
export async function fetchAssignmentsForClass(classId: string) {
  const response = await fetch(`${BASE_API_URL}/class/listAssignments/${classId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      ...GET_DEFAULT_HEADERS(),
      "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==", // Manually set token
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch assignments for class");
    return [];
  }
  return await response.json();
}

// Fetches a list of students enrolled in a specific class from the API.
export async function fetchStudentsInClass(classId: string) {
  const response = await fetch(`${BASE_API_URL}/class/listStudents/${classId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==", // Manually set token
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch students in class");
    return [];
  }
  return await response.json();
}

// Fetches the grades of a student in a specific class from the API.
export async function fetchStudentGradesInClass(studentId: string, classId: string) {
  const response = await fetch(`${BASE_API_URL}/student/listGrades/${studentId}/${classId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      ...GET_DEFAULT_HEADERS(),
      "x-functions-key": "6se7z2q8WGtkxBlXp_YpU-oPq53Av-y_GSYiKyS_COn6AzFuTjj4BQ==", // Manually set token
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch student grades in class");
    return null;
  }
  return await response.json();
}

// The main component of the application, responsible for rendering the UI and managing state.
function App() {
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);
  const [gradeData, setGradeData] = useState<IStudentGrade[]>([]);

  // Fetches and sets the list of classes available for the current semester.
  useEffect(() => {
    const fetchClassList = async () => {
      const classes = await fetchClasses("fall2022");
      setClassList(classes);
    };

    fetchClassList();
  }, []);

  // Fetches and sets the grade data for the currently selected class.
  useEffect(() => {
    const fetchData = async () => {
      if (currClassId) {
        const processedData = await calcAllFinalGrade(currClassId);
        setGradeData(processedData);
      }
    };

    fetchData();
  }, [currClassId]);

  // Handles changes to the class selection dropdown.
  function handleClassChange(event: SelectChangeEvent) {
    setCurrClassId(event.target.value as string);
  }

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
          <GradeTable classData={classList} gradeData={gradeData} selectedClassId={currClassId} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

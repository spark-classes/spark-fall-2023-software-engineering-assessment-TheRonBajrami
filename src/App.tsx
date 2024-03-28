import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Select, Typography, MenuItem, SelectChangeEvent } from "@mui/material";
/**
 * You will find globals from this file useful!
 */
import { BASE_API_URL, GET_DEFAULT_HEADERS } from "./globals";
import { IUniversityClass } from "./types/api_types";
import { GradeTable } from './components/GradeTable';

function App() {
  // You will need to use more of these!
  const [currClassId, setCurrClassId] = useState<string>("");
  const [classList, setClassList] = useState<IUniversityClass[]>([]);

  useEffect(() => {
    const fetchClassList = async () => {
      const response = await fetch(`${BASE_API_URL}/classes`, {
        method: "GET",
        headers: GET_DEFAULT_HEADERS(),
      });
      if (!response.ok) {
        // Handle error
        console.error("Failed to fetch class list");
        return;
      }
      const data = await response.json();
      setClassList(data);
    };

    fetchClassList();
  }, []);

  const handleClassChange = (event: SelectChangeEvent) => {
    setCurrClassId(event.target.value as string);
  };

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
          <GradeTable />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

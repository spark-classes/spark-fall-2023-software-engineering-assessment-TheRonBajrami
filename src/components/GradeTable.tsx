import { DataGrid } from '@mui/x-data-grid';
import { IUniversityClass, IStudentGrade, IStudent } from "../types/api_types";
import React, { useEffect, useState } from 'react';
import { fetchStudentsInClass } from '../utils/calculate_grade';
import { fetchStudentById, fetchAssignmentsForClass, fetchStudentGradesInClass } from '../App';

/**
 * Function to provide dummy data for testing purposes.
 */
export function dummyData() {
  return [];
}

/**
 * Component for displaying the grade table.
 * Requires class data and grade data as props.
 */
export const GradeTable = ({ classData, gradeData, selectedClassId }: { classData: IUniversityClass[], gradeData: IStudentGrade[], selectedClassId: string }) => {
  // Define columns for the DataGrid
  const columns = [
    { field: 'studentId', headerName: 'Student ID', width: 120 },
    { field: 'studentName', headerName: 'Student Name', width: 150 },
    { field: 'classId', headerName: 'Class ID', width: 120 },
    { field: 'className', headerName: 'Class Name', width: 150 },
    { field: 'semester', headerName: 'Semester', width: 120 },
    { field: 'finalGrade', headerName: 'Final Grade', width: 120 },
  ];

  // State to store the rows of the DataGrid
  const [rows, setRows] = useState<{ id: number, studentId: string, studentName: string, classId: string, className: string, semester: string, finalGrade: number }[]>([]);

  useEffect(() => {
    // Fetches detailed student information, assignments, and calculates final grades.
    const fetchData = async () => {
      const selectedClass = classData.find(c => c.classId === selectedClassId);
      if (!selectedClass || gradeData.length === 0) return;

      // Define the Assignment interface
      interface Assignment {
        assignmentId: string;
        weight: number;
      }

      // Fetch assignments for the selected class
      const assignments: Assignment[] = await fetchAssignmentsForClass(selectedClass.classId) || [];
      console.log(assignments);

      // Create a map to store assignment weights
      const assignmentWeights: { [assignmentId: string]: number } = {};
      for (const assignment of assignments) {
        assignmentWeights[assignment.assignmentId] = assignment.weight;
      }

      // Fetch student IDs in the selected class
      const studentIds = await fetchStudentsInClass(selectedClass.classId);
      if (!studentIds) return;

      // Process detailed student information
      const detailedStudents = await Promise.all(studentIds.map(async (studentId: string) => {
        const studentGrades = await fetchStudentGradesInClass(studentId, selectedClass.classId);
        if (!studentGrades) return null;

        let finalGrade = 0;
        for (const [assignmentId, grade] of Object.entries(studentGrades.grades)) {
          const weight = assignmentWeights[assignmentId] || 0; // Ensure weight is correctly fetched from assignmentWeights
          const numericGrade = parseFloat(String(grade));
          const numericWeight = parseFloat(String(weight));
          if (!isNaN(numericGrade) && !isNaN(numericWeight)) {
            finalGrade += numericGrade * numericWeight; // Add the weighted grade to the finalGrade
          } 
        }

        return {
          studentId: studentId,
          name: studentGrades.name,
          finalGrade
        };
      }));

      // Filter out any null values that may have been returned due to missing student grades
      const filteredDetailedStudents = detailedStudents.filter(student => student !== null);

      // Update the rows state with the processed student data for display in the DataGrid
      setRows(filteredDetailedStudents.map((student, index) => ({
        id: index + 1,
        studentId: student.studentId,
        studentName: `${student.name}`,
        classId: selectedClass.classId,
        className: selectedClass.title,
        semester: selectedClass.semester,
        finalGrade: student.finalGrade,
      })));
    };

    fetchData();
  }, [selectedClassId, gradeData]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};


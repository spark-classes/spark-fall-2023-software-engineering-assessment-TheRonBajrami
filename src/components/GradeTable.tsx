import { DataGrid } from '@mui/x-data-grid';
import { IUniversityClass, IStudentGrade, IStudent } from "../types/api_types";
import React, { useEffect, useState } from 'react';
import { fetchStudentsInClass } from '../utils/calculate_grade';
import { fetchStudentById, fetchAssignmentsForClass, fetchStudentGradesInClass } from '../App';

/**
 * You might find it useful to have some dummy data for your own testing.
 * Feel free to write this function if you find that feature desirable.
 * 
 * When you come to office hours for help, we will ask you if you have written
 * this function and tested your project using it.
 */
export function dummyData() {
  return [];
}

/**
 * This is the component where you should write the code for displaying the
 * the table of grades.
 *
 * You might need to change the signature of this function.
 *
 */
// Component for displaying the grade table. Requires class data and grade data as props.
export const GradeTable = ({ classData, gradeData, selectedClassId }: { classData: IUniversityClass[], gradeData: IStudentGrade[], selectedClassId: string }) => {
  const columns = [
    { field: 'studentId', headerName: 'Student ID', width: 120 },
    { field: 'studentName', headerName: 'Student Name', width: 150 },
    { field: 'classId', headerName: 'Class ID', width: 120 },
    { field: 'className', headerName: 'Class Name', width: 150 },
    { field: 'semester', headerName: 'Semester', width: 120 },
    { field: 'finalGrade', headerName: 'Final Grade', width: 120 },
  ];

  const [rows, setRows] = useState<{ id: number, studentId: string, studentName: string, classId: string, className: string, semester: string, finalGrade: number }[]>([]);

  useEffect(() => {
    // Fetches detailed student information, assignments, and calculates final grades.
    const fetchData = async () => {
      const selectedClass = classData.find(c => c.classId === selectedClassId);
      if (!selectedClass || gradeData.length === 0) return;

      interface Assignment {
        assignmentId: string;
        weight: number;
      }

      const assignments: Assignment[] = await fetchAssignmentsForClass(selectedClass.classId) || [];
      console.log(assignments);
      const assignmentWeights: { [assignmentId: string]: number } = {};
      for (const assignment of assignments) {
        assignmentWeights[assignment.assignmentId] = assignment.weight;
      }

      const studentIds = await fetchStudentsInClass(selectedClass.classId);
      if (!studentIds) return;

      const detailedStudents = await Promise.all(studentIds.map(async (studentId: string) => {
        const studentGrades = await fetchStudentGradesInClass(studentId, selectedClass.classId);
        if (!studentGrades) return null;

        let finalGrade = 0;
        for (const [assignmentId, grade] of Object.entries(studentGrades.grades)) {
          const weight = assignmentWeights[assignmentId] || 0; // Ensure weight is correctly fetched from assignmentWeights
          finalGrade += grade as number; // Adjusted calculation
        }

        return {
          studentId: studentId,
          name: studentGrades.name,
          finalGrade
        };
      }));

      // Filter out any null values that may have been returned due to missing student grades
      const filteredDetailedStudents = detailedStudents.filter(student => student !== null);

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

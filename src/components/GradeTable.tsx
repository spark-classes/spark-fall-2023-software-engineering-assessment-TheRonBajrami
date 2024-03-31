import { DataGrid } from '@mui/x-data-grid';
import { IUniversityClass, IStudentGrade, IStudent } from "../types/api_types";
import React, { useEffect, useState } from 'react';
import { fetchStudentsInClass } from '../utils/calculate_grade';
import { fetchStudentById } from '../App';

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
export const GradeTable = ({ classData, gradeData }: { classData: IUniversityClass[], gradeData: IStudentGrade[] }) => {
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
    // Fetches detailed student information and sets the rows for the DataGrid based on the provided class and grade data.
    const fetchData = async () => {
      if (classData.length > 0 && gradeData.length > 0) {
        const students: IStudent[] | undefined = await fetchStudentsInClass(classData[0].classId);
        if (students) {
          const detailedStudents = await Promise.all(students.map(async (student) => {
            const detailedStudent = await fetchStudentById(student.studentId);
            return {
              ...student,
              firstName: detailedStudent.firstName,
              lastName: detailedStudent.lastName,
            };
          }));
          setRows(detailedStudents.map((student: IStudent, index: number) => ({
            id: index + 1,
            studentId: student.studentId,
            studentName: `${student.firstName} ${student.lastName}`,
            classId: classData[0].classId,
            className: classData[0].title,
            semester: classData[0].semester,
            finalGrade: gradeData.find(grade => grade.studentId === student.studentId)?.finalGrade || 0,
          })));
        }
      }
    };

    fetchData();
  }, [classData, gradeData]);

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

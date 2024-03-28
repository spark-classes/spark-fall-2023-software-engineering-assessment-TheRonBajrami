import { DataGrid } from '@mui/x-data-grid';
import { IUniversityClass } from "../types/api_types";

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

export const GradeTable = ({ classList }: { classList: IUniversityClass[] }) => {
  const columns = [
    { field: 'studentId', headerName: 'Student ID', width: 120 },
    { field: 'studentName', headerName: 'Student Name', width: 150 },
    { field: 'classId', headerName: 'Class ID', width: 120 },
    { field: 'className', headerName: 'Class Name', width: 150 },
    { field: 'semester', headerName: 'Semester', width: 120 },
    { field: 'finalGrade', headerName: 'Final Grade', width: 120 },
  ];

  const rows = [
    { id: 1, studentId: 'S001', studentName: 'Alice', classId: 'C001', className: 'Math', semester: 'Spring', finalGrade: 85 },
    { id: 2, studentId: 'S002', studentName: 'Bob', classId: 'C002', className: 'Science', semester: 'Fall', finalGrade: 78 },
    // Add more rows as per your data
  ];

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

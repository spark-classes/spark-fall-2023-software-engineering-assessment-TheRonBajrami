/**
 * This file contains some function stubs(ie incomplete functions) that
 * you MUST use to begin the work for calculating the grades.
 *
 * You may need more functions than are currently here...we highly encourage you to define more.
 *
 * Anything that has a type of "undefined" you will need to replace with something.
 */
import { IUniversityClass, IAssignment, IStudentGrade } from "../types/api_types";
import { GET_DEFAULT_HEADERS, BASE_API_URL, MY_BU_ID, TOKEN } from "../globals"; // Added MY_BU_ID import

/**
 * This function might help you write the function below.
 * It retrieves the final grade for a single student based on the passed params.
 * 
 * If you are reading here and you haven't read the top of the file...go back.
 */
export async function calculateStudentFinalGrade(
  studentID: string,
  classAssignments: IAssignment[],
  klass: IUniversityClass
): Promise<number> {
  let finalGrade = 0;
  classAssignments.forEach(assignment => {
    finalGrade += assignment.grade * assignment.weight;
  });
  return finalGrade;
}

/**
 * You need to write this function! You might want to write more functions to make the code easier to read as well.
 * 
 *  If you are reading here and you haven't read the top of the file...go back.
 * 
 * @param classID The ID of the class for which we want to calculate the final grades
 * @returns Some data structure that has a list of each student and their final grade.
 */
export async function calcAllFinalGrade(classID: string): Promise<IStudentGrade[]> {
  const classes = await fetchClasses("fall2022");
  const classAssignments = await fetchAssignments(classID);
  const students = await fetchStudents(classID);

  const currentClass: IUniversityClass = { classId: "yourClassId", title: "Class Title", description: "Class Description", meetingTime: "Class Time", meetingLocation: "Class Location", status: "Class Status", semester: "Class Semester" };

  const studentGrades: IStudentGrade[] = [];
  for (const student of students) {
    const studentFinalGrade = await calculateStudentFinalGrade(student.studentId, classAssignments, currentClass);
    studentGrades.push({ studentId: student.studentId, finalGrade: studentFinalGrade });
  }
  return studentGrades;
}

export async function fetchClasses(semester: string) {
  const response = await fetch(`${BASE_API_URL}/class/listBySemester/${semester}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": TOKEN,
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch classes");
    return [];
  }
  return await response.json();
}

export async function fetchAssignments(classId: string) {
  const response = await fetch(`${BASE_API_URL}/class/listAssignments/${classId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": TOKEN,
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch assignments");
    return [];
  }
  return await response.json();
}

export async function fetchStudents(classId: string) {
  const response = await fetch(`${BASE_API_URL}/class/listStudents/${classId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": TOKEN,
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch students");
    return [];
  }
  return await response.json();
}

export async function fetchStudentsInClass(classId: string) {
  // Function implementation
}
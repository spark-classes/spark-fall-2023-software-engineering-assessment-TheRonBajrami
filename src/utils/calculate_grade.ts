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
 * Calculates the final grade for a single student in a specific class.
 * It iterates over all assignments of the class, applying the grade and weight
 * to compute the final grade.
 *
 * @param studentID The unique identifier for the student.
 * @param classAssignments An array of assignments related to the class.
 * @param klass The class object containing details about the class.
 * @returns The final grade as a number.
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
 * Calculates the final grades for all students in a given class.
 * It fetches classes, assignments, and students related to the classID,
 * then computes each student's final grade using calculateStudentFinalGrade.
 *
 * @param classID The unique identifier for the class.
 * @returns An array of objects, each containing a studentId and their finalGrade.
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

/**
 * Fetches a list of classes for a given semester.
 * It makes a GET request to the API, appending the semester and BU ID to the URL.
 *
 * @param semester The semester for which to fetch classes (e.g., "fall2022").
 * @returns An array of class objects if successful, or an empty array on failure.
 */
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

/**
 * Fetches a list of assignments for a given class.
 * It makes a GET request to the API, appending the classId and BU ID to the URL.
 *
 * @param classId The unique identifier for the class.
 * @returns An array of assignment objects if successful, or an empty array on failure.
 */
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

/**
 * Fetches a list of students enrolled in a given class.
 * It makes a GET request to the API, appending the classId and BU ID to the URL.
 *
 * @param classId The unique identifier for the class.
 * @returns An array of student objects if successful, or an empty array on failure.
 */
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

/**
 * Fetches a list of students enrolled in a given class.
 * Similar to fetchStudents, but specifically designed to be used within the GradeTable component.
 * It makes a GET request to the API, appending the classId and BU ID to the URL.
 *
 * @param classId The unique identifier for the class.
 * @returns An array of student objects if successful, or an empty array on failure.
 */
export async function fetchStudentsInClass(classId: string) {
  const response = await fetch(`${BASE_API_URL}/class/listStudents/${classId}?buid=${MY_BU_ID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-functions-key": TOKEN,
    },
  });
  if (!response.ok) {
    console.error("Failed to fetch students in class");
    return [];
  }
  return await response.json();
}
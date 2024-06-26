/**
 * This file can be used to store types and interfaces for data received from the API.
 * It's good practice to name your interfaces in the following format:
 * IMyInterfaceName - Where the character "I" is prepended to the name of your interface.
 * This helps remove confusion between classes and interfaces.
 */

/**
 * This represents a class as returned by the API
 */
export interface IUniversityClass {
  classId: string;
  title: string;
  description: string;
  meetingTime: string;
  meetingLocation: string;
  status: string;
  semester: string;
}
export interface IStudent {
  studentId: string;
  firstName: string;
  lastName: string;
}

export interface IAssignment {
  assignmentId: string;
  title: string;
  grade: number; // Assuming grade is a numeric value
  weight: number; // Assuming weight is a percentage represented as a number (e.g., 0.25 for 25%)
}

export interface IStudentGrade {
  studentId: string;
  finalGrade: number;
}


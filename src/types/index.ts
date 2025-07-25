export interface Student {
  id: string;
  name: string;
  email: string;
  student_id: string;
  created_at: string;
  created_by?: string;
}

export interface AttendanceRecord {
  id: string;
  userId:string;
  userName:string;
  student_id: string;
  check_in_time: string;
  check_out_time?: string;
  duration_minutes?: number;
  date: string;
  created_at: string;
  student?: Student;
}

export interface AttendanceWithStudent extends AttendanceRecord {
  student: Student;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'student';
}
import { User, AttendanceRecord } from '../types';

const USERS_KEY = 'attendance_users';
const RECORDS_KEY = 'attendance_records';
const CURRENT_USER_KEY = 'current_user';

// Mock users for demo
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'admin',
    department: 'IT'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: 'employee',
    department: 'Marketing'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    role: 'employee',
    department: 'Sales'
  }
];

export const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(RECORDS_KEY)) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify([]));
  }
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : defaultUsers;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const getAttendanceRecords = (): AttendanceRecord[] => {
  const records = localStorage.getItem(RECORDS_KEY);
  return records ? JSON.parse(records) : [];
};

export const saveAttendanceRecord = (record: AttendanceRecord) => {
  const records = getAttendanceRecords();
  const existingIndex = records.findIndex(r => r.id === record.id);
  
  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};

export const getUserTodayRecord = (userId: string): AttendanceRecord | null => {
  const records = getAttendanceRecords();
  const today = new Date().toISOString().split('T')[0];
  return records.find(r => r.userId === userId && r.date === today) || null;
};
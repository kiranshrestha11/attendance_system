// import React, { useState, useEffect } from 'react';
// import { Users, Plus, Edit2, Trash2, Search } from 'lucide-react';
// import { User, AttendanceRecord } from '../types';
// import { getUsers, getAttendanceRecords } from '../utils/storage';

// interface EmployeeManagementProps {
//   user: User;
// }

// export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ user }) => {
//   const [employees, setEmployees] = useState<User[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('all');
//   const [attendanceData, setAttendanceData] = useState<{[key: string]: AttendanceRecord[]}>({});

//   useEffect(() => {
//     loadEmployees();
//     loadAttendanceData();
//   }, []);

//   const loadEmployees = () => {
//     const allUsers = getUsers().filter(u => u.id !== user.id);
//     setEmployees(allUsers);
//   };

//   const loadAttendanceData = () => {
//     const records = getAttendanceRecords();
//     const groupedRecords = records.reduce((acc, record) => {
//       if (!acc[record.userId]) {
//         acc[record.userId] = [];
//       }
//       acc[record.userId].push(record);
//       return acc;
//     }, {} as {[key: string]: AttendanceRecord[]});
    
//     setAttendanceData(groupedRecords);
//   };

//   const getEmployeeStats = (employeeId: string) => {
//     const records = attendanceData[employeeId] || [];
//     const last30Days = records.slice(-30);
//     const presentDays = last30Days.filter(r => r.status === 'present' || r.status === 'late').length;
//     const lateDays = last30Days.filter(r => r.status === 'late').length;
    
//     return {
//       totalDays: last30Days.length,
//       presentDays,
//       lateDays,
//       attendanceRate: last30Days.length > 0 ? Math.round((presentDays / last30Days.length) * 100) : 0
//     };
//   };

//   const filteredEmployees = employees.filter(employee => {
//     const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          employee.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
//     return matchesSearch && matchesDepartment;
//   });

//   const departments = [...new Set(employees.map(e => e.department))];

//   if (user.role !== 'admin') {
//     return (
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="text-center py-12">
//           <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
//           <p className="text-gray-600">You don't have permission to view employee management.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
//         <p className="text-gray-600 mt-2">Manage employees and view their attendance records</p>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search employees..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
            
//             <select
//               value={selectedDepartment}
//               onChange={(e) => setSelectedDepartment(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Departments</option>
//               {departments.map(dept => (
//                 <option key={dept} value={dept}>{dept}</option>
//               ))}
//             </select>
//           </div>

//           <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
//             <Plus className="h-4 w-4" />
//             Add Employee
//           </button>
//         </div>
//       </div>

//       {/* Employee Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredEmployees.map(employee => {
//           const stats = getEmployeeStats(employee.id);
//           return (
//             <div key={employee.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center">
//                   <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-blue-600 font-semibold text-lg">
//                       {employee.name.split(' ').map(n => n[0]).join('')}
//                     </span>
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
//                     <p className="text-sm text-gray-600">{employee.department}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex gap-1">
//                   <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
//                     <Edit2 className="h-4 w-4" />
//                   </button>
//                   <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <p className="text-sm text-gray-600">{employee.email}</p>
//                   <p className="text-xs text-gray-500 capitalize">{employee.role}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
//                   <div className="text-center">
//                     <div className="text-xl font-bold text-green-600">{stats.attendanceRate}%</div>
//                     <div className="text-xs text-gray-600">Attendance</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xl font-bold text-blue-600">{stats.presentDays}</div>
//                     <div className="text-xs text-gray-600">Present Days</div>
//                   </div>
//                 </div>

//                 {stats.lateDays > 0 && (
//                   <div className="flex items-center justify-center p-2 bg-yellow-50 rounded-lg">
//                     <span className="text-sm text-yellow-700">
//                       {stats.lateDays} late arrival{stats.lateDays > 1 ? 's' : ''} this month
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <button className="w-full mt-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors">
//                 View Details
//               </button>
//             </div>
//           );
//         })}
//       </div>

//       {filteredEmployees.length === 0 && (
//         <div className="text-center py-12">
//           <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
//           <p className="text-gray-600">No employees match your current search criteria.</p>
//         </div>
//       )}
//     </div>
//   );
// };
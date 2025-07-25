// import React, { useState, useEffect } from 'react';
// import { Clock, Calendar, Users, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
// import { User, AttendanceRecord, AttendanceStats } from '../types';
// import { getUserTodayRecord, getAttendanceRecords, saveAttendanceRecord } from '../utils/storage';
// import { formatTime, formatDate, calculateHours, getWorkingStatus } from '../utils/time';

// interface DashboardProps {
//   user: User;
// }

// export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
//   const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
//   const [isCheckedIn, setIsCheckedIn] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [stats, setStats] = useState<AttendanceStats>({
//     totalDays: 0,
//     presentDays: 0,
//     absentDays: 0,
//     lateDays: 0,
//     averageHours: 0
//   });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     loadTodayRecord();
//     calculateStats();

//     return () => clearInterval(timer);
//   }, [user.id]);

//   const loadTodayRecord = () => {
//     const record = getUserTodayRecord(user.id);
//     setTodayRecord(record);
//     setIsCheckedIn(record !== null && !record.checkOutTime);
//   };

//   const calculateStats = () => {
//     const records = getAttendanceRecords().filter(r => r.userId === user.id);
//     const last30Days = records.slice(-30);
    
//     const presentDays = last30Days.filter(r => r.status === 'present' || r.status === 'late').length;
//     const lateDays = last30Days.filter(r => r.status === 'late').length;
//     const totalHours = last30Days.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    
//     setStats({
//       totalDays: last30Days.length,
//       presentDays,
//       absentDays: last30Days.length - presentDays,
//       lateDays,
//       averageHours: presentDays > 0 ? Math.round((totalHours / presentDays) * 100) / 100 : 0
//     });
//   };

//   const handleCheckIn = () => {
//     const now = new Date().toISOString();
//     const today = new Date().toISOString().split('T')[0];
//     const status = getWorkingStatus(now);
    
//     const newRecord: AttendanceRecord = {
//       id: `${user.id}-${today}`,
//       userId: user.id,
//       userName: user.name,
//       checkInTime: now,
//       date: today,
//       status: status === 'late' ? 'late' : 'present'
//     };
    
//     saveAttendanceRecord(newRecord);
//     setTodayRecord(newRecord);
//     setIsCheckedIn(true);
//     calculateStats();
//   };

//   const handleCheckOut = () => {
//     if (todayRecord) {
//       const now = new Date().toISOString();
//       const totalHours = calculateHours(todayRecord.checkInTime, now);
      
//       const updatedRecord = {
//         ...todayRecord,
//         checkOutTime: now,
//         totalHours
//       };
      
//       saveAttendanceRecord(updatedRecord);
//       setTodayRecord(updatedRecord);
//       setIsCheckedIn(false);
//       calculateStats();
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'present': return 'text-green-600 bg-green-100';
//       case 'late': return 'text-yellow-600 bg-yellow-100';
//       case 'absent': return 'text-red-600 bg-red-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'present': return <CheckCircle className="h-4 w-4" />;
//       case 'late': return <AlertCircle className="h-4 w-4" />;
//       case 'absent': return <XCircle className="h-4 w-4" />;
//       default: return <Clock className="h-4 w-4" />;
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
//         <p className="text-gray-600 mt-2">{formatDate(currentTime.toISOString())}</p>
//       </div>

//       {/* Current Time and Status */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
//               <p className="text-gray-600">Today's attendance</p>
//             </div>
//             <div className="text-right">
//               <div className="text-3xl font-bold text-gray-900">
//                 {currentTime.toLocaleTimeString('en-US', { 
//                   hour: '2-digit', 
//                   minute: '2-digit',
//                   hour12: true 
//                 })}
//               </div>
//               <div className="text-sm text-gray-500">
//                 {currentTime.toLocaleDateString('en-US', { 
//                   weekday: 'short',
//                   month: 'short',
//                   day: 'numeric'
//                 })}
//               </div>
//             </div>
//           </div>

//           {todayRecord ? (
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div>
//                   <div className="font-medium text-gray-900">Check-in Time</div>
//                   <div className="text-sm text-gray-600">{formatTime(todayRecord.checkInTime)}</div>
//                 </div>
//                 <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(todayRecord.status)}`}>
//                   {getStatusIcon(todayRecord.status)}
//                   <span className="ml-1 capitalize">{todayRecord.status}</span>
//                 </div>
//               </div>

//               {todayRecord.checkOutTime && (
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div>
//                     <div className="font-medium text-gray-900">Check-out Time</div>
//                     <div className="text-sm text-gray-600">{formatTime(todayRecord.checkOutTime)}</div>
//                   </div>
//                   <div className="text-right">
//                     <div className="font-medium text-gray-900">{todayRecord.totalHours}h</div>
//                     <div className="text-sm text-gray-600">Total hours</div>
//                   </div>
//                 </div>
//               )}

//               <div className="pt-4">
//                 {isCheckedIn ? (
//                   <button
//                     onClick={handleCheckOut}
//                     className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
//                   >
//                     Check Out
//                   </button>
//                 ) : todayRecord.checkOutTime ? (
//                   <div className="text-center py-3 text-gray-500 font-medium">
//                     You've completed your day
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500 mb-6">You haven't checked in today</p>
//               <button
//                 onClick={handleCheckIn}
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
//               >
//                 Check In
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Quick Stats */}
//         <div className="space-y-4">
//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <Calendar className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <div className="text-2xl font-bold text-gray-900">{stats.presentDays}</div>
//                 <div className="text-sm text-gray-600">Days Present</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <TrendingUp className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <div className="text-2xl font-bold text-gray-900">{stats.averageHours}h</div>
//                 <div className="text-sm text-gray-600">Avg Hours/Day</div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-lg p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-yellow-100 rounded-lg">
//                 <AlertCircle className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div className="ml-4">
//                 <div className="text-2xl font-bold text-gray-900">{stats.lateDays}</div>
//                 <div className="text-sm text-gray-600">Late Arrivals</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Monthly Overview */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Overview</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           <div className="text-center">
//             <div className="text-3xl font-bold text-blue-600">{stats.totalDays}</div>
//             <div className="text-sm text-gray-600">Total Days</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-green-600">{stats.presentDays}</div>
//             <div className="text-sm text-gray-600">Present</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-red-600">{stats.absentDays}</div>
//             <div className="text-sm text-gray-600">Absent</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-yellow-600">{stats.lateDays}</div>
//             <div className="text-sm text-gray-600">Late</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
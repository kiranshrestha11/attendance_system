// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Filter, Download } from 'lucide-react';
// import { User, AttendanceRecord } from '../types';
// import { getAttendanceRecords } from '../utils/storage';
// import { formatTime, formatDate } from '../utils/time';

// interface AttendanceHistoryProps {
//   user: User;
// }

// export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ user }) => {
//   const [records, setRecords] = useState<AttendanceRecord[]>([]);
//   const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
//   const [filterStatus, setFilterStatus] = useState<string>('all');
//   const [filterMonth, setFilterMonth] = useState<string>('all');

//   useEffect(() => {
//     loadRecords();
//   }, [user.id]);

//   useEffect(() => {
//     applyFilters();
//   }, [records, filterStatus, filterMonth]);

//   const loadRecords = () => {
//     const allRecords = getAttendanceRecords()
//       .filter(r => r.userId === user.id)
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     setRecords(allRecords);
//   };

//   const applyFilters = () => {
//     let filtered = [...records];

//     if (filterStatus !== 'all') {
//       filtered = filtered.filter(r => r.status === filterStatus);
//     }

//     if (filterMonth !== 'all') {
//       const [year, month] = filterMonth.split('-');
//       filtered = filtered.filter(r => {
//         const recordDate = new Date(r.date);
//         return recordDate.getFullYear() === parseInt(year) && recordDate.getMonth() === parseInt(month) - 1;
//       });
//     }

//     setFilteredRecords(filtered);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'present': return 'bg-green-100 text-green-800';
//       case 'late': return 'bg-yellow-100 text-yellow-800';
//       case 'absent': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const exportToCSV = () => {
//     const headers = ['Date', 'Check In', 'Check Out', 'Total Hours', 'Status'];
//     const csvData = filteredRecords.map(record => [
//       record.date,
//       formatTime(record.checkInTime),
//       record.checkOutTime ? formatTime(record.checkOutTime) : 'N/A',
//       record.totalHours ? `${record.totalHours}h` : 'N/A',
//       record.status
//     ]);

//     const csvContent = [headers, ...csvData]
//       .map(row => row.join(','))
//       .join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `attendance-${user.name.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const getUniqueMonths = () => {
//     const months = records.map(r => {
//       const date = new Date(r.date);
//       return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//     });
//     return [...new Set(months)].sort().reverse();
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
//         <p className="text-gray-600 mt-2">View and manage your attendance records</p>
//       </div>

//       {/* Filters and Actions */}
//       <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">Filters:</span>
//             </div>
            
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Status</option>
//               <option value="present">Present</option>
//               <option value="late">Late</option>
//               <option value="absent">Absent</option>
//             </select>

//             <select
//               value={filterMonth}
//               onChange={(e) => setFilterMonth(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="all">All Months</option>
//               {getUniqueMonths().map(month => {
//                 const [year, monthNum] = month.split('-');
//                 const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//                 return (
//                   <option key={month} value={month}>{monthName}</option>
//                 );
//               })}
//             </select>
//           </div>

//           <button
//             onClick={exportToCSV}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
//           >
//             <Download className="h-4 w-4" />
//             Export CSV
//           </button>
//         </div>
//       </div>

//       {/* Records Table */}
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Check In
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Check Out
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total Hours
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredRecords.length > 0 ? (
//                 filteredRecords.map((record) => (
//                   <tr key={record.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 text-gray-400 mr-2" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {new Date(record.date).toLocaleDateString('en-US', { 
//                               month: 'short', 
//                               day: 'numeric',
//                               year: 'numeric'
//                             })}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <Clock className="h-4 w-4 text-gray-400 mr-2" />
//                         <span className="text-sm text-gray-900">{formatTime(record.checkInTime)}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {record.checkOutTime ? (
//                         <div className="flex items-center">
//                           <Clock className="h-4 w-4 text-gray-400 mr-2" />
//                           <span className="text-sm text-gray-900">{formatTime(record.checkOutTime)}</span>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-gray-500">Not checked out</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {record.totalHours ? (
//                         <span className="text-sm font-medium text-gray-900">{record.totalHours}h</span>
//                       ) : (
//                         <span className="text-sm text-gray-500">--</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(record.status)}`}>
//                         {record.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-12 text-center">
//                     <div className="text-gray-500">
//                       <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                       <p className="text-lg font-medium">No records found</p>
//                       <p className="text-sm">No attendance records match your current filters.</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Summary Stats */}
//       {filteredRecords.length > 0 && (
//         <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-blue-600">{filteredRecords.length}</div>
//               <div className="text-sm text-gray-600">Total Records</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-green-600">
//                 {filteredRecords.filter(r => r.status === 'present').length}
//               </div>
//               <div className="text-sm text-gray-600">Present Days</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-yellow-600">
//                 {filteredRecords.filter(r => r.status === 'late').length}
//               </div>
//               <div className="text-sm text-gray-600">Late Days</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-gray-600">
//                 {Math.round(filteredRecords.reduce((sum, r) => sum + (r.totalHours || 0), 0) * 100) / 100}h
//               </div>
//               <div className="text-sm text-gray-600">Total Hours</div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
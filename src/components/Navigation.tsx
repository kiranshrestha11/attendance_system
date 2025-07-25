// import React from 'react';
// import { Home, History, Users, LogOut, User } from 'lucide-react';
// import { User as UserType } from '../types';

// interface NavigationProps {
//   user: UserType;
//   currentView: string;
//   onViewChange: (view: string) => void;
//   onLogout: () => void;
// }

// export const Navigation: React.FC<NavigationProps> = ({ user, currentView, onViewChange, onLogout }) => {
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: Home },
//     { id: 'history', label: 'History', icon: History },
//     ...(user.role === 'admin' ? [{ id: 'employees', label: 'Employees', icon: Users }] : [])
//   ];

//   return (
//     <div className="bg-white shadow-sm border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center space-x-8">
//             <div className="flex items-center">
//               <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <User className="h-5 w-5 text-white" />
//               </div>
//               <span className="ml-2 text-xl font-bold text-gray-900">SmartAttend</span>
//             </div>

//             <nav className="flex space-x-1">
//               {menuItems.map(item => {
//                 const Icon = item.icon;
//                 const isActive = currentView === item.id;
//                 return (
//                   <button
//                     key={item.id}
//                     onClick={() => onViewChange(item.id)}
//                     className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
//                       isActive
//                         ? 'bg-blue-100 text-blue-700'
//                         : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                     }`}
//                   >
//                     <Icon className="h-4 w-4 mr-2" />
//                     {item.label}
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="text-right">
//               <div className="text-sm font-medium text-gray-900">{user.name}</div>
//               <div className="text-xs text-gray-500">{user.department} • {user.role}</div>
//             </div>
//             <button
//               onClick={onLogout}
//               className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
//             >
//               <LogOut className="h-4 w-4 mr-1" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
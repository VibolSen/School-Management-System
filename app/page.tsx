// 'use client'

// import React from 'react';
// import AdministratorDashboard from '@/views/AdministratorDashboard';
// import HRDashboard from '@/views/HRDashboard';
// import FacultyDashboard from '@/views/FacultyDashboard';
// import StudentDashboard from '@/views/StudentDashboard';
// import PlaceholderView from '@/views/PlaceholderView';
// import { useUser } from '@/context/UserContext';
// import { Role } from '@/lib/types';

// export default function DashboardPage() {
//   const { currentUserRole } = useUser();

//   const renderDashboard = () => {
//     switch (currentUserRole) {
//       case Role.ADMINISTRATOR:
//         return <AdministratorDashboard />;
//       case Role.HR:
//         return <HRDashboard />;
//       case Role.FACULTY:
//         return <FacultyDashboard />;
//       case Role.STUDENT:
//         return <StudentDashboard />;
//       default:
//         return <PlaceholderView title="Dashboard Not Available" />;
//     }
//   };

//   return renderDashboard();
// }




export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the University Management System</h1>
      <p className="mt-4 text-lg">Please select a dashboard from the navigation menu.</p>
    </main>
  );
}
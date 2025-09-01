// 'use client';

// import React, { useState } from 'react';
// import { UserContext } from './UserContext';
// import { Role } from '@/lib/types';

// export default function AppProviders({ children }: { children: React.ReactNode }) {
//   const [currentUserRole, setCurrentUserRole] = useState<Role>(Role.ADMINISTRATOR);
  
//   return (
//     <UserContext.Provider value={{ currentUserRole, setCurrentUserRole }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

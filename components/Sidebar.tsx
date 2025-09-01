'use client';

import React, { useMemo } from 'react';
import type { ViewType } from '@/lib/types';
import { Role } from '@/lib/types';
import { ROLE_NAV_ITEMS } from '@/lib/constants';
import HomeIcon from './icons/HomeIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import UsersIcon from './icons/UsersIcon';
import LibraryIcon from './icons/LibraryIcon';
import CalendarIcon from './icons/CalendarIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import CogIcon from './icons/CogIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import PlaneIcon from './icons/PlaneIcon';
import QrcodeIcon from './icons/QrcodeIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import PresentationChartLineIcon from './icons/PresentationChartLineIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';

// FIX: Update props to support state-based navigation from App.tsx
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentUserRole: Role;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

// FIX: Refactor NavLink to be a button with an onClick handler for state-based navigation
const NavLink: React.FC<{
  icon: React.ReactNode;
  label: ViewType;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isCollapsed, isActive, onClick }) => {
    return (
        <li>
            <button
                onClick={onClick}
                className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 w-full text-left ${
                    isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-200 hover:bg-blue-800 hover:text-white'
                }`}
            >
            {icon}
            <span
                className={`ml-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 md:opacity-100' : ''}`}
            >
                {label}
            </span>
            </button>
        </li>
    );
};

const ALL_NAV_ITEMS: { label: ViewType; icon: React.ReactNode }[] = [
    { label: 'Dashboard', icon: <HomeIcon /> },
    { label: 'Staff', icon: <BriefcaseIcon /> },
    { label: 'Students', icon: <UsersIcon /> },
    { label: 'Courses', icon: <LibraryIcon /> },
    { label: 'Assignments', icon: <ClipboardListIcon /> },
    { label: 'Course Analytics', icon: <PresentationChartLineIcon /> },
    { label: 'Student Performance', icon: <TrendingUpIcon /> },
    { label: 'E-Library', icon: <BookOpenIcon /> },
    { label: 'Attendance', icon: <CalendarIcon /> },
    { label: 'Leave', icon: <PlaneIcon /> },
    { label: 'Scan QR', icon: <QrcodeIcon /> },
    { label: 'Reports', icon: <ChartBarIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentUserRole, currentView, setCurrentView }) => {
  const navItems = useMemo(() => {
    const allowedViews = ROLE_NAV_ITEMS[currentUserRole] || [];
    return ALL_NAV_ITEMS.filter(item => allowedViews.includes(item.label));
  }, [currentUserRole]);

  const isCollapsed = !isOpen;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      <aside
        className={`bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out z-40 h-full ${
          isOpen ? 'w-64' : 'w-0 md:w-20'
        } overflow-hidden`}
      >
        <div className={`flex items-center p-4 border-b border-blue-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className={`flex items-center ${isCollapsed ? 'md:justify-center' : ''}`}>
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.22-8.242l10.44 4.99m-10.44-4.99l10.44 4.99M3 10.519l9-4.266 9 4.266" />
            </svg>
            <h1 className={`text-xl font-bold ml-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 md:opacity-100' : ''}`}>
              SMS Portal
            </h1>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4">
          <ul>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                isActive={currentView === item.label}
                onClick={() => setCurrentView(item.label)}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </nav>
        <div className="px-3 py-4 border-t border-blue-800">
           <ul>
             <NavLink
                icon={<CogIcon />}
                label="Settings"
                isActive={currentView === 'Settings'}
                onClick={() => setCurrentView('Settings')}
                isCollapsed={isCollapsed}
              />
           </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

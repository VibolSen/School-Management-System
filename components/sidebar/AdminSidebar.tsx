"use client";
import React from "react";
import Link from "next/link";
import {
  FiHome,
  FiUsers,
  FiBook,
  FiCalendar,
  FiBarChart2,
  FiBookOpen,
  FiSend,
  FiSettings,
} from "react-icons/fi";

import { usePathname } from "next/navigation";

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive: boolean;
}

interface AdminSidebarProps {
  isOpen: boolean;
}

// NavLink component
const NavLink = ({
  icon,
  label,
  href,
  isCollapsed,
  isActive,
}: NavLinkProps) => (
  <li>
    <Link
      href={href}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 w-full text-left ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-200 hover:bg-blue-800 hover:text-white"
      }`}
    >
      {icon}
      <span
        className={`ml-3 transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 md:opacity-100" : ""
        }`}
      >
        {label}
      </span>
    </Link>
  </li>
);

// Admin navigation items
const ADMIN_NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    href: "/admin/dashboard",
  },
  {
    label: "Staff",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/admin/staff",
  },
  {
    label: "Students",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/admin/students",
  },
  {
    label: "Courses",
    icon: <FiBook className="w-5 h-5" />,
    href: "/admin/courses",
  },
  {
    label: "E-Library",
    icon: <FiBookOpen className="w-5 h-5" />,
    href: "/admin/e-library",
  },
  {
    label: "Attendance",
    icon: <FiCalendar className="w-5 h-5" />,
    href: "/admin/attendance",
  },
  {
    label: "Leave",
    icon: <FiSend className="w-5 h-5" />,
    href: "/admin/leave",
  },
  {
    label: "Reports",
    icon: <FiBarChart2 className="w-5 h-5" />,
    href: "/admin/reports",
  },
  {
    label: "Settings",
    icon: <FiSettings className="w-5 h-5" />,
    href: "/admin/settings",
  },
];

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
  const isCollapsed = !isOpen;
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out z-40 h-full ${
          isOpen ? "w-64" : "w-20"
        } overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`flex items-center p-4 border-b border-blue-800 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v11.494m-5.22-8.242l10.44 4.99m-10.44-4.99l10.44 4.99M3 10.519l9-4.266 9 4.266"
              />
            </svg>
            {!isCollapsed && (
              <h1 className="ml-2 text-xl font-bold">Admin Portal</h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4">
          <ul>
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={isCollapsed}
                isActive={pathname === item.href}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

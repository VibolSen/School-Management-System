"use client";
import React, { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiCalendar,
  FiBarChart2,
  FiSend,
  FiSettings,
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
} from "react-icons/fi";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { MOCK_STAFF_DATA } from "@/lib/constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Define the props for NavLink component
interface NavLinkProps {
  icon: ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  href: string;
}

// NavLink component
const NavLink: React.FC<NavLinkProps> = ({
  icon,
  label,
  isCollapsed,
  isActive,
  href,
}) => (
  <li>
    <Link
      href={href}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 w-full text-left group relative ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-slate-200 hover:bg-blue-800 hover:text-white"
      }`}
      title={isCollapsed ? label : ""}
    >
      {icon}
      <span
        className={`ml-3 transition-all duration-300 ${
          isCollapsed
            ? "opacity-0 absolute left-full ml-2 bg-blue-900 text-white px-2 py-1 rounded text-sm invisible group-hover:visible group-hover:opacity-100 z-50"
            : "opacity-100 relative"
        }`}
      >
        {label}
      </span>
    </Link>
  </li>
);

// Define the structure for navigation items
interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
}

// HR navigation items
const HR_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    href: "/hr/dashboard",
  },
  {
    label: "Staff",
    icon: <FiBriefcase className="w-5 h-5" />,
    href: "/hr/staff",
  },
  { label: "Leave", icon: <FiSend className="w-5 h-5" />, href: "/hr/leave" },
  {
    label: "Attendance",
    icon: <FiCalendar className="w-5 h-5" />,
    href: "/hr/attendance",
  },
  {
    label: "Reports",
    icon: <FiBarChart2 className="w-5 h-5" />,
    href: "/hr/reports",
  },
];

// Define the props for HRSidebar component
interface HRSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const HRSidebar: React.FC<HRSidebarProps> = ({ isOpen, setIsOpen }) => {
  const isCollapsed = !isOpen;
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`bg-blue-900 text-white flex flex-col fixed md:relative transition-all duration-300 ease-in-out z-40 h-full ${
          isOpen ? "w-64" : "w-16"
        } overflow-hidden`}
      >
        {/* Header / Logo */}
        <div
          className={`flex items-center p-4 border-b border-blue-800 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
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
              <h1 className="ml-2 text-xl font-bold">HR Portal</h1>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1 rounded-full bg-blue-800 hover:bg-blue-700 transition-colors ${
              isCollapsed ? "absolute bottom-4 left-3" : ""
            }`}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <FiChevronLeft className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul>
            {HR_NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </ul>
        </nav>

        {/* Footer / Settings */}
        <div className="px-2 py-4 border-t border-blue-800">
          <NavLink
            icon={<FiSettings className="w-5 h-5" />}
            label="Settings"
            href="/settings"
            isActive={pathname === "/settings"}
            isCollapsed={isCollapsed}
          />
        </div>
      </aside>
    </>
  );
};

interface StaffData {
  status: string;
  department: string;
  hireDate: string;
}

interface ChartData {
  name: string;
  count?: number;
  value?: number;
}

const HRDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("hr-sidebarState");
    if (savedState !== null) {
      setSidebarOpen(JSON.parse(savedState));
    }
  }, []);

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hr-sidebarState", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Dashboard data calculations
  const totalStaff = MOCK_STAFF_DATA.length;
  const onLeave = MOCK_STAFF_DATA.filter(
    (s: StaffData) => s.status === "On Leave"
  ).length;
  const newHires = MOCK_STAFF_DATA.filter(
    (s: StaffData) =>
      new Date(s.hireDate) >
      new Date(new Date().setMonth(new Date().getMonth() - 3))
  ).length;
  const activeStaff = MOCK_STAFF_DATA.filter(
    (s: StaffData) => s.status === "Active"
  ).length;

  const staffByDept = [
    { name: "Engineering", count: 12 },
    { name: "Design", count: 8 },
    { name: "Marketing", count: 10 },
    { name: "HR", count: 6 },
    { name: "Operations", count: 9 },
  ];

  const staffByStatus = [
    { name: "Active", value: activeStaff },
    { name: "On Leave", value: onLeave },
    { name: "Inactive", value: totalStaff - activeStaff - onLeave },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <HRSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-16"
        }`}
      >
        <div className="p-6 space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Welcome back, Patricia!
              </h1>
              <p className="text-slate-500">
                Here's an overview of your staff management metrics.
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-blue-600 text-white p-2 rounded-lg"
            >
              {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Staff"
              value={totalStaff.toString()}
              icon={<FiBriefcase className="w-5 h-5" />}
              change=""
              changeType="neutral"
            />
            <DashboardCard
              title="Active Staff"
              value={activeStaff.toString()}
              icon={<FiUsers className="w-5 h-5" />}
              change=""
              changeType="neutral"
            />
            <DashboardCard
              title="Staff on Leave"
              value={onLeave.toString()}
              icon={<FiBriefcase className="w-5 h-5" />}
              change=""
              changeType="neutral"
            />
            <DashboardCard
              title="New Hires (3 Mo)"
              value={newHires.toString()}
              icon={<FiUsers className="w-5 h-5" />}
              change="+5%"
              changeType="increase"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Staff by Department
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={staffByDept}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-20}
                    textAnchor="end"
                    height={50}
                    interval={0}
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" name="Staff Members" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-slate-800">
                Staff by Status
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={staffByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {staffByStatus.map((entry: ChartData, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRSidebar;

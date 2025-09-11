"use client";

import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BriefcaseIcon from "@/components/icons/BriefcaseIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AdministratorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  async function fetchDashboardData() {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error(`Dashboard API error: ${res.status}`);
      const data = await res.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  // Fetch logged-in user
  async function fetchCurrentUser() {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch current user");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    Promise.all([fetchDashboardData(), fetchCurrentUser()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white border border-gray-200 shadow-lg rounded-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          <p className="text-blue-600">
            Present: <span className="font-bold">{payload[0].value}</span>
          </p>
          <p className="text-red-500">
            Absent: <span className="font-bold">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Loading animation
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load dashboard data</h2>
          <p className="text-slate-600 mb-4">Please check your connection and try again</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { users, attendance } = dashboardData;

  // ===== Stats Calculations =====
  const totalEnrolledStudents = users.filter(
    (u) => u.role?.name === "Students"
  ).length;

  const staffRoles = ["teacher", "admin", "hr", "faculty"];
  const totalStaff = users.filter((u) =>
    staffRoles.includes(u.role?.name?.toLowerCase())
  ).length;

  const staffOnLeave = users.filter(
    (u) =>
      staffRoles.includes(u.role?.name?.toLowerCase()) &&
      u.status === "On Leave"
  ).length;

  const attendanceData =
    attendance && attendance.length > 0
      ? attendance
      : [
          { name: "Mon", Present: 20, Absent: 5 },
          { name: "Tue", Present: 22, Absent: 3 },
          { name: "Wed", Present: 18, Absent: 2 },
          { name: "Thu", Present: 25, Absent: 0 },
          { name: "Fri", Present: 19, Absent: 4 },
          { name: "Sat", Present: 15, Absent: 1 },
        ];

  const attendanceRate =
    attendanceData.length > 0
      ? Math.round(
          (attendanceData.reduce((sum, d) => sum + d.Present, 0) /
            attendanceData.reduce((sum, d) => sum + d.Present + d.Absent, 0)) *
            100
        )
      : "N/A";

  const realUser = currentUser?.name || "User";

  // Generate random colors for bars
  const presentColors = ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"];
  const absentColors = ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ===== Header ===== */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {realUser}!
          </h1>
          <p className="text-blue-100">
            Here's a snapshot of your school's activities today.
          </p>
          <div className="flex items-center mt-4">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm">Last updated: Just now</span>
          </div>
        </div>

        {/* ===== Dashboard Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Enrolled Students"
            value={totalEnrolledStudents}
            icon={<UsersIcon className="text-blue-600" />}
            change="+5 this week"
            changeType="increase"
            gradient="from-blue-500 to-blue-700"
            delay="0"
          />
          <DashboardCard
            title="Total Staff"
            value={totalStaff}
            icon={<BriefcaseIcon className="text-purple-600" />}
            change="+1 this month"
            changeType="increase"
            gradient="from-purple-500 to-purple-700"
            delay="100"
          />
          <DashboardCard
            title="Staff on Leave"
            value={staffOnLeave}
            icon={<CalendarIcon className="text-amber-600" />}
            gradient="from-amber-500 to-amber-700"
            delay="200"
          />
          <DashboardCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon={<ChartBarIcon className="text-green-600" />}
            change="-2% from yesterday"
            changeType="decrease"
            gradient="from-green-500 to-green-700"
            delay="300"
          />
        </div>

        {/* ===== Attendance Chart + New Staff ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md transition-all hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                Weekly Attendance Summary
              </h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                  Week
                </button>
                <button className="px-3 py-1 text-sm text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                  Month
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b' }} 
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fill: '#64748b' }} 
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                  iconSize={10}
                />
                <Bar 
                  dataKey="Present" 
                  name="Present Students" 
                  radius={[4, 4, 0, 0]}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`present-${index}`} fill={presentColors[index % presentColors.length]} />
                  ))}
                </Bar>
                <Bar 
                  dataKey="Absent" 
                  name="Absent Students" 
                  radius={[4, 4, 0, 0]}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`absent-${index}`} fill={absentColors[index % absentColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* New Staff List */}
          <div className="bg-white p-6 rounded-2xl shadow-md transition-all hover:shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                New Staff Members
              </h2>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
                View all
              </button>
            </div>
            <ul className="space-y-4">
              {users
                .filter((u) => staffRoles.includes(u.role?.name?.toLowerCase()))
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .slice(0, 5)
                .map((staff, index) => (
                  <li 
                    key={staff.id} 
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <img
                        className="h-12 w-12 rounded-full object-cover border-2 border-white shadow"
                        src={
                          staff.image ||
                          `https://picsum.photos/seed/${staff.id}/100`
                        }
                        alt={staff.name}
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {staff.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{staff.position}</p>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-800">Add Student</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-800">Add Staff</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-amber-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-800">Schedule</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-800">Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
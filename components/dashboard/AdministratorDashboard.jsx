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
      const token = sessionStorage.getItem("token");
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

  // Loading screen
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Failed to load dashboard data
          </h2>
          <p className="text-slate-600 mb-4">
            Please check your connection and try again
          </p>
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

  // Stats
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

  const attendanceData = attendance || [];

  const attendanceRate =
    attendanceData.length > 0
      ? Math.round(
          (attendanceData.reduce((sum, d) => sum + d.Present, 0) /
            attendanceData.reduce(
              (sum, d) => sum + d.Present + d.Absent,
              0 || 1
            )) *
            100
        )
      : 0;

  const realUser = currentUser?.name || "User";

  // Colors
  const presentColors = ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"];
  const absentColors = ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {realUser}!
          </h1>
          <p className="text-blue-100">
            Here's a snapshot of your school's activities today.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Total Enrolled Students"
            value={totalEnrolledStudents}
            icon={<UsersIcon className="text-blue-600" />}
            gradient="from-blue-500 to-blue-700"
          />
          <DashboardCard
            title="Total Staff"
            value={totalStaff}
            icon={<BriefcaseIcon className="text-purple-600" />}
            gradient="from-purple-500 to-purple-700"
          />
          <DashboardCard
            title="Staff on Leave"
            value={staffOnLeave}
            icon={<CalendarIcon className="text-amber-600" />}
            gradient="from-amber-500 to-amber-700"
          />
          <DashboardCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon={<ChartBarIcon className="text-green-600" />}
            gradient="from-green-500 to-green-700"
          />
        </div>

        {/* Attendance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Weekly Attendance Summary
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b" }}
                axisLine={false}
              />
              <YAxis tick={{ fill: "#64748b" }} axisLine={false} />
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
                  <Cell
                    key={`present-${index}`}
                    fill={presentColors[index % presentColors.length]}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="Absent"
                name="Absent Students"
                radius={[4, 4, 0, 0]}
              >
                {attendanceData.map((entry, index) => (
                  <Cell
                    key={`absent-${index}`}
                    fill={absentColors[index % absentColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

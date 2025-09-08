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
      const token = localStorage.getItem("token"); // assume you store JWT in localStorage
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

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (!dashboardData)
    return <p className="text-red-500">Failed to load dashboard data.</p>;

  const { users, stats, attendance } = dashboardData;

  // ===== Stats Calculations =====
  const totalEnrolledStudents = users.filter(
    (u) => u.roleId === "students"
  ).length;
  const staffRoles = ["teacher", "admin", "hr", "faculty"];
  const totalStaff = users.filter((u) => staffRoles.includes(u.roleId)).length;
  const staffOnLeave = 0; // no status info currently

  const attendanceData =
    attendance && attendance.length > 0
      ? attendance
      : [
          { name: "Mon", Present: 20, Absent: 5 },
          { name: "Tue", Present: 22, Absent: 3 },
          { name: "Wed", Present: 18, Absent: 2 },
          { name: "Thu", Present: 25, Absent: 0 },
          { name: "Fri", Present: 19, Absent: 4 },
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ===== Header ===== */}
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, {realUser}!
      </h1>
      <p className="text-slate-500">
        Here's a snapshot of your school's activities today.
      </p>

      {/* ===== Dashboard Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Enrolled Students"
          value={totalEnrolledStudents}
          icon={<UsersIcon />}
          change="+5 this week"
          changeType="increase"
        />
        <DashboardCard
          title="Total Staff"
          value={totalStaff}
          icon={<BriefcaseIcon />}
          change="+1 this month"
          changeType="increase"
        />
        <DashboardCard
          title="Staff on Leave"
          value={staffOnLeave}
          icon={<CalendarIcon />}
        />
        <DashboardCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={<ChartBarIcon />}
          change="-2% from yesterday"
          changeType="decrease"
        />
      </div>

      {/* ===== Attendance Chart + New Staff ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Weekly Attendance Summary
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="#3b82f6" />
              <Bar dataKey="Absent" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* New Staff List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            New Staff Members
          </h2>
          <ul className="space-y-4">
            {users
              .filter((u) => staffRoles.includes(u.roleId))
              .sort(
                (a, b) =>
                  new Date(b.hireDate || 0).getTime() -
                  new Date(a.hireDate || 0).getTime()
              )
              .slice(0, 5)
              .map((staff) => (
                <li key={staff.id} className="flex items-center space-x-3">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      staff.image ||
                      `https://picsum.photos/seed/${staff.id}/100`
                    }
                    alt={staff.name}
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {staff.name}
                    </p>
                    <p className="text-xs text-slate-500">{staff.position}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

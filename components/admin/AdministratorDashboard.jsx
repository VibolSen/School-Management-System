"use client";

import React from "react";
import DashboardCard from "@/components/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BriefcaseIcon from "@/components/icons/BriefcaseIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";
import { MOCK_STAFF_DATA, MOCK_STUDENT_DATA } from "@/lib/constants";
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

const attendanceData = [
  { name: "Mon", Present: 480, Absent: 20 },
  { name: "Tue", Present: 490, Absent: 10 },
  { name: "Wed", Present: 495, Absent: 5 },
  { name: "Thu", Present: 485, Absent: 15 },
  { name: "Fri", Present: 470, Absent: 30 },
];

export default function AdministratorDashboard() {
  const staffOnLeave = MOCK_STAFF_DATA.filter(
    (s) => s.status === "On Leave"
  ).length;
  const totalEnrolled = MOCK_STUDENT_DATA.filter(
    (s) => s.status === "Enrolled"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, Johnathan!
      </h1>
      <p className="text-slate-500">
        Here's a snapshot of your school's activities today.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Enrolled Students"
          value={totalEnrolled.toString()}
          icon={<UsersIcon />}
          change="+5 this week"
          changeType="increase"
        />
        <DashboardCard
          title="Total Staff"
          value={MOCK_STAFF_DATA.length.toString()}
          icon={<BriefcaseIcon />}
          change="+1 this month"
          changeType="increase"
        />
        <DashboardCard
          title="Staff on Leave"
          value={staffOnLeave.toString()}
          icon={<CalendarIcon />}
        />
        <DashboardCard
          title="Attendance Rate"
          value="95%"
          icon={<ChartBarIcon />}
          change="-2% from yesterday"
          changeType="decrease"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            New Staff Members
          </h2>
          <ul className="space-y-4">
            {MOCK_STAFF_DATA.slice()
              .sort(
                (a, b) =>
                  new Date(b.hireDate).getTime() -
                  new Date(a.hireDate).getTime()
              )
              .slice(0, 5)
              .map((staff) => (
                <li key={staff.id} className="flex items-center space-x-3">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`https://picsum.photos/seed/${staff.id}/100`}
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

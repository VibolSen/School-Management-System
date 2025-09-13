"use client";

import React, { useState, useEffect, useMemo } from "react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BriefcaseIcon from "@/components/icons/BriefcaseIcon";
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

const HRDashboard = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await fetch("/api/staff");
        if (!response.ok) {
          throw new Error("Failed to fetch staff data");
        }
        const data = await response.json();
        setStaffData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const totalStaff = staffData.length;
  const onLeave = staffData.filter(
    (s) => s.status === "On Leave"
  ).length;
  const newHires = staffData.filter(
    (s) =>
      new Date(s.hireDate) >
      new Date(new Date().setMonth(new Date().getMonth() - 3))
  ).length;
  const activeStaff = staffData.filter(
    (s) => s.status === "Active"
  ).length;

  const staffByDept = useMemo(() => {
    const departments = [
      "Engineering",
      "Design",
      "Marketing",
      "HR",
      "Operations",
    ];
    const data = departments.map((dept) => ({
      name: dept,
      count: staffData.filter(
        (staff) => staff.department === dept
      ).length,
    }));
    return data.filter((d) => d.count > 0);
  }, [staffData]);

  const staffByStatus = useMemo(() => {
    const statuses = ["Active", "On Leave", "Inactive"];
    return statuses.map((status) => ({
      name: status,
      value: staffData.filter((s) => s.status === status)
        .length,
    }));
  }, [staffData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, Patricia!
      </h1>
      <p className="text-slate-500">
        Here's an overview of your staff management metrics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Staff"
          value={totalStaff.toString()}
          icon={<BriefcaseIcon />}
          change="" // Add empty string if prop is required
          changeType="neutral" // Add neutral change type
        />
        <DashboardCard
          title="Active Staff"
          value={activeStaff.toString()}
          icon={<UsersIcon />}
          change=""
          changeType="neutral"
        />
        <DashboardCard
          title="Staff on Leave"
          value={onLeave.toString()}
          icon={<BriefcaseIcon />}
          change=""
          changeType="neutral"
        />
        <DashboardCard
          title="New Hires (3 Mo)"
          value={newHires.toString()}
          icon={<UsersIcon />}
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
              margin={{ top: 20, right: 30, left: -10, bottom: 5 }}
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
                {staffByStatus.map((entry, index) => (
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
  );
};

export default HRDashboard;
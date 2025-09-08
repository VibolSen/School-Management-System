"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/components/dashboard/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";
import ClockIcon from "@/components/icons/ClockIcon";

const FacultyDashboard = ({ loggedInUser }) => {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Wait until loggedInUser is loaded
  if (!loggedInUser) return <p>Loading...</p>;

  const FACULTY_ID = loggedInUser.id; // ✅ safe now

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  };

  // Fetch real users (students)
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users?role=STUDENT"); // optional: filter by role
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      // console.log("users:", data); // log fetched students
      setUsers(data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  // Fetch attendance if available via API
  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/attendance"); // optional endpoint
      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      setAttendance(data);
    } catch (err) {
      console.warn("Attendance API not available, using empty array");
      setAttendance([]);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchUsers();
    fetchAttendance();
  }, []);

  const myCourses = useMemo(
    () => courses.filter((c) => c.teacherId === FACULTY_ID),
    [courses, FACULTY_ID]
  );

  const myCourseIds = useMemo(() => myCourses.map((c) => c.id), [myCourses]);

  // Today's attendance
  const todaysAttendanceRate = useMemo(() => {
    const todayString = new Date().toISOString().split("T")[0];
    const todaysRecords = attendance.filter(
      (rec) => rec.date === todayString && myCourseIds.includes(rec.courseId)
    );
    if (todaysRecords.length === 0) return "N/A";

    const presentCount = todaysRecords.filter(
      (r) => r.status === "PRESENT" || r.status === "LATE"
    ).length;
    return `${Math.round((presentCount / todaysRecords.length) * 100)}%`;
  }, [attendance, myCourseIds]);

  // Today's schedule (example: first 4 courses)
  const todaysSchedule = useMemo(() => {
    return myCourses
      .map((course, index) => ({
        ...course,
        time: index === 0 ? "09:00 AM - 10:30 AM" : "11:00 AM - 12:30 PM",
      }))
      .slice(0, 4);
  }, [myCourses]);

  // Course-wise attendance data
  const courseAttendanceData = useMemo(() => {
    const todayString = new Date().toISOString().split("T")[0];

    return myCourses.map((course) => {
      const courseRecords = attendance.filter(
        (r) => r.date === todayString && r.courseId === course.id
      );
      if (courseRecords.length === 0)
        return { name: course.name, "Attendance Rate": 0 };

      const presentCount = courseRecords.filter(
        (r) => r.status === "PRESENT" || r.status === "LATE"
      ).length;
      const rate = Math.round((presentCount / courseRecords.length) * 100);
      return { name: course.name, "Attendance Rate": rate };
    });
  }, [attendance, myCourses]);

  const myStudentsCount = useMemo(() => {
    const studentIds = new Set();
    users.forEach((student) => {
      if (
        Array.isArray(student.courses) &&
        student.courses.some((course) => myCourseIds.includes(course.id))
      ) {
        studentIds.add(student.id);
      }
    });
    return studentIds.size;
  }, [users, myCourseIds]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, Dr. Reed!
      </h1>
      <p className="text-slate-500">Here's your teaching summary for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="My Courses"
          value={courses.length.toString()}
          icon={<BookOpenIcon />}
        />
        <DashboardCard
          title="Total Students"
          value={users.length.toString()}
          icon={<UsersIcon />}
        />
        <DashboardCard
          title="Today's Attendance"
          value={todaysAttendanceRate}
          icon={<ChartBarIcon />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">
            Today's Attendance by Course
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={courseAttendanceData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis unit="%" />
              <Tooltip />
              <Bar
                dataKey="Attendance Rate"
                fill="#3b82f6"
                name="Attendance Rate"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Today's Schedule
            </h2>
            {todaysSchedule.length > 0 ? (
              <ul className="space-y-3">
                {todaysSchedule.map((course) => (
                  <li key={course.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 bg-slate-100 p-2 rounded-full text-slate-500">
                      <ClockIcon />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">
                        {course.name}
                      </p>
                      <p className="text-sm text-slate-500">{course.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                No classes scheduled for today.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

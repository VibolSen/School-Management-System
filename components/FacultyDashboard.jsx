"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/components/DashboardCard";
import UsersIcon from "@/components/icons/UsersIcon";
import BookOpenIcon from "@/components/icons/BookOpenIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import {
  MOCK_COURSES,
  MOCK_STUDENT_DATA,
  MOCK_ATTENDANCE_DATA,
} from "@/lib/constants";

const FACULTY_ID = "S001"; // Dr. Evelyn Reed

const FacultyDashboard = () => {
  const myCourses = useMemo(
    () => MOCK_COURSES.filter((c) => c.teacherId === FACULTY_ID),
    []
  );

  const myCourseIds = useMemo(() => myCourses.map((c) => c.id), [myCourses]);

  const myStudentsCount = useMemo(() => {
    const studentIds = new Set();
    MOCK_STUDENT_DATA.forEach((student) => {
      if (student.courses.some((course) => myCourseIds.includes(course.id))) {
        studentIds.add(student.id);
      }
    });
    return studentIds.size;
  }, [myCourseIds]);

  const todaysAttendanceRate = useMemo(() => {
    const todayString = new Date().toISOString().split("T")[0];
    const todaysRecords = MOCK_ATTENDANCE_DATA.filter(
      (rec) => rec.date === todayString && myCourseIds.includes(rec.courseId)
    );
    if (todaysRecords.length === 0) return "N/A";

    const presentCount = todaysRecords.filter(
      (r) => r.status === "PRESENT" || r.status === "LATE"
    ).length;
    return `${Math.round((presentCount / todaysRecords.length) * 100)}%`;
  }, [myCourseIds]);

  const todaysSchedule = useMemo(() => {
    return myCourses
      .map((course, index) => ({
        ...course,
        time: index === 0 ? "09:00 AM - 10:30 AM" : "11:00 AM - 12:30 PM",
      }))
      .slice(0, 4);
  }, [myCourses]);

  const attendanceAlerts = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    const alerts = MOCK_ATTENDANCE_DATA.filter(
      (rec) =>
        rec.date === yesterdayString &&
        myCourseIds.includes(rec.courseId) &&
        (rec.status === "ABSENT" || rec.status === "LATE")
    );

    return alerts
      .map((alert) => {
        const student = MOCK_STUDENT_DATA.find((s) => s.id === alert.studentId);
        const course = MOCK_COURSES.find((c) => c.id === alert.courseId);
        return {
          ...alert,
          studentName: student?.name || "Unknown",
          courseName: course?.name || "Unknown",
        };
      })
      .slice(0, 5);
  }, [myCourseIds]);

  const courseAttendanceData = useMemo(() => {
    const todayString = new Date().toISOString().split("T")[0];

    return myCourses.map((course) => {
      const courseRecords = MOCK_ATTENDANCE_DATA.filter(
        (r) => r.date === todayString && r.courseId === course.id
      );
      if (courseRecords.length === 0) {
        return { name: course.name, "Attendance Rate": 0 };
      }
      const presentCount = courseRecords.filter(
        (r) => r.status === "PRESENT" || r.status === "LATE"
      ).length;
      const rate = Math.round((presentCount / courseRecords.length) * 100);
      return { name: course.name, "Attendance Rate": rate };
    });
  }, [myCourses]);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">
        Welcome back, Dr. Reed!
      </h1>
      <p className="text-slate-500">Here's your teaching summary for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="My Courses"
          value={myCourses.length.toString()}
          icon={<BookOpenIcon />}
        />
        <DashboardCard
          title="Total Students"
          value={myStudentsCount.toString()}
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
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Attendance Alerts
            </h2>
            <p className="text-sm text-slate-500 mb-3">
              Students who were absent or late yesterday.
            </p>
            {attendanceAlerts.length > 0 ? (
              <ul className="space-y-2">
                {attendanceAlerts.map((alert) => (
                  <li
                    key={alert.id}
                    className="p-2 bg-slate-50 rounded-lg flex justify-between items-center text-sm"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">
                        {alert.studentName}
                      </span>
                      <span className="text-slate-500">
                        {" "}
                        in {alert.courseName}
                      </span>
                    </div>
                    {alert.status === "LATE" ? (
                      <span className="px-2 py-0.5 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                        Late
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                        Absent
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                Perfect attendance yesterday!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

"use client";

import React, { useState, useEffect, useMemo } from "react";
// Removed TS types — keep only what you need

const AttendanceStatus = {
  PRESENT: "PRESENT",
  LATE: "LATE",
  ABSENT: "ABSENT",
};

const getAttendanceBadgeColor = (rate) => {
  if (rate >= 90) return "bg-green-100 text-green-800";
  if (rate >= 75) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const StudentPerformanceView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meResponse = await fetch("/api/me");
        if (!meResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const me = await meResponse.json();
        const facultyId = me.id;

        const coursesResponse = await fetch(
          `/api/courses?teacherId=${facultyId}`
        );
        if (!coursesResponse.ok) {
          throw new Error("Failed to fetch courses");
        }
        const courses = await coursesResponse.json();
        const myCourseIds = courses.map((c) => c.id);

        if (myCourseIds.length === 0) {
          setPerformanceData([]);
          setLoading(false);
          return;
        }

        const studentsResponse = await fetch(`/api/students`);
        if (!studentsResponse.ok) {
          throw new Error("Failed to fetch students");
        }
        const allStudents = await studentsResponse.json();

        const myStudentIds = new Set();
        allStudents.forEach((student) => {
          if (student.courses.some((c) => myCourseIds.includes(c.id))) {
            myStudentIds.add(student.id);
          }
        });
        const myStudents = allStudents.filter((s) => myStudentIds.has(s.id));

        const attendanceResponse = await fetch(`/api/attendances`);
        if (!attendanceResponse.ok) {
          throw new Error("Failed to fetch attendance");
        }
        const allAttendance = await attendanceResponse.json();

        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

        const data = myStudents.map((student) => {
          const studentAttendanceRecords = allAttendance.filter(
            (rec) =>
              rec.studentId === student.id && myCourseIds.includes(rec.courseId)
          );

          const presentCount = studentAttendanceRecords.filter(
            (r) =>
              r.status === AttendanceStatus.PRESENT ||
              r.status === AttendanceStatus.LATE
          ).length;

          const overallAttendance =
            studentAttendanceRecords.length > 0
              ? Math.round(
                  (presentCount / studentAttendanceRecords.length) * 100
                )
              : 100;

          const recentAlerts = studentAttendanceRecords.filter((rec) => {
            const recordDate = new Date(rec.date);
            return (
              recordDate >= fourteenDaysAgo &&
              (rec.status === AttendanceStatus.ABSENT ||
                rec.status === AttendanceStatus.LATE)
            );
          }).length;

          const teacherCourses = student.courses
            .filter((c) => myCourseIds.includes(c.id))
            .map((c) => c.name);

          return {
            ...student,
            overallAttendance,
            recentAlerts,
            teacherCourses,
          };
        });

        setPerformanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return performanceData;
    return performanceData.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [performanceData, searchTerm]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800">Student Performance</h1>
      <p className="text-slate-500">
        Monitor engagement and attendance for all your students in one place.
      </p>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-slate-800">
            My Students Overview
          </h2>
          <div className="relative w-full md:w-auto">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 
                    17C6.13401 17 3 13.866 3 10C3 6.13401 
                    6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Student Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Enrolled Courses
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Attendance Rate
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Alerts (Last 14d)
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((student) => (
                  <tr
                    key={student.id}
                    className="bg-white border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {student.name}
                    </td>
                    <td
                      className="px-6 py-4"
                      title={student.teacherCourses.join(", ")}
                    >
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {student.teacherCourses
                          .slice(0, 2)
                          .map((courseName) => (
                            <span
                              key={courseName}
                              className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
                            >
                              {courseName}
                            </span>
                          ))}
                        {student.teacherCourses.length > 2 && (
                          <span className="text-xs bg-slate-200 text-slate-800 px-2 py-1 rounded-full">
                            +{student.teacherCourses.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceBadgeColor(
                          student.overallAttendance
                        )}`}
                      >
                        {student.overallAttendance}%
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-center font-semibold ${
                        student.recentAlerts > 0
                          ? "text-red-600"
                          : "text-slate-600"
                      }`}
                    >
                      {student.recentAlerts}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="font-medium text-blue-600 hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {filteredData.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <p>No students found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceView;

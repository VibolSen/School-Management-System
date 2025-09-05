"use client";

import React, { useState, useMemo } from "react";

const MAX_COURSES_DISPLAY = 2;

const getStatusBadge = (isActive) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

export default function StudentTable({
  students = [],
  onAddStudentClick,
  onEditClick,
  onDeleteClick,
  allCourses = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" ? student.isActive : !student.isActive);

      const matchesCourse =
        courseFilter === "All" ||
        (student.courses || []).some((c) => c.id === courseFilter);

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [students, searchTerm, statusFilter, courseFilter]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Student Roster</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Courses</option>
            {allCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            onClick={onAddStudentClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Student ID</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Enrolled Courses</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.role?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.email}</td>
                  <td className="px-6 py-4 max-w-xs">
                    {(student.courses || []).length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {(student.courses || [])
                          .slice(0, MAX_COURSES_DISPLAY)
                          .map((course) => (
                            <span
                              key={course.id}
                              className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full whitespace-nowrap"
                            >
                              {course.name}
                            </span>
                          ))}
                        {(student.courses || []).length > MAX_COURSES_DISPLAY && (
                          <span
                            className="px-2 py-1 text-xs font-semibold text-slate-600 bg-slate-200 rounded-full whitespace-nowrap cursor-pointer"
                            title={(student.courses || [])
                              .slice(MAX_COURSES_DISPLAY)
                              .map((c) => c.name)
                              .join(", ")}
                          >
                            +{(student.courses || []).length - MAX_COURSES_DISPLAY} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(student.isActive)}</td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(student)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(student.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

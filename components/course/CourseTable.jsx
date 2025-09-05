"use client";

import React, { useState, useMemo } from "react";

const CourseTable = ({
  courses,
  onAddCourseClick,
  onEditClick,
  onDeleteClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Add safe access to properties with fallback values
      const courseTitle = course.title || "Untitled Course";
      const courseId = course.id || "";
      const courseDepartment = course.department || "General";

      const matchesSearch =
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" || courseDepartment === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [courses, searchTerm, departmentFilter]);

  const departments = ["Science", "Arts", "Commerce", "Engineering"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Available Courses
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Departments</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
          <button
            onClick={onAddCourseClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Add Course
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Course Title
              </th>
              <th scope="col" className="px-6 py-3">
                Course ID
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => {
              // Safe access to properties with fallback values
              const courseTitle = course.title || "Untitled Course";
              const courseId = course.id || "";
              const courseDepartment = course.department || "General";

              return (
                <tr
                  key={course.id}
                  className="bg-white border-b hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    {courseTitle}
                  </td>
                  <td className="px-6 py-4">{courseId}</td>
                  <td className="px-6 py-4">{courseDepartment}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onEditClick(course)}
                      className="font-medium text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(course)}
                      className="font-medium text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredCourses.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No courses found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseTable;

"use client";

import React, { useState, useMemo } from "react";

// The getStatusBadge function is no longer needed here.

export default function CourseTable({
  courses,
  onAddCourseClick,
  onEditClick,
  onDeleteClick,
  departments,
  teachers,
  allGroups,
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "ascending",
  });

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [instructorFilter, setInstructorFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const instructorName = course.instructor?.name?.toLowerCase() || "";
      const departmentName = course.department?.name?.toLowerCase() || "";
      const groupNames = (course.groups || [])
        .map((g) => g.name)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructorName.includes(searchTerm.toLowerCase()) ||
        departmentName.includes(searchTerm.toLowerCase()) ||
        groupNames.includes(searchTerm.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" || course.departmentId === departmentFilter;

      const matchesInstructor =
        instructorFilter === "All" || course.instructorId === instructorFilter;

      const matchesGroup =
        groupFilter === "All" ||
        (course.groups && course.groups.some((g) => g.id === groupFilter));

      return (
        matchesSearch && matchesDepartment && matchesInstructor && matchesGroup
      );
    });
  }, [courses, searchTerm, departmentFilter, instructorFilter, groupFilter]);

  const sortedCourses = useMemo(() => {
    if (!sortConfig.key) return filteredCourses;
    return [...filteredCourses].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "department":
          aValue = a.department?.name || "";
          bValue = b.department?.name || "";
          break;
        case "instructor":
          aValue = a.instructor?.name || "";
          bValue = b.instructor?.name || "";
          break;
        // ✅ Re-added sorting logic for the groups column (sorts by number of groups)
        case "groups":
          aValue = a.groups?.length || 0;
          bValue = b.groups?.length || 0;
          break;
        default:
          aValue = a[sortConfig.key] || "";
          bValue = b[sortConfig.key] || "";
      }
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredCourses, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Available Courses
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-40 px-3 py-2 border border-slate-300 rounded-md text-sm"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
          <select
            value={instructorFilter}
            onChange={(e) => setInstructorFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          >
            <option value="All">All Instructors</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
          >
            <option value="All">All Groups</option>
            {allGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <button
            onClick={onAddCourseClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            Add Course
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Course Title {getSortIndicator("title")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("department")}
              >
                Department {getSortIndicator("department")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("instructor")}
              >
                Instructor {getSortIndicator("instructor")}
              </th>
              {/* ✅ Restored the "Associated Groups" column header */}
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("groups")}
              >
                Associated Groups {getSortIndicator("groups")}
              </th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCourses.length > 0 ? (
              sortedCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {course.department?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {course.instructor?.name || "N/A"}
                  </td>
                  {/* ✅ Restored the cell that displays the group badges */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {course.groups && course.groups.length > 0 ? (
                        course.groups.map((group) => (
                          <span
                            key={group.id}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                          >
                            {group.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          None
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(course)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    {/* The toggle button has been removed from the actions */}
                    <button
                      onClick={() => onDeleteClick(course)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              // ✅ Corrected the colSpan to 5
              <tr>
                <td colSpan="5" className="text-center py-10 text-slate-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

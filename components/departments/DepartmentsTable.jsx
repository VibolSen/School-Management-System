"use client";

import React, { useState, useMemo } from "react";

export default function DepartmentsTable({
  departments,
  onAddDepartmentClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Memoized filtering logic
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const courseTitles = (dept.courses || [])
        .map((c) => c.title)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dept.description &&
          dept.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        courseTitles.includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [departments, searchTerm]);

  // Memoized sorting logic
  const sortedDepartments = useMemo(() => {
    if (!sortConfig.key) return filteredDepartments;

    return [...filteredDepartments].sort((a, b) => {
      // Special sort for courses based on count
      if (sortConfig.key === "courses") {
        const aCount = a.courses?.length || 0;
        const bCount = b.courses?.length || 0;
        if (aCount < bCount)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aCount > bCount)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      }

      // Default string sort
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredDepartments, sortConfig]);

  // Handler to update sorting configuration
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Helper to get visual indicator for sorting
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  if (isLoading && departments.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading departments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Department List
        </h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search departments or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={onAddDepartmentClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            Add Department
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {getSortIndicator("name")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("description")}
              >
                Description {getSortIndicator("description")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("courses")}
              >
                Associated Courses {getSortIndicator("courses")}
              </th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDepartments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No departments found.
                </td>
              </tr>
            ) : (
              sortedDepartments.map((dept) => (
                <tr key={dept.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {dept.description || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {dept.courses && dept.courses.length > 0 ? (
                        dept.courses.map((course) => (
                          <span
                            key={course.id}
                            className="text-xs bg-sky-100 text-sky-800 px-2 py-1 rounded-full"
                          >
                            {course.title}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 italic">
                          None
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(dept)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteClick(dept.id)}
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

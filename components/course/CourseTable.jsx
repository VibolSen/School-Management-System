"use client";

import React from "react";

const CourseTable = ({
  courses,
  onAddCourseClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Available Courses ({courses.length})
        </h2>
        <button
          onClick={onAddCourseClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Course
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Course Title</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Instructor</th>
              <th className="px-6 py-3">Associated Groups</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.id} className="border-b hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">{course.title}</td>
                  <td className="px-6 py-4">
                    {course.department?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {course.instructor?.name || "N/A"}
                  </td>
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-slate-500 italic"
                >
                  No courses found. Click "Add Course" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseTable;

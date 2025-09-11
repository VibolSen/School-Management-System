"use client";

import React from "react";

const AssignmentsTable = ({ assignments, onDelete }) => {
  if (!assignments || assignments.length === 0) {
    return <p>No assignments found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Activity</th>
            <th className="border px-4 py-2">Group / Student</th>
            <th className="border px-4 py-2">Course</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Submitted</th>
            <th className="border px-4 py-2">Grade</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id} className="text-center">
              {/* Activity */}
              <td className="border px-4 py-2">
                {a.assignment?.activity?.name ||
                  a.assignment?.activity?.title ||
                  a.assignment?.activityId || // fallback to activityId
                  "-"}
              </td>

              {/* Group / Student */}
              <td className="border px-4 py-2">
                {a.groupAssignment?.group?.name ||
                  a.groupAssignmentId || // fallback to ID if group name missing
                  a.student?.name ||
                  a.studentId || // fallback to studentId
                  "-"}
              </td>

              {/* Course */}
              <td className="border px-4 py-2">
                {a.assignment?.course?.title || a.assignment?.courseId || "-"}
              </td>

              {/* Status */}
              <td className="border px-4 py-2">
                {a.status?.name || a.statusId || "-"}
              </td>

              {/* Submitted */}
              <td className="border px-4 py-2">
                {a.submittedAt
                  ? new Date(a.submittedAt).toLocaleDateString()
                  : "-"}
              </td>

              {/* Grade */}
              <td className="border px-4 py-2">{a.grade ?? "-"}</td>

              {/* Actions */}
              <td className="border px-4 py-2">
                <button
                  onClick={() => onDelete(a.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentsTable;

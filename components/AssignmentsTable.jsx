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
            <th className="border px-4 py-2">Group</th>
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
              <td className="border px-4 py-2">{a.activity?.title || "-"}</td>
              <td className="border px-4 py-2">
                {a.groupAssignment?.name || "-"}
              </td>
              <td className="border px-4 py-2">
                {a.activity?.course?.title || "-"}
              </td>
              <td className="border px-4 py-2">{a.status?.name || "-"}</td>
              <td className="border px-4 py-2">
                {a.submittedAt
                  ? new Date(a.submittedAt).toLocaleDateString()
                  : "-"}
              </td>
              <td className="border px-4 py-2">{a.grade || "-"}</td>
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

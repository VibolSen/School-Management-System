'use client';

import React from 'react';

export default function StaffTable({ staffList, onEditClick, onDeleteClick }) {
  if (!staffList || staffList.length === 0) {
    return <p className="text-center py-8 text-gray-500">No staff found.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Name', 'Email', 'Role', 'Department', 'Status', 'Actions'].map(head => (
              <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {staffList.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.roleId}</td>
              <td className="px-6 py-4">{user.department}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 space-x-2">
                <button onClick={() => onEditClick(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button onClick={() => onDeleteClick(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

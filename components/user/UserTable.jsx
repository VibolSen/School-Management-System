"use client";

import React, { useState, useMemo } from "react";

const getStatusBadge = (isActive) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${
      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

export default function UserTable({
  users = [],
  onAddUserClick,
  onEditClick,
  onDeleteClick,
  onToggleStatus,
  allRoles = [],
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" ? user.isActive : !user.isActive);

      const matchesRole = roleFilter === "All" || user.roleId === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending")
      direction = "descending";
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Loading user data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">User Directory</h2>
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Roles</option>
            {allRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <button
            onClick={onAddUserClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
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
              <th className="px-6 py-3">Email</th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("roleId")}
              >
                Role {getSortIndicator("roleId")}
              </th>
              <th
                className="px-6 py-3 cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                Created {getSortIndicator("createdAt")}
              </th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full">
                      {allRoles.find((r) => r.id === user.roleId)?.name ||
                        user.roleId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleStatus(user.id, user.isActive)}
                      className="text-yellow-600 hover:text-yellow-900"
                      disabled={isLoading}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => onDeleteClick(user.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={isLoading}
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

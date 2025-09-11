"use client";

import React, { useState, useMemo } from "react";

const getStatusBadge = (isActive) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      isActive
        ? "bg-green-100 text-green-800 shadow-inner"
        : "bg-red-100 text-red-800 shadow-inner"
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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

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
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") direction = "descending";
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-xl">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-900">User Directory</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm bg-white"
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
            className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 shadow-lg transition"
            disabled={isLoading}
          >
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-inner">
        <table className="w-full text-sm text-left text-slate-600 bg-white rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-100 to-indigo-100 text-slate-700 uppercase">
            <tr>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("name")}>
                Name {getSortIndicator("name")}
              </th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("roleId")}>
                Role {getSortIndicator("roleId")}
              </th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Created {getSortIndicator("createdAt")}
              </th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    Loading users...
                  </div>
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 rounded-full shadow-sm">
                      {allRoles.find((r) => r.id === user.roleId)?.name || user.roleId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.department || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.position || "N/A"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() => onEditClick(user)}
                      className="text-indigo-600 hover:text-indigo-900 transition"
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onToggleStatus(user.id, user.isActive)}
                      className="text-yellow-600 hover:text-yellow-900 transition"
                      disabled={isLoading}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => onDeleteClick(user.id)}
                      className="text-red-600 hover:text-red-900 transition"
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

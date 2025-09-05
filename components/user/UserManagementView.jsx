"use client";

import React, { useState, useEffect, useCallback } from "react";

// Simple alert notification
const showMessage = (message, type = "success") => {
  alert(type === "success" ? `✅ ${message}` : `❌ ${message}`);
};

export default function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
      showMessage("Failed to load users", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock roles for selection
  const fetchRoles = useCallback(() => {
    const mockRoles = [
      { id: "admin", name: "Admin" },
      { id: "staff", name: "Staff" },
      { id: "students", name: "Student" },
    ];
    setRoles(mockRoles);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleAddClick = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      setUsers(users.filter((u) => u.id !== userId));
      showMessage("User deleted successfully!");
    } catch (err) {
      console.error(err);
      showMessage(`Failed to delete user: ${err.message}`, "error");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData) => {
    try {
      const payload = { ...userData };
      let res;
      if (editingUser) {
        res = await fetch(`/api/users?id=${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      showMessage(`User ${editingUser ? "updated" : "added"} successfully!`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      showMessage(`Failed to save user: ${err.message}`, "error");
    } finally {
      handleCloseModal();
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      setUsers(users.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u)));
      showMessage(`User ${!currentStatus ? "activated" : "deactivated"} successfully!`);
    } catch (err) {
      console.error(err);
      showMessage(`Failed to update status: ${err.message}`, "error");
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading users...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <button onClick={handleAddClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Role", "Status", "Created", "Actions"].map((head) => (
                <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No users found.</td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.roleId}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => handleEditClick(user)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                 
                  <button onClick={() => handleDeleteClick(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <UserModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveUser} userToEdit={editingUser} roles={roles} />}
    </div>
  );
}

// Modal for add/edit
function UserModal({ isOpen, onClose, onSave, userToEdit, roles }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "students", // default
    department: "",
    position: "",
    contactNumber: "",
    isActive: true,
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        password: "",
        roleId: userToEdit.roleId || "students",
        department: userToEdit.department || "",
        position: userToEdit.position || "",
        contactNumber: userToEdit.contactNumber || "",
        isActive: userToEdit.isActive ?? true,
      });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const payload = { ...formData };
  
    // Default role for new users
    if (!userToEdit) {
      if (!payload.roleId) payload.roleId = "students";
    } else {
      // On edit, remove empty password
      if (!payload.password) delete payload.password;
    }
  
    onSave(payload);
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{userToEdit ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border rounded px-3 py-2" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full border rounded px-3 py-2" required={!userToEdit} />
          <select name="roleId" value={formData.roleId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select Role</option>
            {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
          </select>
          <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="w-full border rounded px-3 py-2" />
          <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Position" className="w-full border rounded px-3 py-2" />
          <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" className="w-full border rounded px-3 py-2" />
          {userToEdit && (
            <div className="flex items-center">
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="mr-2" />
              <label>Active</label>
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">{userToEdit ? "Update" : "Create"} User</button>
          </div>
        </form>
      </div>
    </div>
  );
}

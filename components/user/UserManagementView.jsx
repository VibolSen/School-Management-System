"use client";

import React, { useState, useEffect, useCallback } from "react";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import Notification from "@/components/Notification";

export default function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

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

  // Fetch roles from API
  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error(err);
      // Fallback to default roles if API fails
      setRoles([
        { id: "admin", name: "Admin" },
        { id: "faculty", name: "Faculty" },
        { id: "hr", name: "HR" },
        { id: "students", name: "Student" },
        { id: "teacher", name: "Teacher" },
      ]);
    }
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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setIsLoading(true);
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
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );
      showMessage(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
    } catch (err) {
      console.error(err);
      showMessage(`Failed to update status: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData) => {
    setIsLoading(true);
    try {
      // Clean payload, remove fields not needed in the backend
      const payload = {
        name: userData.name,
        email: userData.email,
        roleId: userData.roleId,
        contactNumber: userData.contactNumber,
        isActive: userData.isActive,
      };

      if (!editingUser) {
        payload.password = userData.password;
      }

      const res = await fetch(
        editingUser ? `/api/users?id=${editingUser.id}` : "/api/users",
        {
          method: editingUser ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

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
      setIsLoading(false);
      handleCloseModal();
    }
  };

  if (isLoading && users.length === 0) {
    return <p className="text-center py-10">Loading user data...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ show: false, message: "", type: "" })}
      />

      <h1 className="text-3xl font-bold text-slate-800">User Management</h1>

      <UserTable
        users={users}
        allRoles={roles}
        onAddUserClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          userToEdit={editingUser}
          roles={roles}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

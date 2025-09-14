"use client";

import React, { useState, useEffect, useCallback } from "react";

// Assuming these components are in the same directory or adjust the path
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import ConfirmationDialog from "../ConfirmationDialog";

// Assuming Notification is a shared component
import Notification from "@/components/Notification";

export default function UserManagementView() {
  // --- STATE MANAGEMENT ---
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

  // New state for the custom confirmation dialog
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // --- UTILITY FUNCTIONS ---
  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // --- DATA FETCHING ---
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users.");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch("/api/roles");
      if (!response.ok) throw new Error("Failed to fetch roles.");
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError(err.message);
      showMessage(err.message, "error");
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // --- EVENT HANDLERS ---
  const handleAddClick = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (userData) => {
    setIsLoading(true);
    const method = userData.id ? "PUT" : "POST";
    const endpoint = userData.id
      ? `/api/users?id=${userData.id}`
      : "/api/users";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! Status: ${response.status}`
        );
      }

      showMessage(`User ${userData.id ? "updated" : "created"} successfully!`);
      await fetchUsers(); // Re-fetch users to get the latest data
    } catch (err) {
      console.error("Save user error:", err);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/status?id=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, status: !currentStatus } : u
        )
      );
      showMessage("User status updated successfully!");
    } catch (err) {
      console.error(err);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Open the confirmation dialog when delete is clicked
  const handleDeleteClick = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setIsConfirmModalOpen(true);
    }
  };

  // Step 2: Handle the actual deletion after user confirms
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/users?id=${userToDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(
          errData.error || `Failed to delete user. Status: ${res.status}`
        );
      }
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      showMessage("User deleted successfully!");
    } catch (err) {
      console.error("Delete user error:", err);
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
      setIsConfirmModalOpen(false); // Close the dialog on completion
      setUserToDelete(null); // Reset the user to delete
    }
  };

  // Step 3: Handle cancellation from the dialog
  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setUserToDelete(null);
  };

  // --- RENDER LOGIC ---
  if (isLoading && users.length === 0 && !error) {
    return <div className="text-center p-8">Loading users...</div>;
  }

  if (error && users.length === 0) {
    return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <h1 className="text-3xl font-bold text-slate-800">User Management</h1>

      <UserTable
        users={users}
        allRoles={roles}
        onAddUserClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onToggleStatus={handleToggleStatus}
        isLoading={isLoading && users.length > 0} // Show inline loading only when refreshing
      />

      {/* RENDER MODALS & DIALOGS */}
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

      <ConfirmationDialog
        isOpen={isConfirmModalOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the user "${userToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
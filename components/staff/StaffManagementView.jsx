'use client';

import React, { useState, useEffect, useCallback } from 'react';
import StaffTable from './StaffTable';
import AddStaffModal from './AddStaffModal';

// Staff roles (exclude students)
const STAFF_ROLES = [
  { id: 'admin', name: 'Admin' },
  { id: 'faculty', name: 'Faculty' },
  { id: 'hr', name: 'HR' },
];

// Simple alert notification
const showMessage = (message, type = 'success') => {
  alert(type === 'success' ? `✅ ${message}` : `❌ ${message}`);
};

export default function StaffManagementView() {
  const [staffList, setStaffList] = useState([]);
  const [roles, setRoles] = useState(STAFF_ROLES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const staffOnly = data.filter(user => user.roleId !== 'students');
      setStaffList(staffOnly);
    } catch (err) {
      console.error(err);
      setError('Failed to load staff data.');
      showMessage('Failed to load staff data.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAddClick = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
      setStaffList(prev => prev.filter(s => s.id !== id));
      showMessage('Staff member deleted successfully!');
    } catch (err) {
      console.error(err);
      showMessage(`Failed to delete staff: ${err.message}`, 'error');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSaveStaff = async (staffData) => {
    try {
      const dataToUpdate = {
        name: staffData.name,
        email: staffData.email,
        contactNumber: staffData.contactNumber,
        department: staffData.department,
        isActive: staffData.isActive,
        role: { connect: { id: staffData.roleId } },
        // hireDate removed
      };
  
      let res;
      if (editingStaff) {
        res = await fetch(`/api/users?id=${editingStaff.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToUpdate),
        });
      } else {
        // For new staff, also include password
        dataToUpdate["password"] = staffData.password;
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToUpdate),
        });
      }
  
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }
  
      showMessage(`Staff member ${editingStaff ? "updated" : "added"} successfully!`);
      fetchStaff();
    } catch (err) {
      console.error(err);
      showMessage(`Failed to save staff: ${err.message}`, "error");
    } finally {
      handleCloseModal();
    }
  };
  
  if (isLoading) return <p className="text-center py-10">Loading staff...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Staff Management</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Staff
        </button>
      </div>

      <StaffTable
        staffList={staffList}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />

      {isModalOpen && (
        <AddStaffModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveStaff}
          staffToEdit={editingStaff}
          roles={roles}
        />
      )}
    </div>
  );
}

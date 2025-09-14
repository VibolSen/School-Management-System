"use client";

import React, { useState, useEffect, useCallback } from "react";
import DepartmentsTable from "./DepartmentsTable";
import AddDepartmentModal from "./DepartmentModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import Notification from "@/components/Notification"; // Import Notification component

export default function DepartmentManagementView() {
  const [departments, setDepartments] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const API_BASE = "/api/departments";

  const showMessage = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  // Fetch all necessary data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [deptsRes, coursesRes] = await Promise.all([
        fetch(API_BASE),
        fetch("/api/courses"),
      ]);

      if (!deptsRes.ok)
        throw new Error(`Failed to fetch departments: ${deptsRes.statusText}`);
      if (!coursesRes.ok)
        throw new Error(`Failed to fetch courses: ${coursesRes.statusText}`);

      const deptsData = await deptsRes.json();
      const coursesData = await coursesRes.json();

      setDepartments(deptsData);
      setAllCourses(coursesData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      const errorMessage = "Failed to load required data.";
      setError(errorMessage);
      showMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddClick = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}?id=${itemToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      showMessage("Department deleted successfully!");
      fetchData(); // Refresh the list
      setItemToDelete(null);
    } catch (err) {
      console.error("Failed to delete department:", err);
      showMessage(`Failed to delete department: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  const handleSaveDepartment = async (formData) => {
    setIsLoading(true);
    try {
      const url = editingDepartment
        ? `${API_BASE}?id=${editingDepartment.id}`
        : API_BASE;
      const method = editingDepartment ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      showMessage(
        `Department ${editingDepartment ? "updated" : "added"} successfully!`
      );
      fetchData(); // Refresh data after save
    } catch (err) {
      console.error("Failed to save department:", err);
      showMessage(`Failed to save department: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  if (isLoading && departments.length === 0) {
    return <p className="text-center py-10">Loading departments...</p>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchData}
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
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <h1 className="text-3xl font-bold text-slate-800">
        Department Management
      </h1>

      <DepartmentsTable
        departments={departments}
        onAddDepartmentClick={handleAddClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
        isLoading={isLoading}
      />

      {isModalOpen && (
        <AddDepartmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDepartment}
          departmentToEdit={editingDepartment}
          allCourses={allCourses}
          isLoading={isLoading}
        />
      )}
      {itemToDelete && (
        <ConfirmationDialog
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          title="Delete Department"
          message="Are you sure you want to delete this department?"
        />
      )}
    </div>
  );
}
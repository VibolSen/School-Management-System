"use client";

import React, { useState, useEffect } from "react";
import CourseSelector from "./CourseSelector"; // Ensure this path is correct

export default function AddDepartmentModal({
  isOpen,
  onClose,
  onSave,
  departmentToEdit,
  allCourses = [],
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    courseIds: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (departmentToEdit) {
        setFormData({
          name: departmentToEdit.name || "",
          description: departmentToEdit.description || "",
          courseIds: departmentToEdit.courses
            ? departmentToEdit.courses.map((c) => c.id)
            : [],
        });
      } else {
        setFormData({ name: "", description: "", courseIds: [] });
      }
      setErrors({});
    }
  }, [isOpen, departmentToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCourseSelectionChange = (courseIds) => {
    setFormData((prev) => ({ ...prev, courseIds }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {departmentToEdit ? "Edit Department" : "Add New Department"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
            disabled={isLoading}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Department Name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-slate-300"
              }`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="A brief description of the department"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assign Courses
            </label>
            <CourseSelector
              allCourses={allCourses}
              selectedCourseIds={formData.courseIds}
              setSelectedCourseIds={handleCourseSelectionChange}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading
                ? "Saving..."
                : departmentToEdit
                ? "Update Department"
                : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

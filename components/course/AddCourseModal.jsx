"use client";

import React, { useState, useEffect, useRef } from "react";

const initialFormState = {
  title: "", // Changed from 'name' to 'title'
  department: "Science", // default department
  description: "", // Added new field
  objectives: "", // Added new field
  methodology: "", // Added new field
};

const AddCourseModal = ({ isOpen, onClose, onSaveCourse, courseToEdit }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const isEditMode = !!courseToEdit;

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setFormData({
          title: courseToEdit.title, // Changed from 'name' to 'title'
          department: courseToEdit.department,
          description: courseToEdit.description || "",
          objectives: courseToEdit.objectives || "",
          methodology: courseToEdit.methodology || "",
        });
      } else {
        setFormData(initialFormState);
      }
      setError("");
      // Autofocus on the input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, courseToEdit]);

  const validate = () => {
    if (!formData.title.trim()) {
      // Changed from 'name' to 'title'
      setError("Course title is required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSaveCourse(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-course-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2
              id="add-course-modal-title"
              className="text-xl font-bold text-slate-800"
            >
              {isEditMode ? "Edit Course" : "Add New Course"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800"
              aria-label="Close modal"
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
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Course Title
              </label>
              <input
                ref={inputRef}
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  error
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                required
                aria-describedby="title-error"
              />
              {error && (
                <p id="title-error" className="text-xs text-red-500 mt-1">
                  {error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Commerce">Commerce</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="objectives"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Learning Objectives
              </label>
              <textarea
                id="objectives"
                name="objectives"
                value={formData.objectives}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="2"
              />
            </div>

            <div>
              <label
                htmlFor="methodology"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Teaching Methodology
              </label>
              <textarea
                id="methodology"
                name="methodology"
                value={formData.methodology}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows="2"
              />
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isEditMode ? "Save Changes" : "Save Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;

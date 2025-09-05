"use client";

import React, { useState, useEffect, useRef } from "react";

const initialFormState = {
  name: "",
  email: "",
  enrollmentDate: "",
  password: "",       // Only for new students
  isActive: true,     // Active/Inactive status
};

const AddStudentModal = ({
  isOpen,
  onClose,
  onSaveStudent,
  studentToEdit,
  allCourses = [],
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const isEditMode = !!studentToEdit;

  useEffect(() => {
    if (isOpen) {
      if (studentToEdit) {
        setFormData({
          name: studentToEdit.name,
          email: studentToEdit.email,
          enrollmentDate: studentToEdit.enrollmentDate,
          password: "",
          isActive: studentToEdit.isActive ?? true,
        });
        setSelectedCourseIds(studentToEdit.courses?.map((c) => c.id) || []);
      } else {
        setFormData(initialFormState);
        setSelectedCourseIds([]);
      }
      setErrors({});
      setIsDropdownOpen(false);
      setSearchTerm("");
    }
  }, [isOpen, studentToEdit]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!formData.enrollmentDate)
      newErrors.enrollmentDate = "Enrollment date is required.";
    if (!isEditMode && !formData.password.trim())
      newErrors.password = "Password is required for new students.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourseIds((prevIds) =>
      prevIds.includes(courseId)
        ? prevIds.filter((id) => id !== courseId)
        : [...prevIds, courseId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSaveStudent({
      ...formData,
      courseIds: selectedCourseIds,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCourses = allCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-student-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2
              id="add-student-modal-title"
              className="text-xl font-bold text-slate-800"
            >
              {isEditMode ? "Edit Student Details" : "Add New Student"}
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
          <div className="p-6 grid grid-cols-1 gap-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.name ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.email ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    errors.password ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
                  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
            )}

            {/* Enrollment Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Enrollment Date
              </label>
              <input
  type="date"
  name="enrollmentDate"
  value={formData.enrollmentDate || ""}
  onChange={handleChange}
  className={`w-full px-3 py-2 border rounded-md text-sm ${
    errors.enrollmentDate ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
  } focus:outline-none focus:ring-1 focus:ring-blue-500`}
/>

              {errors.enrollmentDate && <p className="text-xs text-red-500 mt-1">{errors.enrollmentDate}</p>}
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Active Status
              </label>
              <select
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.value === "true" }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Courses */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Course Enrollment
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-white border border-slate-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <div className="flex flex-wrap gap-1 min-h-[20px]">
                    {selectedCourseIds.length === 0 ? (
                      <span className="text-slate-500">Select courses...</span>
                    ) : (
                      allCourses
                        .filter((c) => selectedCourseIds.includes(c.id))
                        .map((course) => (
                          <span
                            key={course.id}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
                          >
                            {course.title}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourseIds(selectedCourseIds.filter(id => id !== course.id));
                              }}
                              className="text-blue-600 hover:text-blue-800 focus:outline-none"
                            >
                              &times;
                            </button>
                          </span>
                        ))
                    )}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <div className="p-2">
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <ul className="list-none p-0 m-0">
                      {filteredCourses.map((course) => (
                        <li key={course.id}>
                          <label className="flex items-center py-2 px-3 hover:bg-slate-100 cursor-pointer text-sm text-slate-700 select-none">
                            <input
                              type="checkbox"
                              checked={selectedCourseIds.includes(course.id)}
                              onChange={() =>
                                setSelectedCourseIds(selectedCourseIds.includes(course.id)
                                  ? selectedCourseIds.filter(id => id !== course.id)
                                  : [...selectedCourseIds, course.id])
                              }
                              className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3">{course.title}</span>
                          </label>
                        </li>
                      ))}
                      {filteredCourses.length === 0 && (
                        <p className="text-center py-2 text-sm text-slate-500">No courses found.</p>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
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
              {isEditMode ? "Save Changes" : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;

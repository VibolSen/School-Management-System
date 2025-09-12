"use client";

import { useState, useEffect, useCallback } from "react";
import CourseSelector from "@/components/departments/CourseSelector"; // Assuming a reusable component

// Simple alert-based notification system
const showMessage = (message, type = "success") => {
  if (type === "success") {
    alert(`✅ ${message}`);
  } else {
    alert(`❌ ${message}`);
  }
};

export default function DepartmentManagementView() {
  const [departments, setDepartments] = useState([]);
  const [allCourses, setAllCourses] = useState([]); // State for all courses
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", courseIds: [] });

  const API_BASE = "/api/departments";

  // Fetch all necessary data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch departments
      const resDepts = await fetch(API_BASE);
      if (!resDepts.ok) throw new Error(`HTTP error! status: ${resDepts.status}`);
      const deptsData = await resDepts.json();
      setDepartments(deptsData);

      // Fetch all courses for the selector
      const resCourses = await fetch("/api/courses");
      if (!resCourses.ok) throw new Error(`HTTP error! status: ${resCourses.status}`);
      const coursesData = await resCourses.json();
      setAllCourses(coursesData);

    } catch (err) {
      console.error("Failed to fetch data:", err);
      const errorMessage = "Failed to load data.";
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
    setFormData({ name: "", description: "", courseIds: [] });
    setIsFormOpen(true);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      courseIds: department.courses ? department.courses.map(c => c.id) : []
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (departmentId) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      const response = await fetch(`${API_BASE}?id=${departmentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchData(); // Refresh the list
      showMessage("Department deleted successfully!");
    } catch (err) {
      console.error("Failed to delete department:", err);
      showMessage(`Failed to delete department: ${err.message}`, "error");
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDepartment(null);
    setFormData({ name: "", description: "", courseIds: [] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Specific handler for the CourseSelector
  const handleCourseSelectionChange = (courseIds) => {
    setFormData(prev => ({ ...prev, courseIds }));
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();

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
      handleCloseForm();
    } catch (err) {
      console.error("Failed to save department:", err);
      showMessage(`Failed to save department: ${err.message}`, "error");
    }
  };


  if (isLoading) return <div className="text-center py-10"><p>Loading...</p></div>;
  if (error) return <div className="text-center py-10 text-red-600"><p>{error}</p><button onClick={fetchData}>Retry</button></div>;

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Department Management</h1>
        <button onClick={handleAddClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Department
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Associated Courses</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((department) => (
              <tr key={department.id}>
                <td className="px-6 py-4 font-medium">{department.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{department.description || "N/A"}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {department.courses && department.courses.length > 0 ? (
                      department.courses.map(course => (
                        <span key={course.id} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                          {course.title}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => handleEditClick(department)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDeleteClick(department.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {departments.length === 0 && <div className="text-center py-8"><p>No departments found.</p></div>}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <form onSubmit={handleSaveDepartment} className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">{editingDepartment ? "Edit" : "Add"} Department</h2>
              <div>
                <label className="block text-sm font-medium">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Assign Courses</label>
                 <CourseSelector
                   allCourses={allCourses}
                   selectedCourseIds={formData.courseIds}
                   setSelectedCourseIds={handleCourseSelectionChange}
                 />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={handleCloseForm} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import React, { useState, useMemo } from "react";
import ELibraryGrid from "./ELibraryGrid";
import ResourceDetailModal from "./ResourceDetailModal";
import AddResourceModal from "./AddResourceModal";
import ConfirmationModal from "./ConfirmationModal";

const ELibraryView = () => {
  const [resources, setResources] = useState([]); // Replace with API fetch if needed
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [selectedResource, setSelectedResource] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const handleResourceClick = (resource) => setSelectedResource(resource);
  const handleCloseDetailModal = () => setSelectedResource(null);
  const handleAddClick = () => {
    setEditingResource(null);
    setIsEditModalOpen(true);
  };
  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setIsEditModalOpen(true);
  };
  const handleDeleteRequest = (resource) => setResourceToDelete(resource);

  const handleConfirmDelete = () => {
    if (!resourceToDelete) return;
    const updatedResources = resources.filter(
      (r) => r.id !== resourceToDelete.id
    );
    setResources(updatedResources);
    setResourceToDelete(null);
  };

  const handleSaveResource = (resourceData) => {
    if (editingResource) {
      const updatedResource = { ...editingResource, ...resourceData };
      const newResources = resources.map((r) =>
        r.id === editingResource.id ? updatedResource : r
      );
      setResources(newResources);
    } else {
      const newResource = {
        id: `LIB${Date.now()}`,
        isAvailable: true,
        ...resourceData,
      };
      const newResources = [...resources, newResource].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setResources(newResources);
    }
    setIsEditModalOpen(false);
    setEditingResource(null);
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        resource.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        resource.author.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesType = typeFilter === "All" || resource.type === typeFilter;
      const matchesDepartment =
        departmentFilter === "All" || resource.department === departmentFilter;
      return matchesSearch && matchesType && matchesDepartment;
    });
  }, [resources, searchTerm, typeFilter, departmentFilter]);

  const resourceTypes = ["Book", "Journal", "Magazine"]; // Replace with actual ResourceType values
  const departments = ["Science", "Arts", "Commerce", "Engineering"]; // Replace with actual Department values

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">E-Library</h1>
          <p className="text-slate-500">
            Browse, search, and manage the digital collection of books and
            journals.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
        >
          Add Resource
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md sticky top-0 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Types</option>
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Departments</option>
              {departments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <ELibraryGrid
        resources={filteredResources}
        onResourceClick={handleResourceClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteRequest}
      />

      <ResourceDetailModal
        isOpen={!!selectedResource}
        onClose={handleCloseDetailModal}
        resource={selectedResource}
      />

      <AddResourceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingResource(null);
        }}
        onSaveResource={handleSaveResource}
        resourceToEdit={editingResource}
      />

      <ConfirmationModal
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource"
        message={
          <div>
            <p>
              Are you sure you want to delete "
              <strong>{resourceToDelete?.title}</strong>"?
            </p>
            <p className="mt-2 text-sm">This action cannot be undone.</p>
          </div>
        }
      />
    </div>
  );
};

export default ELibraryView;

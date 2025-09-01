'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_E_LIBRARY_DATA } from '@/lib/constants';
import type { LibraryResource } from '@/lib/types';
import { Department, ResourceType } from '@/lib/types';
import ELibraryGrid from '@/components/ELibraryGrid';
import ResourceDetailModal from '@/components/ResourceDetailModal';
import AddResourceModal from '@/components/AddResourceModal';
import ConfirmationModal from '@/components/ConfirmationModal';


const ELibraryView: React.FC = () => {
  const [resources, setResources] = useState<LibraryResource[]>(MOCK_E_LIBRARY_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<LibraryResource | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<LibraryResource | null>(null);

  const handleResourceClick = (resource: LibraryResource) => {
    setSelectedResource(resource);
  };

  const handleCloseDetailModal = () => {
    setSelectedResource(null);
  };
  
  const handleAddClick = () => {
    setEditingResource(null);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (resource: LibraryResource) => {
    setEditingResource(resource);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteRequest = (resource: LibraryResource) => {
      setResourceToDelete(resource);
  };
  
  const handleConfirmDelete = () => {
      if (!resourceToDelete) return;
      const updatedResources = resources.filter(r => r.id !== resourceToDelete.id);
      MOCK_E_LIBRARY_DATA.splice(0, MOCK_E_LIBRARY_DATA.length, ...updatedResources);
      setResources(updatedResources);
      setResourceToDelete(null);
  };

  const handleSaveResource = (resourceData: Omit<LibraryResource, 'id' | 'isAvailable' | 'borrowedBy'>) => {
      if (editingResource) {
          // Update
          const updatedResource = { ...editingResource, ...resourceData };
          const newResources = resources.map(r => r.id === editingResource.id ? updatedResource : r);
          MOCK_E_LIBRARY_DATA.splice(0, MOCK_E_LIBRARY_DATA.length, ...newResources);
          setResources(newResources);
      } else {
          // Add new resource
          const newResource: LibraryResource = {
              id: `LIB${Date.now()}`,
              isAvailable: true,
              ...resourceData,
          };
          const newResources = [...resources, newResource].sort((a,b) => a.title.localeCompare(b.title));
          MOCK_E_LIBRARY_DATA.splice(0, MOCK_E_LIBRARY_DATA.length, ...newResources);
          setResources(newResources);
      }
      setIsEditModalOpen(false);
      setEditingResource(null);
  };

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        resource.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        resource.author.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesType = typeFilter === 'All' || resource.type === typeFilter;
      const matchesDepartment = departmentFilter === 'All' || resource.department === departmentFilter;
      return matchesSearch && matchesType && matchesDepartment;
    });
  }, [resources, searchTerm, typeFilter, departmentFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">E-Library</h1>
          <p className="text-slate-500">Browse, search, and manage the digital collection of books and journals.</p>
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
             <label htmlFor="elibrary-search" className="sr-only">Search E-Library</label>
             <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                </span>
                <input
                    id="elibrary-search"
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        aria-label="Clear search"
                    >
                        <svg className="w-5 h-5 text-slate-400 hover:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
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
              {Object.values(ResourceType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Departments</option>
              {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
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
        onClose={() => { setIsEditModalOpen(false); setEditingResource(null); }}
        onSaveResource={handleSaveResource}
        resourceToEdit={editingResource}
      />

      <ConfirmationModal
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource"
        message={
          <>
            <p>Are you sure you want to delete "<strong>{resourceToDelete?.title}</strong>"?</p>
            <p className="mt-2 text-sm">This action cannot be undone.</p>
          </>
        }
      />
    </div>
  );
};

export default ELibraryView;

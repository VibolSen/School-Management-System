'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import type { LibraryResource } from '@/lib/types';
import { Department, ResourceType } from '@/lib/types';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveResource: (resourceData: Omit<LibraryResource, 'id' | 'isAvailable' | 'borrowedBy'>) => void;
  resourceToEdit?: LibraryResource | null;
}

const initialFormState: Omit<LibraryResource, 'id' | 'isAvailable' | 'borrowedBy'> = {
  title: '',
  author: '',
  type: ResourceType.BOOK,
  coverImage: '',
  publicationYear: new Date().getFullYear(),
  department: Department.SCIENCE,
  description: '',
};

const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, onSaveResource, resourceToEdit }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  
  const isEditMode = !!resourceToEdit;

  useEffect(() => {
    if (isOpen) {
        if (resourceToEdit) {
            setFormData({
                title: resourceToEdit.title,
                author: resourceToEdit.author,
                type: resourceToEdit.type,
                coverImage: resourceToEdit.coverImage,
                publicationYear: resourceToEdit.publicationYear,
                department: resourceToEdit.department,
                description: resourceToEdit.description,
            });
        } else {
            setFormData(initialFormState);
        }
        setErrors({});
    }
  }, [isOpen, resourceToEdit]);

  const validate = (): boolean => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.author.trim()) newErrors.author = 'Author is required.';
    if (!formData.coverImage.trim()) {
        newErrors.coverImage = 'Cover image URL is required.';
    } else {
        try {
            new URL(formData.coverImage);
        } catch (_) {
            newErrors.coverImage = 'Please enter a valid URL.';
        }
    }
    if (!formData.publicationYear) {
      (newErrors as any).publicationYear = 'Publication year is required.';
    } else if (isNaN(Number(formData.publicationYear))) {
      (newErrors as any).publicationYear = 'Year must be a number.';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveResource(formData);
    }
  };

  // FIX: Correctly handle type conversion for the 'publicationYear' number field
  // and improve type safety for other fields.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'publicationYear') {
        const year = parseInt(value, 10);
        // If parsing fails (e.g., empty or invalid string), it will result in NaN.
        // Revert to the previous value in state to prevent invalid data.
        setFormData(prev => ({ ...prev, publicationYear: isNaN(year) ? prev.publicationYear : year }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-resource-modal-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 id="add-resource-modal-title" className="text-xl font-bold text-slate-800">
              {isEditMode ? 'Edit Library Resource' : 'Add New Library Resource'}
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-slate-700 mb-1">Author</label>
              <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.author ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required />
              {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
            </div>
             <div className="md:col-span-2">
              <label htmlFor="coverImage" className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
              <input type="url" id="coverImage" name="coverImage" value={formData.coverImage} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.coverImage ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required placeholder="https://picsum.photos/seed/example/400/600"/>
              {errors.coverImage && <p className="text-xs text-red-500 mt-1">{errors.coverImage}</p>}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">Resource Type</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                {Object.values(ResourceType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="publicationYear" className="block text-sm font-medium text-slate-700 mb-1">Publication Year</label>
              <input type="number" id="publicationYear" name="publicationYear" value={formData.publicationYear} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.publicationYear ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required />
              {errors.publicationYear && <p className="text-xs text-red-500 mt-1">{errors.publicationYear}</p>}
            </div>
             <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select id="department" name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>
             <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required></textarea>
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isEditMode ? 'Save Changes' : 'Save Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourceModal;
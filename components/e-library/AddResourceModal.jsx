'use client';

import React, { useState, useEffect } from 'react';

const initialFormState = {
  title: '',
  author: '',
  type: 'Book',           // default type, adjust as needed
  coverImage: '',
  publicationYear: new Date().getFullYear(),
  department: 'Science',  // default department, adjust as needed
  description: '',
};

const AddResourceModal = ({ isOpen, onClose, onSaveResource, resourceToEdit }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  
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

  const validate = () => {
    const newErrors = {};
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
      newErrors.publicationYear = 'Publication year is required.';
    } else if (isNaN(Number(formData.publicationYear))) {
      newErrors.publicationYear = 'Year must be a number.';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSaveResource({
        ...formData,
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'publicationYear') {
      const year = parseInt(value, 10);
      setFormData(prev => ({ ...prev, publicationYear: isNaN(year) ? prev.publicationYear : year }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? 'Edit Library Resource' : 'Add New Library Resource'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
              <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="publicationYear" className="block text-sm font-medium text-slate-700 mb-1">Publication Year</label>
              <input type="number" id="publicationYear" name="publicationYear" value={formData.publicationYear} onChange={handleChange} min="1900" max={new Date().getFullYear()} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.publicationYear ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required />
              {errors.publicationYear && <p className="text-xs text-red-500 mt-1">{errors.publicationYear}</p>}
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
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

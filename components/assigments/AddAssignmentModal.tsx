'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import type { Assignment, Course } from '@/lib/types';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: Omit<Assignment, 'id'>) => void;
  courses: Course[];
  assignmentToEdit?: Assignment | null;
}

const initialFormState = {
  title: '',
  description: '',
  dueDate: '',
  courseId: '',
};

const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({ isOpen, onClose, onSave, courses, assignmentToEdit }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Partial<typeof initialFormState>>({});

  const isEditMode = !!assignmentToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          title: assignmentToEdit.title,
          description: assignmentToEdit.description,
          dueDate: assignmentToEdit.dueDate,
          courseId: assignmentToEdit.courseId,
        });
      } else {
        // Pre-select the first course if available
        const firstCourseId = courses.length > 0 ? courses[0].id : '';
        setFormData({ ...initialFormState, courseId: firstCourseId });
      }
      setErrors({});
    }
  }, [isOpen, courses, assignmentToEdit, isEditMode]);

  const validate = (): boolean => {
    const newErrors: Partial<typeof initialFormState> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required.';
    if (!formData.courseId) newErrors.courseId = 'Course selection is required.';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required.';
    else if (!isEditMode && new Date(formData.dueDate) < new Date(new Date().toDateString())) {
        newErrors.dueDate = 'Due date cannot be in the past.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-assignment-modal-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 id="add-assignment-modal-title" className="text-xl font-bold text-slate-800">
              {isEditMode ? 'Edit Assignment' : 'Create New Assignment'}
            </h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Assignment Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required aria-describedby="title-error" />
              {errors.title && <p id="title-error" className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                <select id="courseId" name="courseId" value={formData.courseId} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.courseId ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white`} required aria-describedby="courseId-error">
                  {courses.map(course => <option key={course.id} value={course.id}>{course.name}</option>)}
                </select>
                {errors.courseId && <p id="courseId-error" className="text-xs text-red-500 mt-1">{errors.courseId}</p>}
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.dueDate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required aria-describedby="dueDate-error"/>
                {errors.dueDate && <p id="dueDate-error" className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
              </div>
            </div>
             <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Provide instructions, requirements, etc."></textarea>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {isEditMode ? 'Save Changes' : 'Save Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentModal;

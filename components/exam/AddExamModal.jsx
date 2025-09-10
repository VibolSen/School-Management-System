'use client';

import React, { useState, useEffect } from 'react';

const initialFormState = {
  title: '',
  description: '',
  examDate: '',
  startTime: '09:00',
  duration: 60,
  courseId: '',
};

export default function AddExamModal({ isOpen, onClose, courses = [], examToEdit }) {
  const [formData, setFormData] = useState(initialFormState);
  const isEditMode = !!examToEdit;

  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && examToEdit) {
      setFormData({
        title: examToEdit.title || '',
        description: examToEdit.description || '',
        examDate: examToEdit.examDate || '',
        startTime: examToEdit.startTime || '09:00',
        duration: examToEdit.duration || 60,
        courseId: examToEdit.courseId || '',
      });
    } else {
      setFormData((prev) => ({
        ...initialFormState,
        courseId: courses.length > 0 ? courses[0].id : '',
      }));
    }
    // Only run this when modal opens or examToEdit changes
  }, [isOpen, isEditMode, examToEdit]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto relative">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditMode ? 'Edit Exam' : 'Schedule New Exam'}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                Exam Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-slate-700 mb-1">
                Course
              </label>
              <select
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))
                ) : (
                  <option value="">No courses available</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="examDate" className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="examDate"
                  name="examDate"
                  value={formData.examDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-slate-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                Description / Instructions
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., Exam format, topics covered, allowed materials..."
              ></textarea>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
              Cancel
            </button>
            <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md">
              {isEditMode ? 'Save Changes' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

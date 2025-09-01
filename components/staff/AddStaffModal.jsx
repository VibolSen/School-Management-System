'use client';

import React, { useState, useEffect } from 'react';

const Department = {
  ADMINISTRATION: 'Administration',
  HR: 'HR',
  FINANCE: 'Finance',
  IT: 'IT',
};

const Role = {
  FACULTY: 'Faculty',
  STAFF: 'Staff',
  ADMIN: 'Admin',
};

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  department: Department.ADMINISTRATION,
  position: '',
  role: Role.FACULTY,
  hireDate: '',
  status: 'Active',
};

export default function AddStaffModal({ isOpen, onClose, onSaveStaff, staffToEdit }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const isEditMode = !!staffToEdit;

  useEffect(() => {
    if (isOpen) {
      if (staffToEdit) {
        setFormData({ ...staffToEdit });
      } else {
        setFormData(initialFormState);
      }
      setErrors({});
    }
  }, [isOpen, staffToEdit]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.position.trim()) newErrors.position = 'Position is required.';
    if (!formData.hireDate) newErrors.hireDate = 'Hire date is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSaveStaff(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-slate-700 mb-1">Position</label>
              <input type="text" id="position" name="position" value={formData.position} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.position ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} />
              {errors.position && <p className="text-xs text-red-500 mt-1">{errors.position}</p>}
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select id="department" name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                {Object.values(Department).map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                 {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="hireDate" className="block text-sm font-medium text-slate-700 mb-1">Hire Date</label>
              <input type="date" id="hireDate" name="hireDate" value={formData.hireDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.hireDate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} />
              {errors.hireDate && <p className="text-xs text-red-500 mt-1">{errors.hireDate}</p>}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700">{isEditMode ? 'Save Changes' : 'Save Staff Member'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

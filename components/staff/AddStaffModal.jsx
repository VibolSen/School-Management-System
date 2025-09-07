'use client';

import React, { useState, useEffect } from 'react';

export default function AddStaffModal({ isOpen, onClose, onSave, staffToEdit, roles, departments }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    department: '',
    roleId: roles?.[0]?.id || '',
    password: '',
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (staffToEdit) {
        setFormData({
          name: staffToEdit.name || '',
          email: staffToEdit.email || '',
          contactNumber: staffToEdit.contactNumber || '',
          department: staffToEdit.department || '',
          roleId: staffToEdit.roleId || roles?.[0]?.id || '',
          isActive: staffToEdit.isActive ?? true,
          password: '',
        });
      } else {
        setFormData(prev => ({ ...prev, roleId: roles?.[0]?.id || '' }));
      }
    }
  }, [isOpen, staffToEdit, roles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {staffToEdit ? 'Edit Staff' : 'Add Staff'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          <input type="text" name="contactNumber" placeholder="Phone" value={formData.contactNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />

          {/* Department select */}
          <select name="department" value={formData.department} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Select Department</option>
            {(departments || []).map(dep => <option key={dep.id} value={dep.name}>{dep.name}</option>)}
          </select>

          {/* Role select */}
          <select name="roleId" value={formData.roleId} onChange={handleChange} className="w-full border px-3 py-2 rounded" required>
            <option value="">Select Role</option>
            {(roles || []).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>

          {!staffToEdit && (
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
          )}

          {/* Status */}
          <select name="isActive" value={formData.isActive ? 'Active' : 'Inactive'} onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.value === 'Active' }))} className="w-full border px-3 py-2 rounded">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">{staffToEdit ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

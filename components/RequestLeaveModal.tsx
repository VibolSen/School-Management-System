import React, { useState, FormEvent, useEffect } from 'react';
import type { LeaveRequest } from '../types';
import { LeaveType } from '../types';

interface RequestLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRequest: (newRequest: Omit<LeaveRequest, 'id' | 'staffId' | 'staffName' | 'status' | 'requestDate'>) => void;
}

const initialFormState = {
  leaveType: LeaveType.ANNUAL,
  startDate: '',
  endDate: '',
  reason: '',
};

const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ isOpen, onClose, onSaveRequest }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Partial<typeof initialFormState>>({});
  
  useEffect(() => {
    if (isOpen) {
        setFormData(initialFormState);
        setErrors({});
    }
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<typeof initialFormState> = {};
    if (!formData.startDate) newErrors.startDate = 'Start date is required.';
    if (!formData.endDate) newErrors.endDate = 'End date is required.';
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date cannot be before the start date.';
    }
    if (!formData.reason.trim()) newErrors.reason = 'A reason for the leave is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSaveRequest(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="request-leave-modal-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-full overflow-y-auto transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 id="request-leave-modal-title" className="text-xl font-bold text-slate-800">
              Apply for Leave
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
              <label htmlFor="leaveType" className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
              <select id="leaveType" name="leaveType" value={formData.leaveType} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                {Object.values(LeaveType).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.startDate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required aria-describedby="startDate-error"/>
                    {errors.startDate && <p id="startDate-error" className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.endDate ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required aria-describedby="endDate-error"/>
                    {errors.endDate && <p id="endDate-error" className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
                </div>
            </div>
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
              <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows={4} className={`w-full px-3 py-2 border rounded-md text-sm ${errors.reason ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} focus:outline-none focus:ring-1 focus:ring-blue-500`} required aria-describedby="reason-error"></textarea>
              {errors.reason && <p id="reason-error" className="text-xs text-red-500 mt-1">{errors.reason}</p>}
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t rounded-b-xl flex justify-end items-center gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Submit Request
            </button>
          </div>
        </form>
      </div>
       <style>{`
          @keyframes fade-in-scale {
            from {
              transform: scale(.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-fade-in-scale {
            animation: fade-in-scale 0.2s ease-out forwards;
          }
      `}</style>
    </div>
  );
};

export default RequestLeaveModal;

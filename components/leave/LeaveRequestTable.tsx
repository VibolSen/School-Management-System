'use client';

import React, { useState, useMemo } from 'react';
import type { LeaveRequest } from '@/lib/types';
import { LeaveRequestStatus, LeaveType, Role } from '@/lib/types';

interface LeaveRequestTableProps {
  requests: LeaveRequest[];
  currentUserRole: Role;
  onApprove: (request: LeaveRequest) => void;
  onReject: (request: LeaveRequest) => void;
}

const getStatusBadge = (status: LeaveRequestStatus) => {
  switch (status) {
    case LeaveRequestStatus.PENDING:
      return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pending</span>;
    case LeaveRequestStatus.APPROVED:
      return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Approved</span>;
    case LeaveRequestStatus.REJECTED:
      return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Rejected</span>;
    default:
      return null;
  }
};

const LeaveRequestTable: React.FC<LeaveRequestTableProps> = ({ requests, currentUserRole, onApprove, onReject }) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
      const matchesType = typeFilter === 'All' || req.leaveType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [requests, statusFilter, typeFilter]);
  
  const canManage = currentUserRole === Role.ADMINISTRATOR || currentUserRole === Role.HR;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
       <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">All Requests</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-2">
          <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
              <option value="All">All Statuses</option>
              {Object.values(LeaveRequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
              <option value="All">All Types</option>
              {Object.values(LeaveType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th scope="col" className="px-6 py-3">Staff Name</th>
              <th scope="col" className="px-6 py-3">Leave Type</th>
              <th scope="col" className="px-6 py-3">Dates</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{req.staffName}</td>
                <td className="px-6 py-4">{req.leaveType}</td>
                <td className="px-6 py-4">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                <td className="px-6 py-4 text-center">
                  {canManage && req.status === LeaveRequestStatus.PENDING ? (
                     <div className="flex justify-center items-center gap-2">
                        <button onClick={() => onApprove(req)} className="font-medium text-green-600 hover:underline">Approve</button>
                        <button onClick={() => onReject(req)} className="font-medium text-red-600 hover:underline">Reject</button>
                     </div>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No leave requests found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestTable;

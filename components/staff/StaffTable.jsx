import React, { useState, useMemo } from 'react';

const Department = {
  HR: 'HR',
  Finance: 'Finance',
  IT: 'IT',
  Admin: 'Admin',
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'Active':
      return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Active</span>;
    case 'On Leave':
      return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">On Leave</span>;
    case 'Inactive':
      return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Inactive</span>;
    default:
      return null;
  }
};

export default function StaffTable({ staff, onAddStaffClick, onEditClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.position.toLowerCase().includes(lowerCaseSearchTerm) ||
        member.id.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesDepartment = departmentFilter === 'All' || member.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [staff, searchTerm, departmentFilter, statusFilter]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('All');
    setStatusFilter('All');
  };

  const areFiltersActive = searchTerm !== '' || departmentFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">Staff Members</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row flex-wrap items-center justify-end gap-2">
          <input
            type="text"
            placeholder="Search by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Departments</option>
            {Object.values(Department).map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
          {areFiltersActive && (
            <button
              onClick={handleClearFilters}
              className="w-full md:w-auto px-4 py-2 border border-slate-300 rounded-md text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 transition"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={onAddStaffClick}
            className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition"
          >
            Add Staff
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Hire Date</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(member => (
              <tr key={member.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{member.name}</td>
                <td className="px-6 py-4">{member.position}</td>
                <td className="px-6 py-4">{member.department}</td>
                <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                <td className="px-6 py-4">{new Date(member.hireDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => onEditClick(member)} className="font-medium text-blue-600 hover:underline mr-4">Edit</button>
                  <a href="#" className="font-medium text-red-600 hover:underline">Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStaff.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No staff members found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

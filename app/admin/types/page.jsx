'use client';

import React, { useState, useEffect } from 'react';

export default function TypesPage() {
  const [types, setTypes] = useState([]);
  const [newTypeName, setNewTypeName] = useState('');

  // Fetch types
  const fetchTypes = async () => {
    const res = await fetch('/api/types');
    if (res.ok) setTypes(await res.json());
  };

  useEffect(() => { fetchTypes(); }, []);

  // Add type
  const handleAdd = async () => {
    if (!newTypeName.trim()) return;
    const res = await fetch('/api/types', {
      method: 'POST',
      body: JSON.stringify({ name: newTypeName }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.ok) {
      setNewTypeName('');
      fetchTypes();
    }
  };

  // Edit type
  const handleEdit = async (id, name) => {
    const newName = prompt('Enter new type name', name);
    if (!newName) return;
  
    try {
      const res = await fetch(`/api/types?id=${id}`, {  // ← use query param
        method: 'PUT',
        body: JSON.stringify({ name: newName }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (res.ok) {
        fetchTypes();
      } else {
        const err = await res.json();
        alert(`Edit failed: ${err.error}`);
      }
    } catch (error) {
      console.error('Edit type failed:', error);
    }
  };
  

  const handleDelete = async (id) => {
    if (!confirm('Delete this type?')) return;
    const res = await fetch(`/api/types?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchTypes();
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Material Types</h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          placeholder="New type name"
          className="border px-3 py-2 rounded-md flex-1"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Type
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((t) => (
            <tr key={t.id}>
              <td className="border px-2 py-1">{t.name}</td>
              <td className="border px-2 py-1 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(t.id, t.name)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

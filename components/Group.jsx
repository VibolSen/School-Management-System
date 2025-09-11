"use client";

import { useEffect, useState } from "react";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newGroup, setNewGroup] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState(null);

  // Fetch groups
  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/groups");
      const data = await res.json();
      console.log("Fetched groups:", data); // Debug
      setGroups(Array.isArray(data) ? data : []); // ✅ Ensure it's always an array
    } catch (err) {
      console.error("Error fetching groups:", err);
      setError("Failed to load groups.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Add group
  const addGroup = async () => {
    if (!newGroup.trim()) return;
    try {
      await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroup }),
      });
      setNewGroup("");
      fetchGroups();
    } catch (err) {
      console.error("Error adding group:", err);
      setError("Failed to add group.");
    }
  };

  // Update group
  const updateGroup = async (id) => {
    if (!editName.trim()) return;
    try {
      await fetch(`/api/groups?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      setEditingGroup(null);
      setEditName("");
      fetchGroups();
    } catch (err) {
      console.error("Error updating group:", err);
      setError("Failed to update group.");
    }
  };

  // Delete group
  const deleteGroup = async (id) => {
    try {
      await fetch(`/api/groups?id=${id}`, { method: "DELETE" });
      fetchGroups();
    } catch (err) {
      console.error("Error deleting group:", err);
      setError("Failed to delete group.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Group Management</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add Group */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="Enter new group name"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={addGroup}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Groups List */}
      {loading ? (
        <p>Loading groups...</p>
      ) : Array.isArray(groups) && groups.length > 0 ? (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
            >
              {editingGroup === group.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={() => updateGroup(group.id)}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingGroup(null);
                      setEditName("");
                    }}
                    className="bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{group.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGroup(group.id);
                        setEditName(group.name);
                      }}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGroup(group.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No groups found.</p>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Guest",
    email: "",
    role: { name: "Guest" },
    image: "https://picsum.photos/seed/default/100",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", imageFile: null });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);
        setForm({ name: data.user.name, imageFile: null });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "imageFile") {
      setForm({ ...form, imageFile: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const formData = new FormData();
      formData.append("name", form.name);
      if (form.imageFile) formData.append("image", form.imageFile);

      const res = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
      } else {
        setUser(data.user);
        setSuccess("Profile updated successfully!");
        setEditMode(false);
      }
    } catch (err) {
      setError("Update failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <div className="flex flex-col items-center space-y-4">
        <img
          src={user.image}
          alt={user.name}
          className="h-24 w-24 rounded-full object-cover"
        />

        {editMode ? (
          <div className="w-full space-y-3">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.role?.name}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

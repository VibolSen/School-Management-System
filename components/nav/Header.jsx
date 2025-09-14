"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [user, setUser] = useState({
    name: "Guest",
    role: "Guest",
    image: "/illustration/default.jpg", // fallback image in public/profile
  });

  const router = useRouter();

  // Update date every minute
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString(undefined, options));
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return;

        const data = await res.json();
        setUser({
          name: data.user.name || "Guest",
          role: data.user.role?.name || "Guest",
          image: data.user.image
            ? data.user.image.startsWith("/profile")
              ? data.user.image
              : `/profile/${data.user.image}`
            : "/illustration/default.jpg", // fallback
        });
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-slate-500 hover:text-slate-700 md:hidden mr-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-slate-500 hidden md:block">{currentDate}</div>

        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
            <img
              className="h-9 w-9 rounded-full object-cover border border-slate-300"
              src={user.image}
              alt={user.name}
              onError={(e) => (e.currentTarget.src = "/profile/default.png")} // fallback if broken
            />
            <div className="hidden md:block text-left">
              <div className="font-semibold text-sm text-slate-700">{user.name}</div>
              <div className="text-xs text-slate-500">{user.role}</div>
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <button
                onClick={() => router.push("/admin/profile")}
                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

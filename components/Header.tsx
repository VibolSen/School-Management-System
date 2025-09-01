"use client";

import React, { useState } from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // roleDropdownOpen was declared but not used in the original JS, so it's kept but commented out
  // const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-slate-500 hover:text-slate-700 md:hidden mr-4"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
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
        <button className="relative text-slate-500 hover:text-slate-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2"
          >
            <img
              className="h-9 w-9 rounded-full object-cover"
              src="https://picsum.photos/seed/default/100"
              alt="User"
            />
            <div className="hidden md:block text-left">
              <div className="font-semibold text-sm text-slate-700">
                John Doe
              </div>
              <div className="text-xs text-slate-500">Guest</div>
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

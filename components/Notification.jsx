// Notification.jsx
"use client";

export default function Notification({ show, message, type, onClose }) {
  if (!show) return null;

  const bgColor =
    type === "error" ? "bg-red-500" : type === "success" ? "bg-green-500" : "bg-blue-500";

  return (
    <div className={`fixed top-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white ${bgColor} animate-slide-in`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button className="ml-3 font-bold" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}

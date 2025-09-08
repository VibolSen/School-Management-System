"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  BookOpen,
  Star,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(
          "Welcome to our learning community! Registration successful!"
        );

        // Clear form
        setForm({ name: "", email: "", password: "", confirmPassword: "" });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-4">
          <div className="space-y-3 text-slate-700 w-full flex flex-col items-center">
            <h2 className="text-3xl font-bold text-balance max-w-md">
              Welcome to Your Educational Journey!
            </h2>
            <p className="text-lg text-slate-600 text-pretty max-w-md">
              Join thousands of students who are already transforming their
              future through quality education.
            </p>
          </div>
          <div className="relative flex justify-center">
            <img
              src="/illustration/signUp.png"
              alt="Students learning together"
              className="w-80 h-80 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-sm mx-auto lg:mx-0">
          {/* Registration Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl shadow-lg p-6">
            {/* Status Messages */}
            {error && (
              <div className="bg-red-100 border border-red-200 text-red-700 px-3 py-2 rounded-md mb-4 text-xs">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-200 text-green-700 px-3 py-2 rounded-md mb-4 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
                <span className="text-green-600 text-xs">
                  Redirecting to login...
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="w-full bg-white border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1.5 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-500 text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-2.5 px-3 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-1.5 text-sm ${
                  loading || success
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Success!
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3.5 h-3.5" />
                    Register
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Features - Mobile Only */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center lg:hidden">
            <div className="text-gray-600">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                <Users className="w-3 h-3 text-indigo-600" />
              </div>
              <p className="text-xs">Join 10k+ Students</p>
            </div>
            <div className="text-gray-600">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                <BookOpen className="w-3 h-3 text-indigo-600" />
              </div>
              <p className="text-xs">Expert Teachers</p>
            </div>
            <div className="text-gray-600">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-1.5">
                <Star className="w-3 h-3 text-indigo-600" />
              </div>
              <p className="text-xs">Top Rated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

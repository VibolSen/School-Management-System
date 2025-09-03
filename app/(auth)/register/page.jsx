"use client";

import { useState } from "react";
import { GraduationCap, Users, BookOpen, Star } from "lucide-react";

export default function RegisterPage() {
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
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      setError("Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative">
            <img
              src="/friendly-school-illustration-with-students-learnin.jpg"
              alt="Students learning together"
              className="w-96 h-96 object-contain drop-shadow-2xl"
            />
          </div>
          <div className="space-y-4 text-slate-700">
            <h2 className="text-4xl font-bold text-balance">
              Welcome to Your Educational Journey!
            </h2>
            <p className="text-xl text-slate-600 text-pretty max-w-md">
              Join thousands of students who are already transforming their
              future through quality education.
            </p>
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">10k+</div>
                <div className="text-sm text-slate-500">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">500+</div>
                <div className="text-sm text-slate-500">Expert Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">4.9★</div>
                <div className="text-sm text-slate-500">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2 text-balance">
              Join Our Learning Community!
            </h1>
            <p className="text-slate-600 text-pretty">
              Start your educational journey with us today
            </p>
          </div>

          {/* Registration Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl shadow-xl p-8">
            {/* Status Messages */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-accent/10 border border-accent/20 text-accent px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                <Star className="w-4 h-4" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full bg-input border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-card-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email address"
                  className="w-full bg-input border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-card-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full bg-input border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-card-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  className="w-full bg-input border border-border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-card-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    Join Our Community
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Features - Mobile Only */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center lg:hidden">
            <div className="text-slate-600">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs">Join 10k+ Students</p>
            </div>
            <div className="text-slate-600">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs">Expert Teachers</p>
            </div>
            <div className="text-slate-600">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-xs">Top Rated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

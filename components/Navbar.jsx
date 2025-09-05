import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / Title */}
        <div className="text-2xl font-bold">
          <Link href="/">University Management</Link>
        </div>

        {/* Navigation Links */}
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

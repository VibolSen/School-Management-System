import Link from "next/link";


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-2 ring-primary/30">
            <img
              src="/logo/STEP.jpg"
              alt="STEP Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-black text-3xl tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
            STEP
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/courses" className="hover:text-foreground transition-colors">Courses</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="space-x-4 flex items-center">
          <Link
            href="/login"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

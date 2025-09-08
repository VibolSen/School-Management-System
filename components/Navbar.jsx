import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-xl text-foreground">VSKILL</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Home
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Courses
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            About
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Contact
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="px-3 py-1.5 text-sm bg-transparent hover:bg-accent rounded-md">
            Log In
          </button>
          <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}

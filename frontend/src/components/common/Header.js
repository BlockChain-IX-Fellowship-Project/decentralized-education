// Header Component
import { Link, useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">De-Education</h1>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Courses
            </a>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

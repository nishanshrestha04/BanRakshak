import React from "react";
import { TreePine, Home, BarChart3, FileText, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-[#1B4332] text-white  shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between h-20 ">
                    {/* Logo and Title */}
                    <Link
                        to="/"
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300"
                    >
                        <TreePine className="h-10 w-10 text-[#95D5B2]" />
                        <h1 className="text-4xl font-bold font-amita">
                            वन रक्षक
                        </h1>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        <Link
                            to="/"
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                isActive("/")
                                    ? "bg-[#2D6A4F]"
                                    : "hover:bg-[#2D6A4F]"
                            }`}
                        >
                            <Home className="h-5 w-5" />
                            <span className="text-lg">Home</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                isActive("/dashboard")
                                    ? "bg-[#2D6A4F]"
                                    : "hover:bg-[#2D6A4F]"
                            }`}
                        >
                            <BarChart3 className="h-5 w-5" />
                            <span className="text-lg">Dashboard</span>
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 rounded-lg hover:bg-[#2D6A4F] transition-all duration-300">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;

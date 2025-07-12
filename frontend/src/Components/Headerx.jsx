import React, { useState } from "react";
import { TreePine, Home, BarChart3, X, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;
    const isDashboardPage = ["/dashboard", "/analytics", "/alerts"].includes(
        location.pathname
    );

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Only render header on home page
    if (location.pathname !== "/") {
        return null;
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 text-white shadow-lg ${
                location.pathname === "/"
                    ? "bg-transparent backdrop-blur-md"
                    : "bg-[#1B4332]"
            }`}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between h-20">
                    {/* Logo and Title */}
                    <Link
                        to="/"
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300"
                        onClick={closeMobileMenu}
                    >
                        <TreePine className="h-10 w-10 text-[#95D5B2]" />
                        <h1 className="text-4xl font-bold font-amita">
                            वन रक्षक
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        <Link
                            to="/"
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                isActive("/")
                                    ? "bg-[#22C55E]/20 text-[#22C55E]"
                                    : "hover:bg-white/10"
                            }`}
                        >
                            <Home className="h-5 w-5" />
                            <span className="text-lg">Home</span>
                        </Link>
                        <Link
                            to="/dashboard"
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                isDashboardPage
                                    ? "bg-[#22C55E]/20 text-[#22C55E]"
                                    : "hover:bg-white/10"
                            }`}
                        >
                            <BarChart3 className="h-5 w-5" />
                            <span className="text-lg">Dashboard</span>
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-white/20">
                        <nav className="flex flex-col space-y-2 pt-4">
                            <Link
                                to="/"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                    isActive("/")
                                        ? "bg-[#22C55E]/20 text-[#22C55E]"
                                        : "hover:bg-white/10"
                                }`}
                                onClick={closeMobileMenu}
                            >
                                <Home className="h-5 w-5" />
                                <span className="text-lg">Home</span>
                            </Link>
                            <Link
                                to="/dashboard"
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                                    isDashboardPage
                                        ? "bg-[#22C55E]/20 text-[#22C55E]"
                                        : "hover:bg-white/10"
                                }`}
                                onClick={closeMobileMenu}
                            >
                                <BarChart3 className="h-5 w-5" />
                                <span className="text-lg">Dashboard</span>
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

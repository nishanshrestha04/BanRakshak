import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    BarChart3,
    FileText,
    Settings,
    TreePine,
    Shield,
    Bell,
    Users,
    MapPin,
    Activity,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navigationItems = [
        { path: "/overview", icon: Home, label: "Overview" },
        { path: "/analytics", icon: Activity, label: "Analytics" },
        { path: "/alerts", icon: Bell, label: "Alerts" },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-[104px] h-[calc(100vh-104px)] w-64 bg-[#1B4332] text-white z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:static md:z-auto flex flex-col`}
            >
                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto mt-6 px-4">
                    <div className="space-y-2">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() =>
                                        window.innerWidth < 768 &&
                                        toggleSidebar()
                                    }
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        isActive(item.path)
                                            ? "bg-[#2D6A4F] text-[#95D5B2] shadow-md"
                                            : "text-gray-300 hover:bg-[#2D6A4F] hover:text-white"
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Status Section */}
                {/* <div className="flex-shrink-0 p-4 border-t border-[#2D6A4F]">
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                        <Shield className="h-4 w-4 text-[#95D5B2]" />
                        <span>System Active</span>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default Sidebar;

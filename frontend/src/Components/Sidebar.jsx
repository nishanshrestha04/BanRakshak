import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Bell, Activity, TreePine } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navigationItems = [
        { path: "/dashboard", icon: Home, label: "Dashboard" },
        { path: "/analytics", icon: Activity, label: "Analytics" },
        { path: "/alerts", icon: Bell, label: "Alerts" },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 z-30"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-[104px] h-screen w-64 bg-white text-gray-800 z-40 transform transition-transform duration-300 ease-in-out shadow-lg ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:static md:z-auto flex flex-col border-r border-gray-200`}
            >
                {/* Logo Section */}
                <Link
                    to="/"
                    onClick={() => window.innerWidth < 768 && toggleSidebar()}
                    className="block p-6 border-b border-gray-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 group"
                >
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <TreePine className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 font-amita group-hover:text-green-600 transition-colors duration-300">
                                वन रक्षक
                            </h2>
                        </div>
                    </div>
                </Link>

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
                                            ? "bg-[#22C55E]/20 text-[#22C55E]"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
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
            </div>
        </>
    );
};

export default Sidebar;

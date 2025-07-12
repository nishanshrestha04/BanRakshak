import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Components/Sidebar";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 pt-[104px]">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <div className="md:hidden bg-white shadow-sm p-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6">
                            Dashboard
                        </h1>
                        {/* Add your dashboard content here */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import StatsCards from "../Components/Analytics/StatsCards";
import MonthlyChart from "../Components/Analytics/MonthlyChart";
import SoundDetectionChart from "../Components/Analytics/SoundDetectionChart";
import RecentAlerts from "../Components/Analytics/RecentAlerts";
import ActivityHeatmap from "../Components/Analytics/ActivityHeatmap";

const Analytics = () => {
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
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Forest monitoring insights and trends
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <StatsCards />

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <MonthlyChart />
                            <SoundDetectionChart />
                        </div>

                        {/* Recent Alerts Section */}
                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <RecentAlerts />
                        </div>

                        {/* Activity Map Section */}
                        <ActivityHeatmap />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Analytics;

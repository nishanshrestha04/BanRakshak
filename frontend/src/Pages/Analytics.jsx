import React, { useState, useEffect } from "react";
import { Menu, Wifi, WifiOff } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import StatsCards from "../Components/Analytics/StatsCards";
import MonthlyChart from "../Components/Analytics/MonthlyChart";
import SoundDetectionChart from "../Components/Analytics/SoundDetectionChart";
import RecentAlerts from "../Components/Analytics/RecentAlerts";
import useWebSocket from "../hooks/useWebSocket";

const Analytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [realTimeData, setRealTimeData] = useState(null);

    // WebSocket connection for real-time analytics data
    const {
        data: wsData,
        isConnected,
        error,
    } = useWebSocket("ws://localhost:8080/ws/analytics", {
        maxReconnectAttempts: 5,
        reconnectDelay: 3000,
    });

    useEffect(() => {
        if (wsData) {
            setRealTimeData(wsData);
        }
    }, [wsData]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50">
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
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                        Analytics Dashboard
                                    </h1>
                                    <p className="text-gray-600">
                                        Forest monitoring insights and trends
                                    </p>
                                </div>

                                {/* Connection Status */}
                                <div className="flex items-center space-x-2">
                                    {isConnected ? (
                                        <Wifi className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <WifiOff className="h-5 w-5 text-red-500" />
                                    )}
                                    <span
                                        className={`text-sm font-medium ${
                                            isConnected
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {isConnected
                                            ? "Live Data"
                                            : "Disconnected"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <StatsCards realTimeData={realTimeData} />

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <MonthlyChart realTimeData={realTimeData} />
                            <SoundDetectionChart realTimeData={realTimeData} />
                        </div>

                        {/* Recent Alerts Section */}
                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <RecentAlerts realTimeData={realTimeData} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Analytics;

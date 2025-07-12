import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import AlertsOverview from "../Components/Alerts/AlertsOverview";
import AlertsTable from "../Components/Alerts/AlertsTable";
import AlertsMap from "../Components/Alerts/AlertsMap";
import AlertFilters from "../Components/Alerts/AlertFilters";

const Alerts = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({
        severity: "all",
        timeRange: "24h",
        zone: "all",
        soundType: "all",
        search: "",
    });

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
                                Alerts Management
                            </h1>
                            <p className="text-gray-600">
                                Monitor and manage forest security alerts in
                                real-time
                            </p>
                        </div>

                        {/* Alert Filters */}
                        <AlertFilters
                            filters={filters}
                            setFilters={setFilters}
                        />

                        {/* Alerts Overview Cards */}
                        <AlertsOverview />

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Alerts Table */}
                            <div className="lg:col-span-2">
                                <AlertsTable filters={filters} />
                            </div>

                            {/* Alerts Map */}
                            <AlertsMap />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Alerts;

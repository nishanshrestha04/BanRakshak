import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import AlertsMap from "../Components/Alerts/AlertsMap";
import AlertFilters from "../Components/Alerts/AlertFilters";
import AlertsTable from "../Components/Alerts/AlertsTable";
import useWebSocket from "../hooks/useWebSocket";
import { analyticsService } from "../services/analyticsService";

const Alerts = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications] = useState(true);
    const [filters, setFilters] = useState({
        severity: "all",
        status: "all",
        search: "",
    });

    // WebSocket connection for real-time updates
    const { data: wsData } = useWebSocket("ws://localhost:8080/ws/alerts", {
        maxReconnectAttempts: 5,
        reconnectDelay: 3000,
    });

    const showNotification = (alert) => {
        if (Notification.permission === "granted") {
            new Notification(`High Priority Alert: ${alert.type}`, {
                body: `Location: ${alert.location} - ${alert.description}`,
                icon: "/alert-icon.png",
            });
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await analyticsService.getAllAlerts();
                setAlerts(data);
            } catch (error) {
                console.error("Error loading alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    useEffect(() => {
        if (wsData) {
            if (wsData.type === "new_alert") {
                const newAlert = wsData.payload;
                setAlerts((prev) => [newAlert, ...prev]);

                // Show notification for new alert
                if (notifications && newAlert.severity === "high") {
                    showNotification(newAlert);
                }
            } else if (wsData.type === "alert_update") {
                const updatedAlert = wsData.payload;
                setAlerts((prev) =>
                    prev.map((alert) =>
                        alert.id === updatedAlert.id ? updatedAlert : alert
                    )
                );
            } else if (wsData.type === "alerts_batch") {
                setAlerts(wsData.payload);
            }
        }
    }, [wsData, notifications]);

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4332] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading alerts...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6 max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                Forest Alerts
                            </h1>
                            <p className="text-gray-600">
                                Real-time monitoring and incident management
                            </p>
                        </div>

                        {/* Filters */}
                        <AlertFilters
                            filters={filters}
                            setFilters={setFilters}
                        />

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Map */}
                            <div className="lg:col-span-2">
                                <AlertsMap alerts={alerts} />
                            </div>

                            {/* Quick Stats or Recent Activity */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Alert Summary
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            Today
                                        </span>
                                        <span className="text-sm font-medium text-gray-800">
                                            {
                                                alerts.filter((alert) => {
                                                    const today =
                                                        new Date().toDateString();
                                                    const alertDate = new Date(
                                                        alert.timestamp ||
                                                            Date.now()
                                                    ).toDateString();
                                                    return today === alertDate;
                                                }).length
                                            }{" "}
                                            alerts
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            This week
                                        </span>
                                        <span className="text-sm font-medium text-gray-800">
                                            {
                                                alerts.filter((alert) => {
                                                    const weekAgo = new Date(
                                                        Date.now() -
                                                            7 *
                                                                24 *
                                                                60 *
                                                                60 *
                                                                1000
                                                    );
                                                    const alertDate = new Date(
                                                        alert.timestamp ||
                                                            Date.now()
                                                    );
                                                    return alertDate >= weekAgo;
                                                }).length
                                            }{" "}
                                            alerts
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            This month
                                        </span>
                                        <span className="text-sm font-medium text-gray-800">
                                            {alerts.length} alerts
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600 mb-2">
                                            Most Active Zone
                                        </div>
                                        <div className="text-lg font-bold text-red-600">
                                            Zone A-3
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {
                                                alerts.filter((alert) =>
                                                    alert.location?.includes(
                                                        "Zone A"
                                                    )
                                                ).length
                                            }{" "}
                                            alerts today
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Alerts Table */}
                        <AlertsTable filters={filters} alerts={alerts} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Alerts;

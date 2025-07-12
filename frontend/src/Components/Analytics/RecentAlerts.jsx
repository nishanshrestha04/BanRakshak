import React, { useState, useEffect } from "react";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { analyticsService } from "../../services/analyticsService";

const RecentAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await analyticsService.getRecentAlerts();
                setAlerts(data);
            } catch (error) {
                console.error("Error loading recent alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();

        // Subscribe to real-time updates
        const unsubscribe = analyticsService.subscribe((data) => {
            if (data.type === "recent_alerts") {
                setAlerts(data.payload);
                setIsConnected(true);
            } else if (data.type === "new_alert") {
                // Add new alert to the beginning of the list
                setAlerts((prev) => [data.payload, ...prev].slice(0, 10));
                setIsConnected(true);
            } else if (data.type === "connection") {
                setIsConnected(data.connected);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Recent Alerts
                </h3>
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 relative">
            {/* Real-time indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                {isConnected ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span
                    className={`text-xs ${
                        isConnected ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {isConnected ? "Live" : "Offline"}
                </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Alerts
            </h3>

            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-3">
                    Alert Severity
                </h4>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm text-gray-600">
                            High Priority
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-gray-600">
                            Medium Priority
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-gray-600">
                            Low Priority
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-300 ${
                                index === 0 && isConnected
                                    ? "ring-2 ring-green-200 bg-green-50"
                                    : ""
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        alert.severity === "High" ||
                                        alert.severity === "high"
                                            ? "bg-red-500"
                                            : alert.severity === "Medium" ||
                                              alert.severity === "medium"
                                            ? "bg-orange-500"
                                            : "bg-yellow-500"
                                    }`}
                                ></div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {alert.type || alert.sound_type}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {alert.location || alert.zone}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">
                                {alert.time || alert.timestamp}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No recent alerts available
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentAlerts;

import React, { useMemo, useState, useEffect } from "react";
import { Play, Eye, MoreVertical, Volume2, Wifi, WifiOff } from "lucide-react";
import useWebSocket from "../../hooks/useWebSocket";
import PayloadTable from "./PayloadTable";

const AlertsTable = ({ filters, alerts = [], payloadData = [] }) => {
    const [loading, setLoading] = useState(false);

    // WebSocket connection for real-time updates
    const {
        data: wsData,
        isConnected,
        error,
    } = useWebSocket("ws://localhost:8080/ws/alerts", {
        maxReconnectAttempts: 5,
        reconnectDelay: 3000,
    });

    // Transform alerts to match table structure
    const transformedAlerts = useMemo(() => {
        return alerts.map((alert, index) => ({
            id: alert.id || `ALT-${String(index + 1).padStart(3, "0")}`,
            time: alert.time || "Just now",
            date: alert.date || new Date().toLocaleDateString(),
            timestamp:
                alert.timestamp || new Date(Date.now() - index * 60 * 1000),
            type: alert.type || "Unknown",
            location:
                alert.location ||
                `Lat: ${alert.latitude?.toFixed(4) || "N/A"}, Lng: ${
                    alert.longitude?.toFixed(4) || "N/A"
                }`,
            zone: alert.location?.split(" ")[0]?.replace("Zone ", "") || "A",
            severity:
                alert.severity?.charAt(0).toUpperCase() +
                    alert.severity?.slice(1) || "Medium",
            confidence: alert.confidence || Math.floor(Math.random() * 30) + 70,
            status:
                alert.status?.charAt(0).toUpperCase() +
                    alert.status?.slice(1) || "Active",
            speed: alert.speed || 0,
            coordinates: `${alert.latitude?.toFixed(4) || "N/A"}, ${
                alert.longitude?.toFixed(4) || "N/A"
            }`,
            audioUrl: "#",
        }));
    }, [alerts]);

    const getTimeRangeFilter = (timeRange) => {
        const now = new Date();
        switch (timeRange) {
            case "1h":
                return new Date(now.getTime() - 60 * 60 * 1000);
            case "24h":
                return new Date(now.getTime() - 24 * 60 * 60 * 1000);
            case "7d":
                return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case "30d":
                return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            default:
                return new Date(0);
        }
    };

    const filteredAlerts = useMemo(() => {
        return transformedAlerts.filter((alert) => {
            // Search filter
            if (
                filters.search &&
                !alert.type
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) &&
                !alert.location
                    .toLowerCase()
                    .includes(filters.search.toLowerCase())
            ) {
                return false;
            }

            // Severity filter
            if (
                filters.severity !== "all" &&
                alert.severity.toLowerCase() !== filters.severity
            ) {
                return false;
            }

            // Status filter
            if (
                filters.status !== "all" &&
                alert.status.toLowerCase() !== filters.status
            ) {
                return false;
            }

            // Time range filter
            if (filters.timeRange) {
                const timeThreshold = getTimeRangeFilter(filters.timeRange);
                if (alert.timestamp < timeThreshold) {
                    return false;
                }
            }

            // Zone filter
            if (filters.zone !== "all" && alert.zone !== filters.zone) {
                return false;
            }

            // Sound type filter
            if (filters.soundType !== "all") {
                const soundTypeMap = {
                    chainsaw: "Chainsaw",
                    machinery: "Heavy Machinery",
                    vehicle: "Vehicle",
                    gunshot: "Gunshot",
                };
                if (alert.type !== soundTypeMap[filters.soundType]) {
                    return false;
                }
            }

            return true;
        });
    }, [transformedAlerts, filters]);

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "High":
                return "bg-red-100 text-red-800";
            case "Medium":
                return "bg-orange-100 text-orange-800";
            case "Low":
                return "bg-yellow-100 text-yellow-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-red-100 text-red-800";
            case "Investigating":
                return "bg-blue-100 text-blue-800";
            case "Resolved":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            {/* Raw Payload Data Table */}
            <PayloadTable payloadData={payloadData} />

            {/* Processed Alerts Table */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Recent Alerts
                        </h3>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                {isConnected ? (
                                    <Wifi className="h-4 w-4 text-green-500" />
                                ) : (
                                    <WifiOff className="h-4 w-4 text-red-500" />
                                )}
                                <span
                                    className={`text-xs ${
                                        isConnected
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {isConnected ? "Live" : "Offline"}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">
                                {filteredAlerts.length} of{" "}
                                {transformedAlerts.length} alerts
                            </span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredAlerts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p className="text-lg">No alerts found</p>
                            <p className="text-sm">
                                Try adjusting your filters
                            </p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Alert ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Severity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Confidence
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAlerts.map((alert) => (
                                    <tr
                                        key={alert.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {alert.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {alert.time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {alert.type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {alert.location}
                                            <br />
                                            <span className="text-xs text-gray-400">
                                                {alert.coordinates}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(
                                                    alert.severity
                                                )}`}
                                            >
                                                {alert.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {alert.confidence}%
                                            {alert.speed > 0 && (
                                                <>
                                                    <br />
                                                    <span className="text-xs text-gray-400">
                                                        {alert.speed} km/h
                                                    </span>
                                                </>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                    alert.status
                                                )}`}
                                            >
                                                {alert.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Play Audio"
                                                >
                                                    <Volume2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className="text-green-600 hover:text-green-800"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    className="text-gray-600 hover:text-gray-800"
                                                    title="More Options"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertsTable;

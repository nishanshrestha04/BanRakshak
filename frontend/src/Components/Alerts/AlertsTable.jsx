import React, { useMemo } from "react";
import { Play, Eye, MoreVertical, Volume2 } from "lucide-react";

const AlertsTable = ({ filters }) => {
    const alertsData = [
        {
            id: "ALT-001",
            time: "2 minutes ago",
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            type: "Chainsaw",
            location: "Zone A-1",
            zone: "A",
            severity: "High",
            confidence: 96,
            status: "Active",
            audioUrl: "#",
        },
        {
            id: "ALT-002",
            time: "15 minutes ago",
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            type: "Heavy Machinery",
            location: "Zone B-3",
            zone: "B",
            severity: "Medium",
            confidence: 87,
            status: "Investigating",
            audioUrl: "#",
        },
        {
            id: "ALT-003",
            time: "1 hour ago",
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            type: "Vehicle",
            location: "Zone C-2",
            zone: "C",
            severity: "Low",
            confidence: 74,
            status: "Resolved",
            audioUrl: "#",
        },
        {
            id: "ALT-004",
            time: "2 hours ago",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            type: "Gunshot",
            location: "Zone A-4",
            zone: "A",
            severity: "High",
            confidence: 91,
            status: "Active",
            audioUrl: "#",
        },
        {
            id: "ALT-005",
            time: "3 hours ago",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            type: "Chainsaw",
            location: "Zone B-1",
            zone: "B",
            severity: "High",
            confidence: 93,
            status: "Resolved",
            audioUrl: "#",
        },
        {
            id: "ALT-006",
            time: "6 hours ago",
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
            type: "Heavy Machinery",
            location: "Zone C-4",
            zone: "C",
            severity: "Medium",
            confidence: 82,
            status: "Investigating",
            audioUrl: "#",
        },
        {
            id: "ALT-007",
            time: "1 day ago",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            type: "Vehicle",
            location: "Zone A-2",
            zone: "A",
            severity: "Low",
            confidence: 68,
            status: "Resolved",
            audioUrl: "#",
        },
        {
            id: "ALT-008",
            time: "2 days ago",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            type: "Chainsaw",
            location: "Zone B-2",
            zone: "B",
            severity: "High",
            confidence: 94,
            status: "Resolved",
            audioUrl: "#",
        },
    ];

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
        return alertsData.filter((alert) => {
            // Severity filter
            if (
                filters.severity !== "all" &&
                alert.severity.toLowerCase() !== filters.severity
            ) {
                return false;
            }

            // Time range filter
            const timeThreshold = getTimeRangeFilter(filters.timeRange);
            if (alert.timestamp < timeThreshold) {
                return false;
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
    }, [filters]);

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
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Recent Alerts
                    </h3>
                    <span className="text-sm text-gray-500">
                        {filteredAlerts.length} of {alertsData.length} alerts
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                {filteredAlerts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p className="text-lg">No alerts found</p>
                        <p className="text-sm">Try adjusting your filters</p>
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
                                <tr key={alert.id} className="hover:bg-gray-50">
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
    );
};

export default AlertsTable;

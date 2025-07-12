import React from "react";

const RecentAlerts = () => {
    const recentAlerts = [
        {
            time: "2 hours ago",
            type: "Chainsaw",
            location: "Zone A-1",
            severity: "High",
        },
        {
            time: "5 hours ago",
            type: "Heavy Machinery",
            location: "Zone B-3",
            severity: "Medium",
        },
        {
            time: "1 day ago",
            type: "Vehicle",
            location: "Zone C-2",
            severity: "Low",
        },
        {
            time: "2 days ago",
            type: "Chainsaw",
            location: "Zone A-4",
            severity: "High",
        },
        {
            time: "3 days ago",
            type: "Gunshot",
            location: "Zone B-1",
            severity: "High",
        },
        {
            time: "4 days ago",
            type: "Heavy Machinery",
            location: "Zone C-3",
            severity: "Medium",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
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
                {recentAlerts.map((alert, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                        <div className="flex items-center space-x-3">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    alert.severity === "High"
                                        ? "bg-red-500"
                                        : alert.severity === "Medium"
                                        ? "bg-orange-500"
                                        : "bg-yellow-500"
                                }`}
                            ></div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {alert.type}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {alert.location}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">
                            {alert.time}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentAlerts;

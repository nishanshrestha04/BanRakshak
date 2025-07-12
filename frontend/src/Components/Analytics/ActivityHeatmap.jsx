import React from "react";
import { Calendar } from "lucide-react";

const ActivityHeatmap = () => {
    const heatmapData = [
        { zone: "A-1", activity: 85, alerts: 12 },
        { zone: "A-2", activity: 45, alerts: 3 },
        { zone: "A-3", activity: 92, alerts: 18 },
        { zone: "A-4", activity: 67, alerts: 8 },
        { zone: "B-1", activity: 78, alerts: 15 },
        { zone: "B-2", activity: 23, alerts: 2 },
        { zone: "B-3", activity: 89, alerts: 22 },
        { zone: "B-4", activity: 56, alerts: 7 },
        { zone: "C-1", activity: 34, alerts: 4 },
        { zone: "C-2", activity: 71, alerts: 11 },
        { zone: "C-3", activity: 95, alerts: 25 },
        { zone: "C-4", activity: 42, alerts: 5 },
    ];

    const getActivityColor = (activity) => {
        if (activity >= 80) return "bg-red-500";
        if (activity >= 60) return "bg-orange-500";
        if (activity >= 40) return "bg-yellow-500";
        if (activity >= 20) return "bg-green-500";
        return "bg-gray-300";
    };

    const getActivityIntensity = (activity) => {
        if (activity >= 80) return "opacity-100";
        if (activity >= 60) return "opacity-75";
        if (activity >= 40) return "opacity-50";
        if (activity >= 20) return "opacity-25";
        return "opacity-10";
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Activity Heatmap
                </h3>
                <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <select className="text-sm border rounded px-2 py-1">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>Last 24 hours</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Activity Level
                </h4>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gray-300 rounded"></div>
                        <span className="text-xs text-gray-600">
                            Low (0-20)
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-xs text-gray-600">
                            Moderate (20-40)
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span className="text-xs text-gray-600">
                            High (40-60)
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-xs text-gray-600">
                            Very High (60-80)
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-xs text-gray-600">
                            Critical (80+)
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-4 gap-2">
                    {heatmapData.map((zone, index) => (
                        <div
                            key={index}
                            className={`relative p-4 rounded-lg border border-gray-200 cursor-pointer hover:scale-105 transition-transform duration-200 ${getActivityColor(
                                zone.activity
                            )} ${getActivityIntensity(zone.activity)}`}
                            title={`Zone ${zone.zone}: ${zone.activity}% activity, ${zone.alerts} alerts`}
                        >
                            <div className="text-center">
                                <div className="text-white font-semibold text-sm mb-1">
                                    Zone {zone.zone}
                                </div>
                                <div className="text-white text-xs">
                                    {zone.activity}% activity
                                </div>
                                <div className="text-white text-xs">
                                    {zone.alerts} alerts
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {
                            heatmapData.filter((zone) => zone.activity >= 80)
                                .length
                        }
                    </div>
                    <div className="text-sm text-gray-600">Critical Zones</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                        {
                            heatmapData.filter(
                                (zone) =>
                                    zone.activity >= 60 && zone.activity < 80
                            ).length
                        }
                    </div>
                    <div className="text-sm text-gray-600">High Activity</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                        {
                            heatmapData.filter(
                                (zone) =>
                                    zone.activity >= 40 && zone.activity < 60
                            ).length
                        }
                    </div>
                    <div className="text-sm text-gray-600">
                        Moderate Activity
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {
                            heatmapData.filter((zone) => zone.activity < 40)
                                .length
                        }
                    </div>
                    <div className="text-sm text-gray-600">Low Activity</div>
                </div>
            </div>
        </div>
    );
};

export default ActivityHeatmap;

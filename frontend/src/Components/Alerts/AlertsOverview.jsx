import React from "react";
import { AlertTriangle, Clock, MapPin, TrendingUp } from "lucide-react";

const AlertsOverview = () => {
    const overviewData = [
        {
            title: "Active Alerts",
            value: "24",
            icon: AlertTriangle,
            iconColor: "text-red-500",
            bgColor: "bg-red-50",
            trend: "+3 from last hour",
            trendColor: "text-red-600",
        },
        {
            title: "Pending Review",
            value: "8",
            icon: Clock,
            iconColor: "text-orange-500",
            bgColor: "bg-orange-50",
            trend: "-2 from yesterday",
            trendColor: "text-green-600",
        },
        {
            title: "Critical Zones",
            value: "5",
            icon: MapPin,
            iconColor: "text-purple-500",
            bgColor: "bg-purple-50",
            trend: "Zone A-3, B-1",
            trendColor: "text-gray-600",
        },
        {
            title: "Response Time",
            value: "4.2m",
            icon: TrendingUp,
            iconColor: "text-blue-500",
            bgColor: "bg-blue-50",
            trend: "-30s improvement",
            trendColor: "text-green-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {overviewData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {item.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {item.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${item.bgColor}`}>
                                <IconComponent
                                    className={`h-6 w-6 ${item.iconColor}`}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className={`text-sm ${item.trendColor}`}>
                                {item.trend}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AlertsOverview;

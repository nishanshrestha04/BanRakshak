import React from "react";
import {
    Activity,
    TrendingUp,
    AlertTriangle,
    Shield,
    BarChart3,
} from "lucide-react";

const StatsCards = () => {
    const statsData = [
        {
            title: "Total Detections",
            value: "1,847",
            icon: Activity,
            iconColor: "text-[#95D5B2]",
            trend: "+12% from last month",
            trendColor: "text-green-500",
            showTrend: true,
        },
        {
            title: "Active Alerts",
            value: "24",
            icon: AlertTriangle,
            iconColor: "text-orange-500",
            trend: "3 high priority",
            trendColor: "text-orange-500",
            showTrend: false,
        },
        {
            title: "Protected Areas",
            value: "156",
            icon: Shield,
            iconColor: "text-[#95D5B2]",
            trend: "98% coverage",
            trendColor: "text-green-500",
            showTrend: false,
        },
        {
            title: "Accuracy Rate",
            value: "94.8%",
            icon: BarChart3,
            iconColor: "text-[#95D5B2]",
            trend: "+2.1% improvement",
            trendColor: "text-green-500",
            showTrend: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-[#1B4332]">
                                    {stat.value}
                                </p>
                            </div>
                            <IconComponent
                                className={`h-8 w-8 ${stat.iconColor}`}
                            />
                        </div>
                        <div className="mt-4 flex items-center">
                            {stat.showTrend && (
                                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            )}
                            <span className={`text-sm ${stat.trendColor}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;

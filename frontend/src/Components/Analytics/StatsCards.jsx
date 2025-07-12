import React, { useState, useEffect } from "react";
import {
    Activity,
    TrendingUp,
    AlertTriangle,
    Shield,
    BarChart3,
    Loader2,
    Wifi,
    WifiOff,
} from "lucide-react";
import { analyticsService } from "../../services/analyticsService";

const StatsCards = () => {
    const [stats, setStats] = useState({
        totalDetections: 0,
        activeAlerts: 0,
        protectedAreas: 156,
        accuracyRate: 94.8,
        detectionTrend: 12,
        alertTrend: 0,
        highPriorityAlerts: 0,
        coveragePercentage: 98,
        accuracyImprovement: 2.1,
    });
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await analyticsService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Error loading stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();

        // Subscribe to real-time updates
        const unsubscribe = analyticsService.subscribe((data) => {
            if (data.type === "stats") {
                setStats(data.payload);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ))}
            </div>
        );
    }

    const statsData = [
        {
            title: "Total Detections",
            value: stats?.totalDetections?.toLocaleString() || "0",
            icon: Activity,
            iconColor: "text-[#95D5B2]",
            trend: `${stats?.detectionTrend > 0 ? "+" : ""}${
                stats?.detectionTrend || 0
            }% from last month`,
            trendColor:
                stats?.detectionTrend >= 0 ? "text-green-500" : "text-red-500",
            showTrend: true,
        },
        {
            title: "Active Alerts",
            value: stats?.activeAlerts?.toString() || "0",
            icon: AlertTriangle,
            iconColor: "text-orange-500",
            trend: `${stats?.highPriorityAlerts || 0} high priority`,
            trendColor: "text-orange-500",
            showTrend: false,
        },
        {
            title: "Protected Areas",
            value: stats?.protectedAreas?.toString() || "0",
            icon: Shield,
            iconColor: "text-[#95D5B2]",
            trend: `${stats?.coveragePercentage || 0}% coverage`,
            trendColor: "text-green-500",
            showTrend: false,
        },
        {
            title: "Accuracy Rate",
            value: `${stats?.accuracyRate || 0}%`,
            icon: BarChart3,
            iconColor: "text-[#95D5B2]",
            trend: `${stats?.accuracyImprovement > 0 ? "+" : ""}${
                stats?.accuracyImprovement || 0
            }% improvement`,
            trendColor:
                stats?.accuracyImprovement >= 0
                    ? "text-green-500"
                    : "text-red-500",
            showTrend: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Connection Status Indicator */}
            <div className="lg:col-span-4 flex justify-end mb-2">
                <div className="flex items-center space-x-2">
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
                        {isConnected ? "Live" : "Disconnected"}
                    </span>
                </div>
            </div>

            {statsData.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 relative"
                    >
                        {/* Real-time indicator */}
                        {isConnected && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}

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

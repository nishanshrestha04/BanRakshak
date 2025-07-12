import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, MapPin, TrendingUp } from "lucide-react";
import useWebSocket from "../../hooks/useWebSocket";
import { analyticsService } from "../../services/analyticsService";

const AlertsOverview = ({ onDataUpdate }) => {
    const [overviewData, setOverviewData] = useState([
        {
            title: "Active Alerts",
            value: "0",
            icon: AlertTriangle,
            iconColor: "text-red-500",
            bgColor: "bg-red-50",
            trend: "Loading...",
            trendColor: "text-gray-600",
        },
        {
            title: "Pending Review",
            value: "0",
            icon: Clock,
            iconColor: "text-orange-500",
            bgColor: "bg-orange-50",
            trend: "Loading...",
            trendColor: "text-gray-600",
        },
        {
            title: "Critical Zones",
            value: "0",
            icon: MapPin,
            iconColor: "text-purple-500",
            bgColor: "bg-purple-50",
            trend: "Loading...",
            trendColor: "text-gray-600",
        },
        {
            title: "Response Time",
            value: "0m",
            icon: TrendingUp,
            iconColor: "text-blue-500",
            bgColor: "bg-blue-50",
            trend: "Loading...",
            trendColor: "text-gray-600",
        },
    ]);

    const [processedAlerts, setProcessedAlerts] = useState([]);

    // WebSocket connection for real-time updates
    const { data: wsData, isConnected } = useWebSocket(
        "ws://localhost:8080/ws/alerts",
        {
            maxReconnectAttempts: 5,
            reconnectDelay: 3000,
        }
    );

    // Transform payload data to alert format
    const transformPayloadToAlert = (payload) => {
        const alerts = [];

        if (payload.class && payload.confidence) {
            payload.class.forEach((detectedClass, index) => {
                const confidence = payload.confidence[index] || 0;

                // Only create alert if confidence is above threshold
                if (confidence > 0.5) {
                    const severity =
                        confidence > 0.8
                            ? "high"
                            : confidence > 0.6
                            ? "medium"
                            : "low";
                    const status =
                        confidence > 0.8 ? "active" : "investigating";

                    alerts.push({
                        id: `ALT-${Date.now()}-${index}`,
                        time: payload.time || new Date().toLocaleTimeString(),
                        date: payload.date || new Date().toLocaleDateString(),
                        timestamp: new Date(
                            `${payload.date} ${payload.time}` || Date.now()
                        ),
                        type: detectedClass,
                        location: `Zone ${String.fromCharCode(
                            65 + Math.floor(Math.random() * 3)
                        )}-${Math.floor(Math.random() * 5) + 1}`,
                        latitude: parseFloat(payload.latitude) || 27.7172,
                        longitude: parseFloat(payload.longitude) || 85.324,
                        speed: parseFloat(payload.speed) || 0,
                        severity: severity,
                        confidence: Math.round(confidence * 100),
                        status: status,
                        rawPayload: payload,
                    });
                }
            });
        }

        return alerts;
    };

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                const alerts = await analyticsService.getAllAlerts();
                updateOverviewWithAlerts(alerts);
            } catch (error) {
                console.error("Error loading overview data:", error);
            }
        };

        fetchOverviewData();
    }, []);

    // Handle WebSocket updates
    useEffect(() => {
        if (wsData) {
            // Transform real-time payload data
            const newAlerts = transformPayloadToAlert(wsData);
            if (newAlerts.length > 0) {
                setProcessedAlerts((prev) => [...prev, ...newAlerts]);
                updateOverviewWithAlerts([...processedAlerts, ...newAlerts]);

                // Pass data to parent component
                if (onDataUpdate) {
                    onDataUpdate([...processedAlerts, ...newAlerts]);
                }
            }
        }
    }, [wsData, processedAlerts]);

    const updateOverviewWithAlerts = (alerts) => {
        const activeAlerts = alerts.filter(
            (alert) => alert.status === "active"
        ).length;
        const pendingReview = alerts.filter(
            (alert) => alert.status === "investigating"
        ).length;
        const criticalZones = [
            ...new Set(
                alerts
                    .filter((alert) => alert.severity === "high")
                    .map((alert) => alert.location)
            ),
        ].length;

        // Calculate average response time (mock calculation)
        const avgResponseTime =
            alerts.length > 0
                ? (
                      alerts.reduce(
                          (sum, alert) => sum + alert.confidence / 20,
                          0
                      ) / alerts.length
                  ).toFixed(1)
                : 0;

        setOverviewData([
            {
                title: "Active Alerts",
                value: activeAlerts.toString(),
                icon: AlertTriangle,
                iconColor: "text-red-500",
                bgColor: "bg-red-50",
                trend: `${
                    activeAlerts > 0 ? "+" : ""
                }${activeAlerts} from last hour`,
                trendColor:
                    activeAlerts > 0 ? "text-red-600" : "text-green-600",
            },
            {
                title: "Pending Review",
                value: pendingReview.toString(),
                icon: Clock,
                iconColor: "text-orange-500",
                bgColor: "bg-orange-50",
                trend: `${pendingReview} awaiting review`,
                trendColor: "text-orange-600",
            },
            {
                title: "Critical Zones",
                value: criticalZones.toString(),
                icon: MapPin,
                iconColor: "text-purple-500",
                bgColor: "bg-purple-50",
                trend:
                    criticalZones > 0
                        ? "High activity detected"
                        : "All zones normal",
                trendColor:
                    criticalZones > 0 ? "text-red-600" : "text-green-600",
            },
            {
                title: "Response Time",
                value: `${avgResponseTime}m`,
                icon: TrendingUp,
                iconColor: "text-blue-500",
                bgColor: "bg-blue-50",
                trend: `${
                    avgResponseTime < 5
                        ? "Excellent"
                        : avgResponseTime < 10
                        ? "Good"
                        : "Needs improvement"
                }`,
                trendColor:
                    avgResponseTime < 5
                        ? "text-green-600"
                        : avgResponseTime < 10
                        ? "text-blue-600"
                        : "text-red-600",
            },
        ]);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {overviewData.map((item, index) => {
                const IconComponent = item.icon;
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

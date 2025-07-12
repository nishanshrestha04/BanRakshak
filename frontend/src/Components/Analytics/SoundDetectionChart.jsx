import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { analyticsService } from "../../services/analyticsService";

ChartJS.register(ArcElement, Tooltip, Legend);

const SoundDetectionChart = () => {
    const [soundData, setSoundData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const fetchSoundData = async () => {
            try {
                const data = await analyticsService.getSoundDetectionData();
                setSoundData(data);
            } catch (error) {
                console.error("Error loading sound detection data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSoundData();

        // Subscribe to real-time updates
        const unsubscribe = analyticsService.subscribe((data) => {
            if (data.type === "sound_detection") {
                setSoundData(data.payload);
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
                    Sound Detection
                </h3>
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            </div>
        );
    }

    const soundChartData = {
        labels: Object.keys(soundData),
        datasets: [
            {
                data: Object.values(soundData),
                backgroundColor: [
                    "#FF6B6B",
                    "#4ECDC4",
                    "#45B7D1",
                    "#96CEB4",
                    "#FFEAA7",
                    "#DDA0DD",
                ],
                borderColor: [
                    "#FF5252",
                    "#26A69A",
                    "#2196F3",
                    "#66BB6A",
                    "#FFC107",
                    "#BA68C8",
                ],
                borderWidth: 2,
                hoverBackgroundColor: [
                    "#FF8A80",
                    "#80CBC4",
                    "#81C784",
                    "#AED581",
                    "#FFD54F",
                    "#CE93D8",
                ],
            },
        ],
    };

    const soundChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color: "#64748B",
                    font: { size: 12, weight: 500 },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: "circle",
                },
            },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                titleColor: "white",
                bodyColor: "white",
                borderColor: "rgba(148, 163, 184, 0.2)",
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
            },
        },
    };

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
                Sound Detection
            </h3>
            <div className="h-64">
                {Object.keys(soundData).length > 0 ? (
                    <Pie data={soundChartData} options={soundChartOptions} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No sound detection data available
                    </div>
                )}
            </div>
        </div>
    );
};

export default SoundDetectionChart;

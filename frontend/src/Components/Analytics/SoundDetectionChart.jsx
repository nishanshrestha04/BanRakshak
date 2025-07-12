import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SoundDetectionChart = () => {
    const recentAlerts = [
        { type: "Chainsaw", severity: "High" },
        { type: "Heavy Machinery", severity: "Medium" },
        { type: "Vehicle", severity: "Low" },
        { type: "Chainsaw", severity: "High" },
        { type: "Gunshot", severity: "High" },
        { type: "Heavy Machinery", severity: "Medium" },
    ];

    const soundTypes = recentAlerts.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
    }, {});

    const soundChartData = {
        labels: Object.keys(soundTypes),
        datasets: [
            {
                data: Object.values(soundTypes),
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
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Sound Detection
            </h3>
            <div className="h-64">
                <Pie data={soundChartData} options={soundChartOptions} />
            </div>
        </div>
    );
};

export default SoundDetectionChart;

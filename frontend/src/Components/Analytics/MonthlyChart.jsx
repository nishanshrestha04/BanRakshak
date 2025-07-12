import React from "react";
import { Bar } from "react-chartjs-2";
import { Download } from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const MonthlyChart = () => {
    const monthlyData = [
        { month: "Jan", detections: 100, alerts: 12 },
        { month: "Feb", detections: 52, alerts: 8 },
        { month: "Mar", detections: 38, alerts: 15 },
        { month: "Apr", detections: 61, alerts: 20 },
        { month: "May", detections: 55, alerts: 18 },
        { month: "Jun", detections: 67, alerts: 25 },
    ];

    const chartData = {
        labels: monthlyData.map((data) => data.month),
        datasets: [
            {
                label: "Detections",
                data: monthlyData.map((data) => data.detections),
                backgroundColor: "#95D5B2",
                borderColor: "#74C69D",
                borderWidth: 1,
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: "Alerts",
                data: monthlyData.map((data) => data.alerts),
                backgroundColor: "#2D6A4F",
                borderColor: "#1B4332",
                borderWidth: 1,
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
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
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(148, 163, 184, 0.1)" },
                ticks: { color: "#64748B", font: { size: 12 } },
            },
            x: {
                grid: { display: false },
                ticks: { color: "#64748B", font: { size: 12, weight: 500 } },
            },
        },
        interaction: { intersect: false, mode: "index" },
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Monthly Detections & Alerts
                </h3>
                <button className="text-[#1B4332] hover:text-[#2D6A4F]">
                    <Download className="h-5 w-5" />
                </button>
            </div>

            <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#95D5B2] rounded"></div>
                    <span className="text-sm text-gray-600">Detections</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#2D6A4F] rounded"></div>
                    <span className="text-sm text-gray-600">Alerts</span>
                </div>
            </div>

            <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default MonthlyChart;

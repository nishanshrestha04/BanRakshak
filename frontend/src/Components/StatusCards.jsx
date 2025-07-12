import React from "react";
import { Radio, MicOff, CheckCircle, Volume2 } from "lucide-react";

const StatusCards = ({ isConnected, wsData, detectionCount, currentSound }) => {
    // Function to safely get confidence value
    const getConfidenceValue = () => {
        console.log("wsData in getConfidenceValue:", wsData);

        if (!wsData) {
            console.log("No wsData available");
            return "0%";
        }

        // Check if wsData has a confidence array
        if (wsData.confidence && Array.isArray(wsData.confidence)) {
            console.log("wsData.confidence array:", wsData.confidence);

            // Find the maximum confidence value from the array
            const maxConfidence = Math.max(...wsData.confidence);
            console.log("Max confidence from array:", maxConfidence);

            if (isNaN(maxConfidence)) {
                console.log("Max confidence is NaN");
                return "0%";
            }

            // Use the same formatting logic as PayloadTable
            if (maxConfidence > 100) {
                return `${(maxConfidence / 100).toFixed(2)}%`;
            } else if (maxConfidence > 1) {
                return `${maxConfidence.toFixed(2)}%`;
            } else {
                return `${(maxConfidence * 100).toFixed(2)}%`;
            }
        }

        // Fallback to def_prob if confidence array doesn't exist
        if (wsData.def_prob !== null && wsData.def_prob !== undefined) {
            const confidence = parseFloat(wsData.def_prob);
            if (!isNaN(confidence)) {
                // Use the same formatting logic as PayloadTable
                if (confidence > 100) {
                    return `${(confidence / 100).toFixed(2)}%`;
                } else if (confidence > 1) {
                    return `${confidence.toFixed(2)}%`;
                } else {
                    return `${(confidence * 100).toFixed(2)}%`;
                }
            }
        }

        console.log("No valid confidence data found");
        return "0%";
    };

    const cards = [
        {
            title: "System Status",
            value: isConnected ? "Connected" : "Disconnected",
            icon: isConnected ? Radio : MicOff,
            color: isConnected ? "green" : "red",
            bgColor: isConnected ? "bg-green-50" : "bg-red-50",
            iconColor: isConnected ? "text-green-600" : "text-red-600",
            iconBg: isConnected ? "bg-green-100" : "bg-red-100",
        },
        {
            title: "Detection Confidence",
            value: getConfidenceValue(),
            icon: CheckCircle,
            color: "blue",
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
        },
        {
            title: "Total Detections",
            value: detectionCount,
            icon: Volume2,
            color: "purple",
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            iconBg: "bg-purple-100",
        },
        {
            title: "Current Sound",
            value: currentSound || "None",
            icon: CheckCircle,
            color: "indigo",
            bgColor: "bg-indigo-50",
            iconColor: "text-indigo-600",
            iconBg: "bg-indigo-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className={`${card.bgColor} border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {card.value}
                                </p>
                            </div>
                            <div
                                className={`p-3 rounded-xl ${card.iconBg} shadow-sm`}
                            >
                                <Icon className={`h-6 w-6 ${card.iconColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatusCards;

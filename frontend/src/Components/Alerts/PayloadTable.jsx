import React, { useMemo } from "react";
import { Clock, MapPin, Activity, Database, Target } from "lucide-react";

const PayloadTable = ({ payloadData = [] }) => {
    const displayPayloads = useMemo(() => {
        return payloadData.slice(0, 5).map((payload, index) => {
            console.log(`Processing payload ${index + 1}:`, payload);

            // Safely unpack class and confidence arrays
            const classArray = Array.isArray(payload.class)
                ? payload.class
                : [];
            const confidenceArray = Array.isArray(payload.confidence)
                ? payload.confidence
                : [];

            console.log(`Payload ${index + 1} classes:`, classArray);
            console.log(`Payload ${index + 1} confidences:`, confidenceArray);

            return {
                id: `PAYLOAD-${index + 1}`,
                time: payload.time || "N/A",
                date: payload.date || "N/A",
                latitude: payload.latitude || "N/A",
                longitude: payload.longitude || "N/A",
                speed: payload.speed || "0",
                classes: classArray,
                confidences: confidenceArray,
                isRealtime: payload.isRealtime || false,
                rawData: payload.rawData || null,
                // Create paired data for class-confidence display
                detections: classArray.map((cls, idx) => ({
                    class: cls,
                    confidence: confidenceArray[idx] || 0,
                    hasConfidence: confidenceArray[idx] !== undefined,
                })),
            };
        });
    }, [payloadData]);

    const formatConfidence = (confidence) => {
        const conf = parseFloat(confidence);
        if (isNaN(conf)) return "N/A";

        // The confidence values are already in decimal format (0-1)
        // But they seem to be scaled up, so we need to normalize them
        if (conf > 100) {
            // If confidence is > 100, it's likely scaled up by 10000
            return `${(conf / 100).toFixed(2)}%`;
        } else if (conf > 1) {
            // If confidence is 1-100, it's already a percentage
            return `${conf.toFixed(2)}%`;
        } else {
            // If confidence is 0-1, convert to percentage
            return `${(conf * 100).toFixed(2)}%`;
        }
    };

    const getConfidenceColor = (confidence) => {
        const conf = parseFloat(confidence);
        if (isNaN(conf)) return "text-gray-600 bg-gray-100";

        // Confidence is 0-1 float, so use directly for comparison
        if (conf >= 0.8) return "text-green-600 bg-green-100";
        if (conf >= 0.6) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Live Payload Data
                    </h3>
                </div>
            </div>

            <div className="overflow-hidden">
                {displayPayloads.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <Database className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No payload data available</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {displayPayloads.map((payload) => (
                            <div
                                key={payload.id}
                                className={`p-4 ${
                                    payload.isRealtime ? "bg-blue-50" : ""
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            {payload.id}
                                        </span>
                                        {payload.isRealtime && (
                                            <span className="flex items-center space-x-1 text-xs text-red-600">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <span>LIVE</span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        <span>{payload.time}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-gray-500">
                                            Date:
                                        </span>
                                        <span className="ml-1 font-mono">
                                            {payload.date}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Speed:
                                        </span>
                                        <span className="ml-1 font-mono">
                                            {payload.speed}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-gray-500">
                                            Location:
                                        </span>
                                        <span className="ml-1 font-mono">
                                            {payload.latitude},{" "}
                                            {payload.longitude}
                                        </span>
                                    </div>
                                </div>

                                {/* Display detections with proper class-confidence pairing */}
                                {payload.detections.length > 0 && (
                                    <div className="mt-3">
                                        <div className="text-xs text-gray-500 mb-1">
                                            Detections:
                                        </div>
                                        <div className="space-y-1">
                                            {payload.detections.map(
                                                (detection, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <Target className="h-3 w-3 text-blue-600" />
                                                            <span className="text-xs font-medium text-gray-900">
                                                                {
                                                                    detection.class
                                                                }
                                                            </span>
                                                        </div>
                                                        <span
                                                            className={`text-xs px-2 py-1 rounded ${getConfidenceColor(
                                                                detection.confidence
                                                            )}`}
                                                        >
                                                            {formatConfidence(
                                                                detection.confidence
                                                            )}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Show if no detections */}
                                {payload.detections.length === 0 && (
                                    <div className="mt-3 p-2 bg-gray-50 rounded text-center">
                                        <span className="text-xs text-gray-500">
                                            No detections
                                        </span>
                                    </div>
                                )}

                                {/* Show raw data if available */}
                                {payload.rawData && (
                                    <div className="mt-3">
                                        <details className="group">
                                            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                                                Raw WebSocket Data
                                            </summary>
                                            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono overflow-x-auto">
                                                <pre>
                                                    {JSON.stringify(
                                                        payload.rawData,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </div>
                                        </details>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PayloadTable;

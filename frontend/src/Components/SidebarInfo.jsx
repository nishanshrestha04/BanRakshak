import React from "react";
import { MapPin, Clock, Activity, Database } from "lucide-react";

const SidebarInfo = ({
    location,
    recentDetections,
    soundTypes,
    getThreatColor,
    getThreatIcon,
    lastUpdateTime,
    payloadData = [],
}) => {
    const getThreatLevel = (soundType) => {
        const type = soundType?.toLowerCase();
        if (type === "axe_cutting" || type === "chainsaw") {
            return "high";
        } else if (
            type === "truck" ||
            type === "human_voice" ||
            type === "machinery"
        ) {
            return "medium";
        } else {
            return "low";
        }
    };

    const formatConfidence = (confidence) => {
        const conf = parseFloat(confidence);
        if (isNaN(conf)) return "N/A";

        // Handle different confidence value formats
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

    return (
        <div className="space-y-6">
            {/* Location Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Current Location
                    </h3>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Latitude:</span>
                        <span className="font-mono text-sm text-gray-900">
                            {location.lat.toFixed(6)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Longitude:</span>
                        <span className="font-mono text-sm text-gray-900">
                            {location.lng.toFixed(6)}
                        </span>
                    </div>
                    {lastUpdateTime && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Last Update:</span>
                            <span className="font-mono text-sm text-gray-900">
                                {new Date(lastUpdateTime).toLocaleTimeString()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Detections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Recent Detections
                    </h3>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {recentDetections.length > 0 ? (
                        recentDetections.map((detection) => {
                            const threatLevel = getThreatLevel(detection.type);
                            return (
                                <div
                                    key={detection.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`p-2 rounded-lg ${getThreatColor(
                                                threatLevel
                                            )}`}
                                        >
                                            {getThreatIcon(threatLevel)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {detection.type}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {detection.time}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium text-gray-600">
                                        {formatConfidence(detection.confidence)}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-gray-500">
                                No recent detections
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sound Types Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                    <Activity className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Detection Summary
                    </h3>
                </div>
                <div className="space-y-3">
                    {soundTypes.length > 0 ? (
                        soundTypes.map((type, index) => {
                            const threatLevel = getThreatLevel(type.name);
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        {getThreatIcon(threatLevel)}
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {type.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {type.count} detection
                                                {type.count > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getThreatColor(
                                                threatLevel
                                            )}`}
                                        >
                                            {threatLevel}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatConfidence(type.confidence)}{" "}
                                            confidence
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Database className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p>No detections yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarInfo;

import {
    Activity,
    Wifi,
    WifiOff,
    TrendingUp,
    AlertTriangle,
    Volume2,
    CheckCircle,
} from "lucide-react";

const LiveDetectionFeed = ({ wsData, isConnected, recentDetections = [] }) => {
    const getThreatLevel = (soundType, confidence = 0) => {
        const type = soundType?.toLowerCase();

        if (type === "axe_cutting" || type === "chainsaw") {
            // Parse confidence value to get actual percentage
            let confValue = parseFloat(confidence);
            if (confValue > 100) {
                confValue = confValue / 100;
            } else if (confValue <= 1) {
                confValue = confValue * 100;
            }

            if (confValue >= 50) {
                return "high";
            } else if (confValue >= 10) {
                return "medium";
            } else {
                return "low";
            }
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

    const getThreatColor = (threat) => {
        switch (threat) {
            case "high":
                return "text-red-600 bg-red-100 border-red-200";
            case "medium":
                return "text-yellow-600 bg-yellow-100 border-yellow-200";
            case "low":
                return "text-green-600 bg-green-100 border-green-200";
            default:
                return "text-gray-600 bg-gray-100 border-gray-200";
        }
    };

    const getThreatIcon = (threat) => {
        switch (threat) {
            case "high":
                return <AlertTriangle className="h-4 w-4" />;
            case "medium":
                return <Volume2 className="h-4 w-4" />;
            case "low":
                return <CheckCircle className="h-4 w-4" />;
            default:
                return null;
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

    const getConfidenceColor = (confidence) => {
        const conf = parseFloat(confidence);
        if (isNaN(conf)) return "text-gray-600 bg-gray-100";

        // Normalize to 0-1 range for comparison (confidence is percentage)
        const normalizedConf = conf / 100;

        if (normalizedConf >= 0.8) return "text-green-600 bg-green-100";
        if (normalizedConf >= 0.6) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Activity className="h-5 w-5 text-green-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Live Detection Feed
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        {isConnected ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Latest Detection */}
                {wsData ? (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        Latest Detection
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            Device:{" "}
                                            <span className="font-medium">
                                                {wsData.device_id}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Time:{" "}
                                            <span className="font-medium">
                                                {new Date(
                                                    wsData.timestamp
                                                ).toLocaleTimeString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900 mb-1">
                                        {wsData.top_class}
                                    </p>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {(() => {
                                            // Use the same formatting logic as other components
                                            if (
                                                wsData.confidence &&
                                                Array.isArray(wsData.confidence)
                                            ) {
                                                const maxConfidence = Math.max(
                                                    ...wsData.confidence
                                                );
                                                if (maxConfidence > 100) {
                                                    return `${(
                                                        maxConfidence / 100
                                                    ).toFixed(2)}%`;
                                                } else if (maxConfidence > 1) {
                                                    return `${maxConfidence.toFixed(
                                                        2
                                                    )}%`;
                                                } else {
                                                    return `${(
                                                        maxConfidence * 100
                                                    ).toFixed(2)}%`;
                                                }
                                            } else if (wsData.def_prob) {
                                                const confidence = parseFloat(
                                                    wsData.def_prob
                                                );
                                                if (confidence > 100) {
                                                    return `${(
                                                        confidence / 100
                                                    ).toFixed(2)}%`;
                                                } else if (confidence > 1) {
                                                    return `${confidence.toFixed(
                                                        2
                                                    )}%`;
                                                } else {
                                                    return `${(
                                                        confidence * 100
                                                    ).toFixed(2)}%`;
                                                }
                                            }
                                            return "0.00%";
                                        })()}{" "}
                                        confidence
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Activity className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">
                            {isConnected
                                ? "Waiting for detection data..."
                                : "Not connected to monitoring system"}
                        </p>
                    </div>
                )}

                {/* Detection History */}
                <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Detection History
                        </h3>
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                                Last 10 detections
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {recentDetections.length > 0 ? (
                            recentDetections.map((detection) => {
                                const threatLevel = getThreatLevel(
                                    detection.type,
                                    detection.confidence
                                );
                                return (
                                    <div
                                        key={detection.id}
                                        className={`p-4 rounded-lg border-l-4 ${getThreatColor(
                                            threatLevel
                                        )} transition-all duration-200 hover:shadow-md`}
                                    >
                                        <div className="flex items-center justify-between">
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
                                                    <div className="text-sm text-gray-500">
                                                        {detection.time} •
                                                        Device:{" "}
                                                        {detection.deviceId}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-gray-900">
                                                    {formatConfidence(
                                                        detection.confidence
                                                    )}
                                                </div>
                                                <div
                                                    className={`text-xs px-2 py-1 rounded-full ${
                                                        threatLevel === "high"
                                                            ? "bg-red-100 text-red-700"
                                                            : threatLevel ===
                                                              "medium"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                                >
                                                    {threatLevel} risk
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Activity className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500">
                                    No detection history available
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Connection Status */}
                {isConnected && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-2 text-sm text-green-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-medium">
                                Live monitoring active
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveDetectionFeed;

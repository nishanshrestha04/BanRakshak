import React, { useState, useEffect } from "react";
import {
    AlertTriangle,
    CheckCircle,
    Volume2,
    Menu,
    TreePine,
    Shield,
    MapPin,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";
import StatusCards from "../Components/StatusCards";
import LiveDetectionFeed from "../Components/LiveDetectionFeed";
import SidebarInfo from "../Components/SidebarInfo";
import useWebSocket from "../hooks/useWebSocket";

const Overview = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentSound, setCurrentSound] = useState(null);
    const [location, setLocation] = useState({ lat: 43.7615, lng: -79.4111 });
    const [detectionCount, setDetectionCount] = useState(0);
    const [recentDetections, setRecentDetections] = useState([]);
    const [payloadData, setPayloadData] = useState([]);
    // WebSocket connection
    const { data: wsData, isConnected } = useWebSocket(
        "ws://192.168.102.198:8000/ws"
    );

    // Handle incoming WebSocket data
    useEffect(() => {
        if (wsData) {
            console.log("==== FULL WEBSOCKET DATA ====");
            console.log("Raw WebSocket data:", wsData);
            console.log("Data type:", typeof wsData);
            console.log("Data keys:", Object.keys(wsData));
            console.log("============================");

            // Handle different payload structures
            let classes = [];
            let confidences = [];
            let topClass = null;
            let topConfidence = 0;

            // Check if it's the new payload structure
            if (wsData.class && wsData.confidence) {
                console.log("New payload structure detected");
                classes = Array.isArray(wsData.class)
                    ? wsData.class
                    : [wsData.class];
                confidences = Array.isArray(wsData.confidence)
                    ? wsData.confidence.map((conf) => parseFloat(conf) || 0)
                    : [parseFloat(wsData.confidence) || 0];

                // Find top class from arrays
                if (confidences.length > 0) {
                    const maxIndex = confidences.indexOf(
                        Math.max(...confidences)
                    );
                    topClass = classes[maxIndex] || classes[0];
                    topConfidence = confidences[maxIndex] || 0;
                }
            }
            // Handle legacy structure
            else if (wsData.top_class) {
                console.log("Legacy payload structure detected");
                topClass = wsData.top_class;
                topConfidence = parseFloat(wsData.def_prob) || 0;
                classes = [topClass];
                confidences = [topConfidence];
            }

            console.log("Processed classes:", classes);
            console.log("Processed confidences:", confidences);
            console.log("Top class:", topClass);
            console.log("Top confidence:", topConfidence);

            setCurrentSound(topClass);
            setDetectionCount((prev) => prev + 1);

            // Ensure confidence is a valid number before processing
            const validConfidence = isNaN(topConfidence) ? 0 : topConfidence;
            // Since confidence comes as float (0-1), always multiply by 100 for percentage
            const confidencePercentage = Math.round(validConfidence * 100);

            const newDetection = {
                id: wsData.clip_id || Date.now(),
                type: topClass || "Unknown",
                confidence: confidencePercentage,
                time: new Date(
                    wsData.timestamp || Date.now()
                ).toLocaleTimeString(),
                timestamp: wsData.timestamp || Date.now(),
                threat:
                    validConfidence > 0.7
                        ? "high"
                        : validConfidence > 0.4
                        ? "medium"
                        : "low",
                deviceId: wsData.device_id,
            };

            setRecentDetections((prev) => [newDetection, ...prev.slice(0, 9)]);

            // Add payload data for the table - handle both structures
            const payloadEntry = {
                time: wsData.time || new Date().toLocaleTimeString(),
                date: wsData.date || new Date().toLocaleDateString(),
                latitude: wsData.latitude || location.lat.toString(),
                longitude: wsData.longitude || location.lng.toString(),
                speed: wsData.speed || "0",
                class: classes,
                confidence: confidences,
                timestamp: new Date(),
                isRealtime: true,
                rawData: wsData, // Store raw data for debugging
            };

            console.log("Payload entry created:", payloadEntry);
            setPayloadData((prev) => [payloadEntry, ...prev.slice(0, 19)]); // Keep last 20 entries
        }
    }, [wsData, location]);

    // Sound types summary based on recent detections
    const soundTypes = React.useMemo(() => {
        const types = {};
        recentDetections.forEach((detection) => {
            if (types[detection.type]) {
                types[detection.type].count += 1;
                types[detection.type].confidence = Math.max(
                    types[detection.type].confidence,
                    detection.confidence
                );
            } else {
                types[detection.type] = {
                    name: detection.type,
                    count: 1,
                    confidence: isNaN(detection.confidence)
                        ? 0
                        : detection.confidence, // Keep as percentage
                    threat: detection.threat,
                };
            }
        });
        return Object.values(types);
    }, [recentDetections]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        }
    }, []);

    const getThreatColor = (threat) => {
        switch (threat) {
            case "high":
                return "text-red-600 bg-red-100";
            case "medium":
                return "text-yellow-600 bg-yellow-100";
            case "low":
                return "text-green-600 bg-green-100";
            default:
                return "text-gray-600 bg-gray-100";
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

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <div className="md:hidden bg-white shadow-sm p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center space-x-2">
                            <TreePine className="h-6 w-6 text-green-600" />
                            <span className="font-semibold text-gray-900">
                                वन रक्षक
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <Shield className="h-8 w-8 text-green-600" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Forest Sound Monitor
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Real-time audio analysis and threat
                                        detection system
                                    </p>
                                </div>
                            </div>

                            {/* Connection Status */}
                            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        isConnected
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                    }`}
                                ></div>
                                <span className="text-sm font-medium text-gray-700">
                                    {isConnected
                                        ? "Connected to monitoring system"
                                        : "Disconnected from monitoring system"}
                                </span>
                                {isConnected && (
                                    <div className="ml-auto flex items-center space-x-2 text-sm text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>Live</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Cards */}
                        <StatusCards
                            isConnected={isConnected}
                            wsData={wsData}
                            detectionCount={detectionCount}
                            currentSound={currentSound}
                        />

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Live Detection Feed */}
                            <div className="xl:col-span-2">
                                <LiveDetectionFeed
                                    wsData={wsData}
                                    isConnected={isConnected}
                                    recentDetections={recentDetections}
                                />
                            </div>

                            {/* Sidebar Info */}
                            <div className="xl:col-span-1">
                                <SidebarInfo
                                    location={location}
                                    recentDetections={recentDetections}
                                    soundTypes={soundTypes}
                                    getThreatColor={getThreatColor}
                                    getThreatIcon={getThreatIcon}
                                    lastUpdateTime={wsData?.timestamp}
                                    payloadData={payloadData}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Overview;

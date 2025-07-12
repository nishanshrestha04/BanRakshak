import React, { useState, useEffect, useRef } from "react";
import {
    MapPin,
    Volume2,
    AlertTriangle,
    CheckCircle,
    Mic,
    MicOff,
    Radio,
    Menu,
} from "lucide-react";
import Sidebar from "../Components/Sidebar";

const Overview = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [currentSound, setCurrentSound] = useState(null);
    const [location, setLocation] = useState({ lat: 43.7615, lng: -79.4111 });
    const [audioLevel, setAudioLevel] = useState(0);
    const [detectionCount, setDetectionCount] = useState(0);
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);

    // Mock recent detections
    const recentDetections = [
        {
            id: 1,
            type: "Chainsaw",
            confidence: 95,
            time: "2 mins ago",
            threat: "high",
        },
        {
            id: 2,
            type: "Vehicle Engine",
            confidence: 87,
            time: "5 mins ago",
            threat: "medium",
        },
        {
            id: 3,
            type: "Bird Song",
            confidence: 92,
            time: "8 mins ago",
            threat: "low",
        },
        {
            id: 4,
            type: "Wind",
            confidence: 76,
            time: "12 mins ago",
            threat: "low",
        },
    ];

    const soundTypes = [
        { name: "Chainsaw", confidence: 0.95, threat: "high", count: 3 },
        {
            name: "Vehicle Engine",
            confidence: 0.87,
            threat: "medium",
            count: 7,
        },
        { name: "Bird Song", confidence: 0.92, threat: "low", count: 24 },
        { name: "Wind", confidence: 0.76, threat: "low", count: 18 },
    ];

    useEffect(() => {
        // Get user location
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

    const startListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            audioContextRef.current = new (window.AudioContext ||
                window.webkitAudioContext)();
            const source =
                audioContextRef.current.createMediaStreamSource(stream);

            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 2048;
            source.connect(analyserRef.current);

            setIsListening(true);
            drawSpectrogram();

            // Mock sound detection
            const mockSounds = [
                "Chainsaw",
                "Bird Song",
                "Wind",
                "Vehicle Engine",
            ];
            const detectionInterval = setInterval(() => {
                const randomSound =
                    mockSounds[Math.floor(Math.random() * mockSounds.length)];
                setCurrentSound(randomSound);
                setDetectionCount((prev) => prev + 1);
            }, 3000);

            return () => clearInterval(detectionInterval);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopListening = () => {
        setIsListening(false);
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        setCurrentSound(null);
    };

    const drawSpectrogram = () => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserRef.current) return;

        const ctx = canvas.getContext("2d");
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            analyserRef.current.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#0f172a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;

                const intensity = dataArray[i] / 255;
                const r = Math.floor(intensity * 255);
                const g = Math.floor(intensity * 200);
                const b = Math.floor(intensity * 100);

                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }

            const avgLevel = dataArray.reduce((a, b) => a + b) / bufferLength;
            setAudioLevel(avgLevel);

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
    };

    const getThreatColor = (threat) => {
        switch (threat) {
            case "high":
                return "text-red-500 bg-red-50";
            case "medium":
                return "text-yellow-600 bg-yellow-50";
            case "low":
                return "text-green-500 bg-green-50";
            default:
                return "text-gray-500 bg-gray-50";
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
        <div className="flex h-screen bg-gray-50 pt-[104px]">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <div className="md:hidden bg-white shadow-sm p-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto scroll-smooth">
                    <div className="p-6">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Forest Sound Monitor
                            </h1>
                            <p className="text-gray-600">
                                Real-time audio analysis and threat detection
                                system
                            </p>
                        </div>

                        {/* Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Monitoring Status
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {isListening
                                                ? "Active"
                                                : "Inactive"}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-3 rounded-full ${
                                            isListening
                                                ? "bg-green-100"
                                                : "bg-gray-100"
                                        }`}
                                    >
                                        {isListening ? (
                                            <Mic className="h-6 w-6 text-green-600" />
                                        ) : (
                                            <MicOff className="h-6 w-6 text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Audio Level
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {Math.round(audioLevel)}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <Radio className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Detections Today
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {detectionCount}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-purple-100">
                                        <Volume2 className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Current Sound
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {currentSound || "None"}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-indigo-100">
                                        <CheckCircle className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Live Spectrogram */}
                            <div className="xl:col-span-2 bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Live Audio Spectrogram
                                        </h2>
                                        <button
                                            onClick={
                                                isListening
                                                    ? stopListening
                                                    : startListening
                                            }
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                                isListening
                                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                                    : "bg-[#1B4332] hover:bg-[#2D6A4F] text-white"
                                            }`}
                                        >
                                            {isListening ? (
                                                <>
                                                    <MicOff className="h-4 w-4" />
                                                    <span>Stop</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Mic className="h-4 w-4" />
                                                    <span>Start</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="bg-gray-900 rounded-lg p-4">
                                        <canvas
                                            ref={canvasRef}
                                            width={800}
                                            height={300}
                                            className="w-full h-auto border border-gray-700 rounded"
                                        />
                                    </div>
                                    {isListening && (
                                        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span>Live monitoring active</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sound Detection & Info */}
                            <div className="space-y-6">
                                {/* Location Info */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Monitoring Location
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-[#1B4332]" />
                                            <span className="text-sm text-gray-600">
                                                {location.lat.toFixed(6)},{" "}
                                                {location.lng.toFixed(6)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Last updated:{" "}
                                            {new Date().toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Detections */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Recent Detections
                                    </h3>
                                    <div className="space-y-3">
                                        {recentDetections.map((detection) => (
                                            <div
                                                key={detection.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className={`p-1 rounded-full ${getThreatColor(
                                                            detection.threat
                                                        )}`}
                                                    >
                                                        {getThreatIcon(
                                                            detection.threat
                                                        )}
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
                                                <div className="text-sm text-gray-600">
                                                    {detection.confidence}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sound Types Summary */}
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Sound Types Today
                                    </h3>
                                    <div className="space-y-3">
                                        {soundTypes.map((sound, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className={`p-1 rounded-full ${getThreatColor(
                                                            sound.threat
                                                        )}`}
                                                    >
                                                        {getThreatIcon(
                                                            sound.threat
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {sound.name}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {sound.count}x
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Overview;

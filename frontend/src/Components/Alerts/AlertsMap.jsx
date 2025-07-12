import React, { useEffect, useRef, useState } from "react";
import { Navigation, Wifi, WifiOff, MapPin } from "lucide-react";
import useWebSocket from "../../hooks/useWebSocket";

const AlertsMap = ({ alerts = [] }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const [leafletLoaded, setLeafletLoaded] = useState(false);

    // WebSocket connection for real-time updates
    const { data: wsData, isConnected } = useWebSocket(
        "ws://localhost:8080/ws/alerts",
        {
            maxReconnectAttempts: 5,
            reconnectDelay: 3000,
        }
    );

    // Transform alerts to map locations using real coordinates
    const alertLocations = alerts.map((alert, index) => ({
        id: alert.id || index,
        zone: alert.location?.split(" ")[0] || "Zone A",
        severity: alert.severity || "medium",
        lat: alert.latitude || 27.7172 + (Math.random() - 0.5) * 0.05,
        lng: alert.longitude || 85.324 + (Math.random() - 0.5) * 0.05,
        type: alert.type || "Unknown",
        status: alert.status || "active",
        confidence: alert.confidence || 0,
        speed: alert.speed || 0,
        time: alert.time || "Unknown",
        date: alert.date || "Unknown",
    }));

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case "high":
                return "#ef4444";
            case "medium":
                return "#f97316";
            case "low":
                return "#eab308";
            default:
                return "#6b7280";
        }
    };

    // Load Leaflet dynamically
    useEffect(() => {
        const loadLeaflet = async () => {
            if (window.L) {
                setLeafletLoaded(true);
                return;
            }

            // Load Leaflet CSS
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);

            // Load Leaflet JS
            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = () => {
                setLeafletLoaded(true);
            };
            document.head.appendChild(script);
        };

        loadLeaflet();
    }, []);

    // Initialize map when Leaflet is loaded
    useEffect(() => {
        if (leafletLoaded && mapRef.current && !mapInstanceRef.current) {
            initializeMap();
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [leafletLoaded]);

    // Update markers when alerts change
    useEffect(() => {
        if (mapInstanceRef.current && alertLocations.length > 0) {
            updateMarkers();
        }
    }, [alertLocations]);

    const initializeMap = () => {
        if (!window.L || !mapRef.current) return;

        // Initialize map centered on Kathmandu, Nepal
        mapInstanceRef.current = window.L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            touchZoom: true,
        }).setView([27.7172, 85.324], 12);

        // Add OpenStreetMap tiles
        window.L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "© OpenStreetMap contributors",
                maxZoom: 18,
            }
        ).addTo(mapInstanceRef.current);

        // Add custom CSS for markers
        const style = document.createElement("style");
        style.textContent = `
            .custom-marker {
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        updateMarkers();
    };

    const createCustomIcon = (severity) => {
        if (!window.L) return null;

        const color = getSeverityColor(severity);
        const html = `<div class="custom-marker" style="width: 16px; height: 16px; background-color: ${color};"></div>`;

        return window.L.divIcon({
            html: html,
            className: "custom-div-icon",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -8],
        });
    };

    const updateMarkers = () => {
        if (!mapInstanceRef.current || !window.L) return;

        // Clear existing markers
        markersRef.current.forEach((marker) => {
            mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Add new markers with enhanced popup information
        alertLocations.forEach((alert) => {
            const icon = createCustomIcon(alert.severity);
            if (!icon) return;

            const marker = window.L.marker([alert.lat, alert.lng], {
                icon,
            }).addTo(mapInstanceRef.current).bindPopup(`
                    <div class="p-3 min-w-[200px]">
                        <h4 class="font-semibold text-sm mb-2 text-gray-800">${
                            alert.zone
                        }</h4>
                        <div class="space-y-1 text-xs text-gray-600">
                            <p><strong>Type:</strong> ${alert.type}</p>
                            <p><strong>Severity:</strong> <span class="capitalize">${
                                alert.severity
                            }</span></p>
                            <p><strong>Confidence:</strong> ${
                                alert.confidence
                            }%</p>
                            <p><strong>Status:</strong> <span class="capitalize">${
                                alert.status
                            }</span></p>
                            <p><strong>Time:</strong> ${alert.time}</p>
                            <p><strong>Date:</strong> ${alert.date}</p>
                            <p><strong>Speed:</strong> ${alert.speed} km/h</p>
                            <p><strong>Coordinates:</strong> ${alert.lat.toFixed(
                                4
                            )}, ${alert.lng.toFixed(4)}</p>
                        </div>
                    </div>
                `);

            markersRef.current.push(marker);
        });

        // Fit map to show all markers if there are any
        if (alertLocations.length > 0) {
            const group = new window.L.featureGroup(markersRef.current);
            mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }
    };

    // Handle real-time WebSocket updates
    useEffect(() => {
        if (wsData && mapInstanceRef.current) {
            // Transform new payload data and update markers
            if (
                wsData.latitude &&
                wsData.longitude &&
                wsData.class &&
                wsData.confidence
            ) {
                const newAlerts = wsData.class
                    .map((detectedClass, index) => {
                        const confidence = wsData.confidence[index] || 0;
                        if (confidence > 0.5) {
                            const severity =
                                confidence > 0.8
                                    ? "high"
                                    : confidence > 0.6
                                    ? "medium"
                                    : "low";
                            return {
                                id: `realtime-${Date.now()}-${index}`,
                                latitude: parseFloat(wsData.latitude),
                                longitude: parseFloat(wsData.longitude),
                                type: detectedClass,
                                severity: severity,
                                confidence: Math.round(confidence * 100),
                                status: "active",
                                time:
                                    wsData.time ||
                                    new Date().toLocaleTimeString(),
                                date:
                                    wsData.date ||
                                    new Date().toLocaleDateString(),
                                speed: parseFloat(wsData.speed) || 0,
                                location: `Zone ${String.fromCharCode(
                                    65 + Math.floor(Math.random() * 3)
                                )}-${Math.floor(Math.random() * 5) + 1}`,
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                if (newAlerts.length > 0) {
                    // Add new real-time markers
                    newAlerts.forEach((alert) => {
                        const icon = createCustomIcon(alert.severity);
                        if (!icon) return;

                        const marker = window.L.marker(
                            [alert.latitude, alert.longitude],
                            {
                                icon,
                            }
                        ).addTo(mapInstanceRef.current).bindPopup(`
                            <div class="p-3 min-w-[200px]">
                                <h4 class="font-semibold text-sm mb-2 text-red-600">🔴 LIVE ALERT</h4>
                                <div class="space-y-1 text-xs text-gray-600">
                                    <p><strong>Type:</strong> ${alert.type}</p>
                                    <p><strong>Severity:</strong> <span class="capitalize">${
                                        alert.severity
                                    }</span></p>
                                    <p><strong>Confidence:</strong> ${
                                        alert.confidence
                                    }%</p>
                                    <p><strong>Time:</strong> ${alert.time}</p>
                                    <p><strong>Speed:</strong> ${
                                        alert.speed
                                    } km/h</p>
                                    <p><strong>Coordinates:</strong> ${alert.latitude.toFixed(
                                        4
                                    )}, ${alert.longitude.toFixed(4)}</p>
                                </div>
                            </div>
                        `);

                        markersRef.current.push(marker);

                        // Auto-open popup for new alerts
                        setTimeout(() => {
                            marker.openPopup();
                        }, 500);
                    });
                }
            }
        }
    }, [wsData]);

    const severityCounts = {
        high: alertLocations.filter((a) => a.severity?.toLowerCase() === "high")
            .length,
        medium: alertLocations.filter(
            (a) => a.severity?.toLowerCase() === "medium"
        ).length,
        low: alertLocations.filter((a) => a.severity?.toLowerCase() === "low")
            .length,
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-[#1B4332]" />
                    <h3 className="text-lg font-semibold text-gray-800">
                        Alert Locations
                    </h3>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        {isConnected ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        <span
                            className={`text-xs ${
                                isConnected ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {isConnected ? "Live" : "Offline"}
                        </span>
                    </div>
                    <button
                        className="text-[#1B4332] hover:text-[#2D6A4F]"
                        onClick={() => {
                            if (
                                mapInstanceRef.current &&
                                alertLocations.length > 0
                            ) {
                                const group = new window.L.featureGroup(
                                    markersRef.current
                                );
                                mapInstanceRef.current.fitBounds(
                                    group.getBounds().pad(0.1)
                                );
                            }
                        }}
                    >
                        <Navigation className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div
                ref={mapRef}
                className="h-96 rounded-lg border-2 border-green-200 bg-green-50"
                style={{ zIndex: 1 }}
            >
                {!leafletLoaded && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading map...</div>
                    </div>
                )}
            </div>

            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Alert Severity
                </h4>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">High</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Medium</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Low</span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-lg font-bold text-red-600">
                            {severityCounts.high}
                        </div>
                        <div className="text-xs text-gray-500">
                            High Priority
                        </div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-orange-600">
                            {severityCounts.medium}
                        </div>
                        <div className="text-xs text-gray-500">
                            Medium Priority
                        </div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-yellow-600">
                            {severityCounts.low}
                        </div>
                        <div className="text-xs text-gray-500">
                            Low Priority
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertsMap;

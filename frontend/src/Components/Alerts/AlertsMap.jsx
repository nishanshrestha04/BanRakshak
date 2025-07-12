import React, { useEffect, useRef } from "react";
import { Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const AlertsMap = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const alertLocations = [
        { id: 1, zone: "A-1", severity: "High", lat: 27.7172, lng: 85.324 },
        { id: 2, zone: "B-3", severity: "Medium", lat: 27.71, lng: 85.33 },
        { id: 3, zone: "C-2", severity: "Low", lat: 27.705, lng: 85.318 },
        { id: 4, zone: "A-4", severity: "High", lat: 27.72, lng: 85.315 },
        { id: 5, zone: "B-1", severity: "High", lat: 27.708, lng: 85.328 },
    ];

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "High":
                return "#ef4444";
            case "Medium":
                return "#f97316";
            case "Low":
                return "#eab308";
            default:
                return "#6b7280";
        }
    };

    const createCustomIcon = (severity) => {
        const color = getSeverityColor(severity);
        return L.divIcon({
            html: `<div style="
                width: 16px;
                height: 16px;
                background-color: ${color};
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
            "></div>`,
            className: "custom-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
    };

    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            // Initialize map centered on Kathmandu area (forest region)
            mapInstanceRef.current = L.map(mapRef.current).setView(
                [27.7172, 85.324],
                13
            );

            // Add OpenStreetMap tiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap contributors",
            }).addTo(mapInstanceRef.current);

            // Add alert markers
            alertLocations.forEach((alert) => {
                const marker = L.marker([alert.lat, alert.lng], {
                    icon: createCustomIcon(alert.severity),
                }).addTo(mapInstanceRef.current);

                marker.bindPopup(`
                    <div class="text-center">
                        <strong>Zone ${alert.zone}</strong><br>
                        <span style="color: ${getSeverityColor(
                            alert.severity
                        )}">
                            ${alert.severity} Priority
                        </span>
                    </div>
                `);
            });

            // Add forest boundaries (example polygon)
            const forestBoundary = L.polygon(
                [
                    [27.725, 85.31],
                    [27.725, 85.335],
                    [27.7, 85.335],
                    [27.7, 85.31],
                ],
                {
                    color: "#22c55e",
                    fillColor: "#dcfce7",
                    fillOpacity: 0.3,
                    weight: 2,
                }
            ).addTo(mapInstanceRef.current);

            forestBoundary.bindPopup("Protected Forest Area");
        }

        // Add CSS for pulse animation
        const style = document.createElement("style");
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Alert Locations
                </h3>
                <button className="text-[#1B4332] hover:text-[#2D6A4F]">
                    <Navigation className="h-5 w-5" />
                </button>
            </div>

            {/* Real Map Container */}
            <div
                ref={mapRef}
                className="h-64 rounded-lg border-2 border-green-200"
                style={{ zIndex: 1 }}
            ></div>

            {/* Legend */}
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

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-lg font-bold text-red-600">3</div>
                        <div className="text-xs text-gray-500">
                            High Priority
                        </div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-orange-600">
                            1
                        </div>
                        <div className="text-xs text-gray-500">
                            Medium Priority
                        </div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-yellow-600">
                            1
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

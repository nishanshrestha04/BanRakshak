const WS_URL = "ws://localhost:8080/ws/analytics";

class AnalyticsService {
    constructor() {
        this.subscribers = new Set();
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
    }

    // WebSocket connection management
    connect() {
        try {
            this.ws = new WebSocket(WS_URL);

            this.ws.onopen = () => {
                console.log("Analytics WebSocket connected");
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.notifySubscribers(data);
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            this.ws.onclose = () => {
                console.log("Analytics WebSocket disconnected");
                this.attemptReconnect();
            };

            this.ws.onerror = (error) => {
                console.error("Analytics WebSocket error:", error);
            };
        } catch (error) {
            console.error("Failed to connect to analytics WebSocket:", error);
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), this.reconnectDelay);
        }
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            this.connect();
        }
        return () => this.subscribers.delete(callback);
    }

    notifySubscribers(data) {
        this.subscribers.forEach((callback) => callback(data));
    }

    // API methods with fallback data
    async getStats() {
        try {
            const response = await fetch("/api/analytics/stats");
            if (!response.ok) throw new Error("Failed to fetch stats");
            return await response.json();
        } catch (error) {
            console.error("Error fetching stats:", error);
            return {
                totalDetections: 1247,
                activeAlerts: 8,
                protectedAreas: 156,
                accuracyRate: 94.8,
                detectionTrend: 12,
                alertTrend: 0,
                highPriorityAlerts: 3,
                coveragePercentage: 98,
                accuracyImprovement: 2.1,
            };
        }
    }

    async getSoundDetectionData() {
        try {
            const response = await fetch("/api/analytics/sound-detection");
            if (!response.ok)
                throw new Error("Failed to fetch sound detection data");
            return await response.json();
        } catch (error) {
            console.error("Error fetching sound detection data:", error);
            return {
                "Chain Saw": 25,
                Gunshot: 15,
                "Vehicle Engine": 30,
                "Human Voice": 20,
                "Animal Sounds": 10,
            };
        }
    }

    async getRecentAlerts() {
        try {
            const response = await fetch("/api/analytics/recent-alerts");
            if (!response.ok) throw new Error("Failed to fetch recent alerts");
            return await response.json();
        } catch (error) {
            console.error("Error fetching recent alerts:", error);
            return [
                {
                    type: "Chain Saw",
                    location: "Zone A",
                    time: "2 min ago",
                    severity: "High",
                },
                {
                    type: "Gunshot",
                    location: "Zone B",
                    time: "15 min ago",
                    severity: "High",
                },
                {
                    type: "Vehicle Engine",
                    location: "Zone C",
                    time: "1 hour ago",
                    severity: "Medium",
                },
                {
                    type: "Human Voice",
                    location: "Zone D",
                    time: "2 hours ago",
                    severity: "Low",
                },
                {
                    type: "Animal Sounds",
                    location: "Zone E",
                    time: "3 hours ago",
                    severity: "Low",
                },
            ];
        }
    }

    async getMonthlyData() {
        try {
            const response = await fetch("/api/analytics/monthly-data");
            if (!response.ok) throw new Error("Failed to fetch monthly data");
            return await response.json();
        } catch (error) {
            console.error("Error fetching monthly data:", error);
            return [
                { month: "Jan", detections: 120, alerts: 25 },
                { month: "Feb", detections: 135, alerts: 30 },
                { month: "Mar", detections: 150, alerts: 28 },
                { month: "Apr", detections: 160, alerts: 35 },
                { month: "May", detections: 180, alerts: 40 },
                { month: "Jun", detections: 200, alerts: 45 },
            ];
        }
    }

    async getAllAlerts() {
        try {
            const response = await fetch("/api/alerts");
            if (!response.ok) throw new Error("Failed to fetch alerts");
            return await response.json();
        } catch (error) {
            console.error("Error fetching alerts:", error);
            return [
                {
                    id: 1,
                    type: "Chain Saw Detection",
                    description:
                        "Unusual chainsaw activity detected in protected area",
                    location: "Zone A - North Sector",
                    timestamp: "2 min ago",
                    severity: "high",
                    status: "active",
                },
                {
                    id: 2,
                    type: "Gunshot Detection",
                    description:
                        "Multiple gunshots detected near wildlife sanctuary",
                    location: "Zone B - East Sector",
                    timestamp: "15 min ago",
                    severity: "high",
                    status: "investigating",
                },
                {
                    id: 3,
                    type: "Vehicle Engine",
                    description:
                        "Unauthorized vehicle detected on forest trail",
                    location: "Zone C - South Trail",
                    timestamp: "1 hour ago",
                    severity: "medium",
                    status: "active",
                },
                {
                    id: 4,
                    type: "Human Voice",
                    description:
                        "Human conversation detected in restricted area",
                    location: "Zone D - West Sector",
                    timestamp: "2 hours ago",
                    severity: "low",
                    status: "resolved",
                },
            ];
        }
    }

    async updateAlert(alertId, updateData) {
        try {
            const response = await fetch(`/api/alerts/${alertId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });
            if (!response.ok) throw new Error("Failed to update alert");
            return await response.json();
        } catch (error) {
            console.error("Error updating alert:", error);
            throw error;
        }
    }
}

export const analyticsService = new AnalyticsService();

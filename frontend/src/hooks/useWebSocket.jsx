import { useEffect, useState, useRef, useCallback } from "react";

const useWebSocket = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const ws = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = options.maxReconnectAttempts || 5;
    const reconnectDelay = options.reconnectDelay || 3000;

    const connectWebSocket = useCallback(() => {
        try {
            ws.current = new WebSocket(url);

            ws.current.onopen = () => {
                console.log("WebSocket connected ✔");
                setIsConnected(true);
                setError(null);
                reconnectAttempts.current = 0;
            };

            ws.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    setData(message);
                } catch (err) {
                    console.error("Error parsing WebSocket message:", err);
                    setError(err);
                }
            };

            ws.current.onclose = () => {
                console.log("WebSocket disconnected");
                setIsConnected(false);

                // Attempt to reconnect if under max attempts
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++;
                    setTimeout(connectWebSocket, reconnectDelay);
                } else {
                    setError(new Error("Max reconnection attempts reached"));
                }
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setError(error);
            };
        } catch (err) {
            console.error("WebSocket connection error:", err);
            setError(err);
        }
    }, [url, maxReconnectAttempts, reconnectDelay]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [connectWebSocket]);

    const sendMessage = useCallback((message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not connected");
        }
    }, []);

    return { data, isConnected, error, sendMessage };
};

export default useWebSocket;

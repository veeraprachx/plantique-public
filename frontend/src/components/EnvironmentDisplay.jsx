import React, { useState, useEffect } from "react";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/environments`;

const EnvironmentDisplay = () => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    // Fetch the initial (latest) sensor data from the API
    const fetchInitialData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch sensor data");
        }
        const data = await response.json();
        // Assuming data is an array sorted with the latest data at index 0:
        if (data && data.length > 0) {
          setSensorData(data[data.length - 1]);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchInitialData();

    // Setup WebSocket connection for real-time updates
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const messagePayload = JSON.parse(event.data);
        if (messagePayload.path === "/environmentData") {
          // Update state with the new environment data
          setSensorData(messagePayload.data);
          console.log("Received realtime sensor data:", messagePayload.data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  // Format the timestamp for a more friendly display.
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="w-full p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Real-Time Environment Data</h2>

      {sensorData ? (
        <div className="space-y-2">
          <p className="text-gray-800">
            <strong>Latest Time Update:</strong>{" "}
            {formatTimestamp(sensorData.timestamp)}
          </p>
          <p className="text-gray-800">
            <strong>Air Temperature:</strong> {sensorData.airTemp} °C
          </p>
          <p className="text-gray-800">
            <strong>Air Humidity:</strong> {sensorData.airPercentHumidity} %
          </p>
          <p className="text-gray-800">
            <strong>Soil Temperature:</strong> {sensorData.soilTemp} °C
          </p>
          <p className="text-gray-800">
            <strong>Soil Humidity:</strong> {sensorData.soilPercentHumidity} %
          </p>
        </div>
      ) : (
        <p className="text-gray-600 italic">⏳ Waiting for real-time data...</p>
      )}
    </div>
  );
};

export default EnvironmentDisplay;

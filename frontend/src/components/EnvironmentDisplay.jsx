import React, { useState, useEffect } from "react";
import CountdownTimer from "./CountdownTimer";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ENV_URL = `${API_BASE}/latest-environments`;
const CFG_URL = `${API_BASE}/automationConfig`;

export default function EnvironmentDisplay({ isDisplayButton = true }) {
  const [sensorData, setSensorData] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [config, setConfig] = useState({
    autoWateringEnabled: false,
    autoFoggingEnabled: false,
  });
  const [cfgLoading, setCfgLoading] = useState(true);

  // inside EnvironmentDisplay, above your return:
  const confirmAndToggle = (key, label) => {
    const isOn = config[key];
    const action = isOn ? "Disable" : "Enable";
    const ok = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} ${label}?`,
    );
    if (ok) toggle(key);
  };

  // 1) Fetch sensor data and subscribe to WS
  useEffect(() => {
    // initial fetch
    (async () => {
      try {
        const res = await fetch(`${ENV_URL}`);
        const data = await res.json();
        console.log("data: ", data);
        setSensorData(data);
      } catch (e) {
        console.error(e);
      }
    })();

    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      if (msg.path === "/environmentData") setSensorData(msg.data);
      if (msg.path === "/countdown") setSecondsLeft(msg.secondsLeft);
    };
    return () => ws.close();
  }, []);

  // 2) Fetch automationConfig on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(CFG_URL);
        const cfg = await res.json();
        setConfig(cfg);
      } catch (e) {
        console.error("Failed to load config", e);
      } finally {
        setCfgLoading(false);
      }
    })();
  }, []);

  // 3) Toggle handler
  const toggle = async (key) => {
    const newVal = !config[key];
    // optimistic UI
    setConfig((c) => ({ ...c, [key]: newVal }));
    try {
      const res = await fetch(CFG_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newVal }),
      });
      const updated = await res.json();
      setConfig(updated);
    } catch (e) {
      console.error("Failed to update config", e);
      // rollback
      setConfig((c) => ({ ...c, [key]: !newVal }));
    }
  };

  const formatTimestamp = (ts) =>
    ts
      ? new Date(ts).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : "";

  return (
    <div className="w-full p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">Real-Time Environment Data</h2>

      {/* Countdown */}
      <CountdownTimer
        secondsLeft={secondsLeft != null ? secondsLeft : ""}
        interval={14}
      />

      {/* Sensor data */}
      {sensorData ? (
        <div className="space-y-2 text-gray-800">
          <p>
            <strong>Last Update:</strong>{" "}
            {formatTimestamp(sensorData.timestamp)}
          </p>
          <p>
            <strong>Air Temp:</strong> {sensorData.airTemp}°C
          </p>
          <p>
            <strong>Air Humidity:</strong> {sensorData.airPercentHumidity}%
          </p>
          <p>
            <strong>Soil Humidity:</strong> {sensorData.soilPercentHumidity}%
          </p>
        </div>
      ) : (
        <p className="italic text-gray-600">⏳ Waiting for data…</p>
      )}

      {/* Automation toggles */}
      {!cfgLoading && (
        <div className="space-y-2">
          {/* Status lines */}
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Auto-Watering is{" "}
              <span
                className={
                  config.autoWateringEnabled ? "text-green-600" : "text-red-600"
                }
              >
                {config.autoWateringEnabled ? "ON" : "OFF"}
              </span>
            </p>
            <p className="text-sm font-medium">
              Auto-Fogging is{" "}
              <span
                className={
                  config.autoFoggingEnabled ? "text-green-600" : "text-red-600"
                }
              >
                {config.autoFoggingEnabled ? "ON" : "OFF"}
              </span>
            </p>
          </div>

          {/* Buttons (only if isDisplayButton === true) */}
          {isDisplayButton && (
            <div className="flex gap-4">
              <button
                onClick={() =>
                  confirmAndToggle("autoWateringEnabled", "Auto-Watering")
                }
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  config.autoWateringEnabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {config.autoWateringEnabled
                  ? "Disable Auto-Watering"
                  : "Enable Auto-Watering"}
              </button>

              <button
                onClick={() =>
                  confirmAndToggle("autoFoggingEnabled", "Auto-Fogging")
                }
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  config.autoFoggingEnabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {config.autoFoggingEnabled
                  ? "Disable Auto-Fogging"
                  : "Enable Auto-Fogging"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

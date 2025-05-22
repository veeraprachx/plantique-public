import React, { useState, useEffect } from "react";

function CommandControl({
  endpoint,
  title,
  inputLabel = "Time to Turn on (seconds):",
}) {
  const [time, setTime] = useState(""); // time in seconds
  const [message, setMessage] = useState("");
  const [commandStatus, setCommandStatus] = useState(null);
  const [latestTime, setLatestTime] = useState(null); // stored in ms
  const [error, setError] = useState(null);
  const [latestTimestamp, setLatestTimestamp] = useState(null);
  const [latestSource, setLatestSource] = useState(null);

  // POST with ms conversion
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time && time !== 0) {
      setMessage("Time is required");
      return;
    }
    try {
      const seconds = Number(time);
      const ms = Math.round(seconds * 1000);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ time: ms }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
        return;
      }
      await response.json();
      setMessage("Command sent successfully!");
      setTime(""); // clear seconds input
    } catch (err) {
      setMessage("Error sending command: " + err.message);
    }
  };

  // fetch latest, keep ms internally
  const fetchLatestStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
      );
      if (!response.ok) {
        throw new Error(`Error fetching commands: ${response.statusText}`);
      }
      const items = await response.json();
      if (!Array.isArray(items) || items.length === 0) {
        setCommandStatus("No commands found");
        setLatestTime(null);
        return;
      }
      const [latestItem] = items.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );
      setCommandStatus(latestItem.status);
      setLatestTime(latestItem.time); // still in ms
      setLatestTimestamp(latestItem.timestamp);
      setLatestSource(latestItem.source);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchLatestStatus();
    const intervalId = setInterval(fetchLatestStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="time" className="block mb-2">
          {inputLabel}
        </label>
        <input
          type="number"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          step="0.1"
          min="0"
          className="w-full p-2 mb-4 bg-blue-50 border border-blue-300 text-blue-900 placeholder-blue-400 focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Command
        </button>
      </form>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      <hr className="my-6" />

      <h3 className="text-xl font-semibold mb-2">Latest Command Details</h3>
      {error && <p className="text-red-600">Error: {error}</p>}

      {commandStatus === null ? (
        <p>Loading latest command status...</p>
      ) : (
        <div>
          <p>
            <strong>Status:</strong> {commandStatus}
          </p>
          <p>
            <strong>Time Duration:</strong>{" "}
            {latestTime != null
              ? (latestTime / 1000).toFixed(0) + " seconds"
              : "—"}
          </p>
          <p>
            <strong>Source:</strong> {latestSource || "—"}
          </p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {latestTimestamp ? new Date(latestTimestamp).toLocaleString() : "—"}
          </p>
        </div>
      )}
    </div>
  );
}

export default CommandControl;

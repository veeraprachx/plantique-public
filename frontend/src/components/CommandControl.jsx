import React, { useState, useEffect } from "react";

function CommandControl({
  endpoint,
  title,
  inputLabel = "Time to Turn on (seconds):",
}) {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [commandStatus, setCommandStatus] = useState(null);
  const [latestTime, setLatestTime] = useState(null);
  const [error, setError] = useState(null);

  // Function to POST a new command to the backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time) {
      setMessage("Time is required");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ time: Number(time) }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
        return;
      }
      await response.json();
      setMessage("Command sent successfully!");
      setTime("");
    } catch (error) {
      setMessage("Error sending command: " + error.message);
    }
  };

  // Function to fetch the latest command status and time from the backend.
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
      // Sort commands by timestamp (most recent first)
      const sortedItems = items.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );
      const latestItem = sortedItems[0];
      setCommandStatus(latestItem.status);
      setLatestTime(latestItem.time);
    } catch (err) {
      setError(err.message);
    }
  };

  // Poll for the latest command status and time every 5 seconds.
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
            <strong>Time:</strong> {latestTime} seconds
          </p>
        </div>
      )}
    </div>
  );
}

export default CommandControl;

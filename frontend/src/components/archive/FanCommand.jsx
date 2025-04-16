/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

function FanCommand() {
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [fanStatus, setFanStatus] = useState(null);
  const [latestTime, setLatestTime] = useState(null);
  const [error, setError] = useState(null);

  // Function to POST a new fan command to the backend.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!time) {
      setMessage("Time is required");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/fans`,
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

  // Function to fetch the latest fan command status and time from the backend.
  const fetchLatestFanStatus = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/fans`);
      if (!response.ok) {
        throw new Error(`Error fetching fans: ${response.statusText}`);
      }
      const fans = await response.json();
      if (!Array.isArray(fans) || fans.length === 0) {
        setFanStatus("No commands found");
        setLatestTime(null);
        return;
      }
      // Sort commands by timestamp (most recent first)
      const sortedFans = fans.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );
      const latestFan = sortedFans[0];
      setFanStatus(latestFan.status);
      setLatestTime(latestFan.time);
    } catch (err) {
      setError(err.message);
    }
  };

  // Poll for the latest fan status and time every 5 seconds.
  useEffect(() => {
    fetchLatestFanStatus();
    const intervalId = setInterval(fetchLatestFanStatus, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Fan Command</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="time" className="block mb-2">
          Time to Turn on (seconds):
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
      <h3 className="text-xl font-semibold mb-2">Latest Fan Command Details</h3>
      {error && <p className="text-red-600">Error: {error}</p>}
      {fanStatus === null ? (
        <p>Loading latest fan command status...</p>
      ) : (
        <div>
          <p>
            <strong>Status:</strong> {fanStatus}
          </p>
          <p>
            <strong>Time:</strong> {latestTime} seconds
          </p>
        </div>
      )}
    </div>
  );
}

export default FanCommand;

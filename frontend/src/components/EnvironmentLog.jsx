import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";

import TrendGraph from "./TrendGraph";
import EnvironmentLogTable from "./EnvironmentLogTable";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function EnvironmentInfo() {
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/environments`;

  // ---- state for the two ends of your date range ----
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // ---- toggles for showing each calendar ----
  const [showStartCal, setShowStartCal] = useState(false);
  const [showEndCal, setShowEndCal] = useState(false);

  // ---- the fetched data ----
  const [environmentData, setEnvironmentData] = useState([]);

  // Re‐fetch whenever startDate or endDate changes
  useEffect(() => {
    const fetchRange = async () => {
      try {
        // clamp start to 00:00 and end to 23:59:59.999
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const url =
          `${API_URL}` +
          `?startDate=${encodeURIComponent(start.toISOString())}` +
          `&endDate=${encodeURIComponent(end.toISOString())}`;

        const res = await axios.get(url);
        setEnvironmentData(res.data);
      } catch (err) {
        console.error("Failed to load environment data", err);
      }
    };

    fetchRange();
  }, [startDate, endDate]);

  // sort newest→oldest
  const sorted = [...environmentData].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  // prepare graph data
  const chartData = sorted
    .map((d) => ({
      timestamp: new Date(d.timestamp).getTime(),
      airTemp: d.airTemp,
      airHumidity: d.airPercentHumidity,
      soilHumidity: d.soilPercentHumidity,
    }))
    .reverse();

  return (
    <div className="bg-gray-100 min-h-screen w-full p-4 sm:p-6">
      <motion.div
        className="bg-white shadow-md rounded-lg w-full p-4 sm:p-6 mb-6"
        variants={cardVariant}
        initial="hidden"
        animate="show"
      >
        {/* ─── Date Range Controls ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Start Date */}
          <div className="relative">
            <button
              onClick={() => setShowStartCal((v) => !v)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Start: {startDate.toDateString()}
            </button>
            {showStartCal && (
              <div className="absolute z-10">
                <Calendar
                  onChange={(d) => {
                    setStartDate(d);
                    setShowStartCal(false);
                  }}
                  value={startDate}
                />
              </div>
            )}
          </div>

          {/* End Date */}
          <div className="relative">
            <button
              onClick={() => setShowEndCal((v) => !v)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              End: {endDate.toDateString()}
            </button>
            {showEndCal && (
              <div className="absolute z-10">
                <Calendar
                  onChange={(d) => {
                    setEndDate(d);
                    setShowEndCal(false);
                  }}
                  value={endDate}
                />
              </div>
            )}
          </div>

          {/* Today Shortcut */}
          <button
            onClick={() => {
              const today = new Date();
              setStartDate(today);
              setEndDate(today);
            }}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Today
          </button>
        </div>

        {/* ─── Chart ──────────────────────────────────────────────────── */}
        <h2 className="text-2xl font-bold mb-4">
          Trends from {startDate.toDateString()} to {endDate.toDateString()}
        </h2>
        <TrendGraph data={chartData} />
      </motion.div>

      {/* ─── Table ──────────────────────────────────────────────────── */}
      <motion.div
        className="bg-white shadow-md rounded-lg w-full p-4 sm:p-6"
        variants={cardVariant}
        initial="hidden"
        animate="show"
      >
        <EnvironmentLogTable records={sorted} />
      </motion.div>
    </div>
  );
}

// Homepage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import PlantiqueHome from "./PlantiqueHome";
import EnvironmentDisplay from "./EnvironmentDisplay";
import TrendGraph from "./TrendGraph";
import ImageAnalysis from "./ImageAnalysis";
import LoginPage from "./LoginPage";

import { motion } from "framer-motion";

export default function Homepage() {
  const [environmentData, setEnvironmentData] = useState([]);

  useEffect(() => {
    // 1. Compute midnight-to-midnight bounds
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);

    // 2. Fetch only today’s data
    const url =
      `${import.meta.env.VITE_API_BASE_URL}/environments` +
      `?startDate=${encodeURIComponent(startOfToday.toISOString())}` +
      `&endDate=${encodeURIComponent(startOfTomorrow.toISOString())}`;

    axios
      .get(url)
      .then((res) => setEnvironmentData(res.data))
      .catch((err) => console.error("Failed to load today’s data", err));
  }, []);

  // Now environmentData already only contains today’s records,
  // so we can map & reverse immediately:
  const chartData = environmentData
    .map((d) => ({
      timestamp: new Date(d.timestamp).getTime(),
      airTemp: d.airTemp,
      airHumidity: d.airPercentHumidity,
      soilHumidity: d.soilPercentHumidity,
    }))
    .reverse();

  // Recompute startOfToday string for the header
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  return (
    <div className="flex flex-col gap-8">
      <PlantiqueHome />
      <EnvironmentDisplay isDisplayButton={false} />

      <motion.div
        className="bg-white shadow-md rounded-lg w-full p-4 sm:p-6"
        initial="show"
        animate="show"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <h2 className="text-xl md:text-3xl font-bold">
            Trends for {startOfToday.toDateString()}
          </h2>
        </div>

        <TrendGraph data={chartData} />
      </motion.div>

      <ImageAnalysis />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import CalendarFilters from "./CalendarFilters";
import LogsTable from "./LogsTable";

function CommandLog() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendar state for the selected date (defaults to today)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Dropdown filters
  const [filterAction, setFilterAction] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // New state to toggle showing logs for all dates
  const [showAllDates, setShowAllDates] = useState(false);

  useEffect(() => {
    // Fetch data from both endpoints
    const fetchData = async () => {
      try {
        const [foggyResponse, valveResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/foggys`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/valves`),
        ]);

        if (!foggyResponse.ok || !valveResponse.ok) {
          throw new Error("HTTP error fetching foggys or valves");
        }

        const foggyData = await foggyResponse.json();
        const valveData = await valveResponse.json();

        // Map and add a property to indicate the source (Foggy or Valve)
        const mappedFoggyData = foggyData.map((item) => ({
          ...item,
          date: item.timestamp, // Use timestamp as the date
          action: "Foggy", // Mark this record as from the foggys endpoint
          duration: item.time,
          type: item.source,
        }));

        const mappedValveData = valveData.map((item) => ({
          ...item,
          date: item.timestamp,
          action: "Valve",
          duration: item.time,
          type: item.source,
        }));

        // Combine the records
        const combinedData = [...mappedFoggyData, ...mappedValveData];

        setLogs(combinedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logs based on the selected date and dropdown values;
  // if showAllDates is true, skip the date filtering.
  const filteredLogs = logs.filter((log) => {
    if (!showAllDates) {
      const logDate = new Date(log.date);
      const selectedDay = new Date(selectedDate);
      // Zero out time values for accurate date-only comparison
      logDate.setHours(0, 0, 0, 0);
      selectedDay.setHours(0, 0, 0, 0);
      if (logDate.getTime() !== selectedDay.getTime()) return false;
    }
    if (
      filterAction !== "all" &&
      log.action.toLowerCase() !== filterAction.toLowerCase()
    )
      return false;
    if (
      filterType !== "all" &&
      log.type.toLowerCase() !== filterType.toLowerCase()
    )
      return false;
    if (
      filterStatus !== "all" &&
      log.status.toLowerCase() !== filterStatus.toLowerCase()
    )
      return false;
    return true;
  });

  // Sort logs so that the latest appear at the top
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  if (loading)
    return <div className="text-center py-4 text-xl">Loading logs...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500 text-xl">
        Error fetching logs: {error}
      </div>
    );

  return (
    <div className="p-4 mx-auto space-y-6 w-full">
      <h2 className="text-xl font-bold border-b pb-2 mb-4">
        {showAllDates
          ? "All Command Logs"
          : `Command Log for ${selectedDate.toDateString()}`}
      </h2>
      {/* For small screens, this container will stack vertically. 
          For medium and larger screens, they will align side by side */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar and Filters (takes one-third width on large screens) */}
        <div className="w-full md:w-1/3">
          <CalendarFilters
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            filterAction={filterAction}
            setFilterAction={setFilterAction}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            showAllDates={showAllDates}
            setShowAllDates={setShowAllDates}
          />
        </div>
        {/* Logs Table (takes two-thirds width on large screens) */}
        <div className="w-full md:w-2/3">
          <LogsTable logs={sortedLogs} />
        </div>
      </div>
    </div>
  );
}

export default CommandLog;

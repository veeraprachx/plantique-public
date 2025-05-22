import React, { useEffect, useState } from "react";
import CalendarFilters from "./CalendarFilters";
import CommandLogsTable from "./CommandLogsTable";

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

  // Toggle showing logs for all dates
  const [showAllDates, setShowAllDates] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // build query params
        const params = new URLSearchParams();
        if (!showAllDates) {
          // clamp to midnight–23:59:59 of selectedDate
          const start = new Date(selectedDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(selectedDate);
          end.setHours(23, 59, 59, 999);

          params.append("startDate", start.toISOString());
          params.append("endDate", end.toISOString());
        }

        const qs = params.toString() ? `?${params.toString()}` : "";
        const [foggyRes, valveRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/foggys${qs}`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/valves${qs}`),
        ]);

        if (!foggyRes.ok || !valveRes.ok) {
          throw new Error("HTTP error fetching foggys or valves");
        }

        const foggyData = await foggyRes.json();
        const valveData = await valveRes.json();

        // tag each record with its source
        const mappedFoggy = foggyData.map((item) => ({
          ...item,
          date: item.timestamp,
          action: "Foggy",
          duration: item.time,
          type: item.source,
        }));
        const mappedValve = valveData.map((item) => ({
          ...item,
          date: item.timestamp,
          action: "Valve",
          duration: item.time,
          type: item.source,
        }));

        setLogs([...mappedFoggy, ...mappedValve]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, showAllDates]);

  // client‐side dropdown filtering + sorting
  const filtered = logs.filter((log) => {
    if (filterAction !== "all" && log.action.toLowerCase() !== filterAction)
      return false;
    if (filterType !== "all" && log.type.toLowerCase() !== filterType)
      return false;
    if (filterStatus !== "all" && log.status.toLowerCase() !== filterStatus)
      return false;
    return true;
  });
  const sortedLogs = [...filtered].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  if (loading)
    return <div className="text-center py-4 text-xl">Loading logs...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500 text-xl">
        Error: {error}
      </div>
    );

  return (
    <div className="p-4 mx-auto space-y-6 w-full">
      <h2 className="text-xl font-bold border-b pb-2 mb-4">
        {showAllDates
          ? "All Command Logs"
          : `Command Log for ${selectedDate.toDateString()}`}
      </h2>

      <div className="flex flex-col md:flex-row gap-6">
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

        <div className="w-full md:w-2/3">
          <CommandLogsTable logs={sortedLogs} />
        </div>
      </div>
    </div>
  );
}

export default CommandLog;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const EnvironmentInfo = () => {
  const [environmentData, setEnvironmentData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAll, setShowAll] = useState(false);
  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/environments`;

  const fetchEnvironmentData = async () => {
    try {
      const response = await axios.get(API_URL);
      setEnvironmentData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchEnvironmentData();
  }, []);

  // Handle calendar date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Filter environment data for the selected date if showAll is false
  const filteredEnvironmentData = showAll
    ? environmentData
    : environmentData.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return (
          itemDate.getFullYear() === selectedDate.getFullYear() &&
          itemDate.getMonth() === selectedDate.getMonth() &&
          itemDate.getDate() === selectedDate.getDate()
        );
      });

  // Sort environment data by date (latest on top)
  const sortedEnvironmentData = [...filteredEnvironmentData].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Flex container: Stacks vertically on small screens; side-by-side on md+ */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar Section */}
        <div className="w-full md:w-1/3 bg-white shadow p-6 rounded">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="w-full"
            disabled={showAll}
          />
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
          >
            {showAll ? "Show Selected Date" : "Show All Dates"}
          </button>
        </div>

        {/* Environment Logs Table Section */}
        <div className="w-full md:w-2/3 bg-white shadow p-6 rounded overflow-x-auto">
          <h2 className="text-base md:text-xl font-bold border-b pb-2 mb-4">
            {showAll
              ? "All Environment Logs"
              : `Environment Log for ${selectedDate.toDateString()}`}
          </h2>
          {sortedEnvironmentData.length === 0 ? (
            <p className="text-xs md:text-sm">
              No records found{" "}
              {showAll ? "." : `for ${selectedDate.toDateString()}.`}
            </p>
          ) : (
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium text-xs md:text-sm">
                    Timestamp
                  </th>
                  <th className="px-4 py-2 font-medium text-xs md:text-sm">
                    Air Temp
                  </th>
                  <th className="px-4 py-2 font-medium text-xs md:text-sm">
                    Air Humidity (%)
                  </th>
                  <th className="px-4 py-2 font-medium text-xs md:text-sm">
                    Soil Temp
                  </th>
                  <th className="px-4 py-2 font-medium text-xs md:text-sm">
                    Soil Humidity (%)
                  </th>
                  <th className="px-4 py-2 font-medium text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedEnvironmentData.map((data) => (
                  <tr key={data._id} className="border-b">
                    <td className="px-4 py-2 text-xs md:text-sm">
                      {new Date(data.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-xs md:text-sm">
                      {data.airTemp}
                    </td>
                    <td className="px-4 py-2 text-xs md:text-sm">
                      {data.airPercentHumidity}
                    </td>
                    <td className="px-4 py-2 text-xs md:text-sm">
                      {data.soilTemp}
                    </td>
                    <td className="px-4 py-2 text-xs md:text-sm">
                      {data.soilPercentHumidity}
                    </td>
                    <td className="px-4 py-2 space-x-2 text-xs md:text-sm">
                      <button
                        onClick={() => console.log("Delete", data._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentInfo;

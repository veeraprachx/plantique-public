import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarFilters({
  selectedDate,
  setSelectedDate,
  filterAction,
  setFilterAction,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  showAllDates,
  setShowAllDates,
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Calendar Section */}
      <div className="flex-shrink-0">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          className="mx-auto"
          // Disable the calendar when showing all dates
          disabled={showAllDates}
        />
      </div>
      {/* Toggle button to switch between selected date and all dates */}
      <button
        onClick={() => setShowAllDates(!showAllDates)}
        className="mt-4 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
      >
        {showAllDates ? "Show Selected Date" : "Show All Dates"}
      </button>
      {/* Filters Section (aligned horizontally on larger screens) */}
      <div className="flex flex-row gap-4 w-full justify-center">
        <div className="w-full md:w-24">
          <label className="block text-sm font-medium text-gray-800">
            Action
          </label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="mt-1 block w-full border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="all">All</option>
            <option value="Foggy">Foggy</option>
            <option value="Valve">Valve</option>
          </select>
        </div>
        <div className="w-full md:w-24">
          <label className="block text-sm font-medium text-gray-800">
            Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="mt-1 block w-full border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="all">All</option>
            <option value="automatic">automatic</option>
            <option value="manual">manual</option>
          </select>
        </div>
        <div className="w-full md:w-24">
          <label className="block text-sm font-medium text-gray-800">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="mt-1 block w-full border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="all">All</option>
            <option value="pending">pending</option>
            <option value="complete">complete</option>
            <option value="fail">fail</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default CalendarFilters;

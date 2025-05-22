import React from "react";

export default function EnvironmentLogTable({ records }) {
  return (
    <div className="bg-white shadow-md rounded-lg w-full p-4 sm:p-6 overflow-x-auto">
      {records.length ? (
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Air Temp</th>
              <th className="px-4 py-2">Air Humidity (%)</th>
              <th className="px-4 py-2">Soil Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="px-4 py-2 text-sm">
                  {new Date(d.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Number(d.airTemp).toFixed(1)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Number(d.airPercentHumidity).toFixed(1)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {Number(d.soilPercentHumidity).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No records found</p>
      )}
    </div>
  );
}

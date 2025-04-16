import React from "react";

function LogsTable({ logs, handleDelete }) {
  return (
    <div>
      {/* Table layout for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-medium  uppercase break-words">
                Timestamp
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium  uppercase break-words">
                Action
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium  uppercase break-words">
                Duration
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium textuppercase break-words">
                Type
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium  uppercase break-words">
                Status
              </th>
              <th className="px-2 py-2 text-left text-xs font-medium  uppercase break-words">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="px-2 py-2 whitespace-normal break-words">
                  {new Date(log.date).toLocaleString()}
                </td>
                <td className="px-2 py-2 whitespace-normal break-words">
                  {log.action}
                </td>
                <td className="px-2 py-2 whitespace-normal break-words">
                  {log.duration}
                </td>
                <td className="px-2 py-2 whitespace-normal break-words">
                  {log.type}
                </td>
                <td className="px-2 py-2 whitespace-normal break-words">
                  {log.status}
                </td>
                <td className="px-2 py-2 whitespace-normal break-words">
                  <button
                    onClick={() => handleDelete(log._id, log.action)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="block md:hidden space-y-4">
        {logs.map((log) => (
          <div key={log._id} className="p-4 bg-white shadow rounded">
            <p className="text-sm text-gray-800">
              <strong>Timestamp:</strong> {new Date(log.date).toLocaleString()}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Action:</strong> {log.action}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Duration:</strong> {log.duration}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Type:</strong> {log.type}
            </p>
            <p className="text-sm text-gray-800">
              <strong>Status:</strong> {log.status}
            </p>
            <button
              onClick={() => handleDelete(log._id, log.action)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogsTable;

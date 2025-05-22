import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function TrendGraph({ data = [], showAll = false }) {
  // compute today’s bounds if you ever need them
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  // you’re passing in pre-filtered data, so we just use it
  const filteredData = data;

  // blank placeholder if no data
  if (filteredData.length === 0) {
    return <div className="w-full h-[300px]" />;
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(ts) =>
              showAll
                ? new Date(ts).toLocaleDateString()
                : new Date(ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
            }
            tick={{ fontSize: 12 }}
            tickMargin={8}
            interval="preserveStartEnd"
          />

          <YAxis tick={{ fontSize: 12 }} />

          <Tooltip labelFormatter={(ts) => new Date(ts).toLocaleString()} />

          <Line
            type="monotone"
            dataKey="airTemp"
            name="Air Temp (°C)"
            stroke="#FF0000"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="airHumidity"
            name="Air Humidity (%)"
            stroke="#0000FF"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="soilHumidity"
            name="Soil Humidity (%)"
            stroke="#00AA00"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* custom legend, inside the component */}
      <div className="flex flex-wrap justify-center gap-6 mt-3 px-2">
        <LegendItem color="#FF0000" label="Air Temp (°C)" />
        <LegendItem color="#0000FF" label="Air Humidity (%)" />
        <LegendItem color="#00AA00" label="Soil Humidity (%)" />
      </div>
    </div>
  );
}

// small helper for legend entries
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center space-x-1">
      <span
        className="w-3 h-3 rounded-full block"
        style={{ backgroundColor: color }}
      />
      <span className={`text-${color}-500 text-sm`}>{label}</span>
    </div>
  );
}

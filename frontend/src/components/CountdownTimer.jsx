import React from "react";

/** Simple digital countdown.
 *  – props.secondsLeft   : current number of seconds remaining
 *  – props.interval      : max seconds (14 in your case) – lets us show a bar %
 */
const CountdownTimer = ({ secondsLeft = 0, interval = 14 }) => {
  const pct = (secondsLeft / interval) * 100;

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">
          Next update in
        </span>
        <span className="text-sm font-semibold tabular-nums text-gray-900">
          {secondsLeft}s
        </span>
      </div>

      <div className="w-full h-3 bg-emerald-500 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-200 transition-[width] duration-1000"
          style={{ width: `${pct}%`, marginLeft: "auto" }}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;

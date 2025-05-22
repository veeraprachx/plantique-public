import React from "react";
import CommandControl from "./CommandControl";
import EnvironmentDisplay from "./EnvironmentDisplay";

function MonitorControl() {
  return (
    <div className="p-1 space-y-10">
      {/* Environment Display Section */}
      <div className="">
        <EnvironmentDisplay />
      </div>

      {/* Command Controls Section */}
      <div className="w-full">
        <CommandControl endpoint="/foggys" title="Foggy Command" />
      </div>
      <div className="w-full">
        <CommandControl endpoint="/valves" title="Water Command" />
      </div>
    </div>
  );
}

export default MonitorControl;

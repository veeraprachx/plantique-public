const Valve = require("../models/valveModel");
const Foggy = require("../models/foggyModel");
const AutomationConfig = require("../models/automationConfigModel");

async function processSensorData(payload) {
  const { airTemp, airPercentHumidity, soilPercentHumidity } = payload;

  const { autoWateringEnabled, autoFoggingEnabled } =
    (await AutomationConfig.findOne()) || {};

  const soilHumidityThresh = 75;
  //   const airTempThresh = 35;
  const airHumidityThresh = 55;

  console.log("autoWateringEnabled: ", autoWateringEnabled);
  console.log("autoFoggingEnabled: ", autoFoggingEnabled);

  if (autoWateringEnabled && soilPercentHumidity < soilHumidityThresh) {
    await Valve.updateMany({ status: "pending" }, { $set: { status: "fail" } });

    const newValve = new Valve({ time: 30000, source: "model" });
    await newValve.save();

    console.log("newValve from model: ", newValve);
  } else if (autoFoggingEnabled && airPercentHumidity < airHumidityThresh) {
    await Foggy.updateMany({ status: "pending" }, { $set: { status: "fail" } });

    const newFoggy = new Foggy({ time: 30000, source: "model" });
    await newFoggy.save();

    console.log("newFoggy from model (air humidity too low): ", newFoggy);
  }

  //   if (airTemp > airTempThresh) {
  //     const newFoggy = new Foggy({ time: 60000, source: "Model" });
  //     // await newFoggy.save();
  //     console.log("newFoggy from model (Air temperature too high): ", newFoggy);
  //   } else
}

module.exports = { processSensorData };

const Environment = require("../models/environmentModel");
const { spawn } = require("child_process");
const { broadcastEnvironmentUpdate } = require("../websocket");

// Create new environmentInfo
exports.createEnvironment = async (req, res) => {
  try {
    const docsToDelete = await Environment.find({}).sort({ _id: -1 }).skip(10);

    if (docsToDelete.length > 0) {
      const idsToDelete = docsToDelete.map((doc) => doc._id);
      await Environment.deleteMany({ _id: { $in: idsToDelete } });
    }
    const { airTemp, airPercentHumidity, soilTemp, soilPercentHumidity } =
      req.body;

    const newEnvironmentInfo = new Environment({
      airTemp,
      airPercentHumidity,
      soilTemp,
      soilPercentHumidity,
    });

    const savedData = await newEnvironmentInfo.save();
    res.status(201).json({
      message: "Environment info created successfully",
      data: savedData,
    });
    console.log("test1");
    broadcastEnvironmentUpdate(savedData);
    console.log("test2");
  } catch (error) {
    res.status(500).json({ message: "Error creating environment info", error });
  }
};

// Read all environmentInfo
exports.getAllEnvironment = async (req, res) => {
  try {
    const data = await Environment.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching environment info", error });
  }
};

// Read a single environmentInfo by ID
exports.getEnvironmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Environment.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Environment info not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching environment info", error });
  }
};

// Update environmentInfo by ID
exports.updateEnvironment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = await Environment.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ message: "Environment info not found" });
    }

    res.status(200).json({
      message: "Environment info updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating environment info", error });
  }
};

// Delete environmentInfo by ID
exports.deleteEnvironment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedData = await Environment.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ message: "Environment info not found" });
    }

    res.status(200).json({ message: "Environment info deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting environment info", error });
  }
};

// Integrate Python mock model
exports.getMockSumAndLog = (req, res) => {
  const { airTemp, airPercentHumidity, soilTemp, soilPercentHumidity } =
    req.body;

  // Spawn a Python process
  const python = spawn("python3", ["python_model/mock_model.py"]);

  // Send JSON data to the Python script
  python.stdin.write(
    JSON.stringify({
      airTemp,
      airPercentHumidity,
      soilTemp,
      soilPercentHumidity,
    })
  );
  python.stdin.end();

  // Handle the response from the Python script
  python.stdout.on("data", (data) => {
    const result = JSON.parse(data.toString());
    console.log("Python Script Result:", result); // Log the result to the console
    res.status(200).json(result); // Send the result back to the client
  });

  // Handle errors from the Python script
  python.stderr.on("data", (data) => {
    console.error(`Python Error: ${data}`);
    res.status(500).json({
      message: "Error executing Python script",
      error: data.toString(),
    });
  });

  // Handle script exit
  python.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
    }
  });
};

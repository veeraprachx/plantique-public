// const mqtt = require("mqtt");
// const Fan = require("../models/fanModel");
// const Foggy = require("../models/foggyModel");
// const Valve = require("../models/valveModel");
// const Log = require("../models/logModel");

// const brokerUrl = "mqtt://broker.hivemq.com";
// const Topic = "plantique/cGxhbnRpcXVl"; // used for receiving data
// const commandTopic = "plantique/commands/cGxhbnRpcXVl"; // used for sending commands
// const ackTopic = "plantique/ack/cGxhbnRpcXVl"; // ack topic from Arduino

// const client = mqtt.connect(brokerUrl);

// // --- Retry mechanism variables ---
// // pendingCommands now also holds the log _id for the command.
// const pendingCommands = {
//   fan: null,
//   foggy: null,
//   valve: null,
// };

// const retryInterval = 2000; // Retry every 2 seconds
// const maxRetries = 30; // Maximum number of retries

// client.on("connect", () => {
//   console.log(`✅ Connected to MQTT, subscribing to: ${Topic}`);
//   client.subscribe(Topic);
//   client.subscribe(commandTopic);
//   client.subscribe(ackTopic);
// });

// // Listen for incoming MQTT messages
// client.on("message", async (receivedTopic, message) => {
//   try {
//     const data = JSON.parse(message.toString());

//     // Process ACK messages from Arduino
//     if (receivedTopic === ackTopic) {
//       if (data.context && pendingCommands[data.context]) {
//         // Clear the retry timer for this context.
//         clearTimeout(pendingCommands[data.context].timer);
//         console.log(
//           `${data.context} command ACK received. Clearing pending command.`
//         );

//         // Retrieve the log _id saved during the publish.
//         const logId = pendingCommands[data.context].logId;
//         // Clear pending command.
//         pendingCommands[data.context] = null;

//         // Update the corresponding command document status to "complete"
//         const modelMapping = { fan: Fan, foggy: Foggy, valve: Valve };
//         const Model = modelMapping[data.context];
//         if (Model) {
//           Model.findOneAndUpdate(
//             { status: "pending" },
//             { status: "complete" },
//             { sort: { timestamp: -1 } }
//           )
//             .then((doc) => {
//               console.log(`${data.context} command updated to complete:`, doc);
//             })
//             .catch((err) => {
//               console.error(`Error updating ${data.context} status:`, err);
//             });
//         }

//         // Also update the log entry's status to "complete"
//         if (logId) {
//           Log.findByIdAndUpdate(logId, { status: "complete" })
//             .then((updatedLog) => {
//               console.log(
//                 `${data.context} log updated to complete:`,
//                 updatedLog
//               );
//             })
//             .catch((err) => {
//               console.error(`Error updating ${data.context} log status:`, err);
//             });
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error parsing JSON:", error.message);
//   }
// });

// // Original basic publish function
// const publishMessage = (topic, message) => {
//   if (client.connected) {
//     client.publish(topic, JSON.stringify(message));
//     console.log(`📡 Published to ${topic}:`, message);
//   } else {
//     console.error("❌ MQTT client not connected");
//   }
// };

// /**
//  * Generic publishWithRetry function for any command type.
//  * It now also creates a log entry for the command and later updates its status.
//  * @param {string} context - The command context ('fan', 'foggy', or 'valve').
//  * @param {string} topic - The MQTT topic.
//  * @param {Object} message - The message payload.
//  */
// const publishWithRetry = (context, topic, message) => {
//   // Set up a pending command for the given context.
//   pendingCommands[context] = {
//     topic,
//     message,
//     retries: 0,
//     timer: null,
//     logId: null, // This will store the _id of the log entry.
//   };

//   // Create a log entry with status "pending"
//   const logData = {
//     action: context.charAt(0).toUpperCase() + context.slice(1), // "Fan", "Foggy", or "Valve"
//     duration: message.contextData.time || 0, // Adjust based on your message structure
//     type: "manual",
//     status: "pending",
//   };
//   Log.create(logData)
//     .then((log) => {
//       pendingCommands[context].logId = log._id;
//       console.log(`${context} log created:`, log);
//     })
//     .catch((err) => {
//       console.error(`Error creating log entry for ${context} command:`, err);
//     });

//   const modelMapping = { fan: Fan, foggy: Foggy, valve: Valve };

//   const attemptPublish = () => {
//     if (!client.connected) {
//       console.error(
//         `❌ MQTT client not connected for ${context} command. Will retry.`
//       );
//     } else {
//       publishMessage(topic, message);
//     }
//     pendingCommands[context].retries++;

//     if (pendingCommands[context].retries >= maxRetries) {
//       console.error(`Max retries reached for ${context} command:`, message);
//       // Update the database status to "fail" for the command document.
//       const Model = modelMapping[context];
//       if (Model) {
//         Model.findOneAndUpdate(
//           { status: "pending" },
//           { status: "fail" },
//           { sort: { timestamp: -1 } }
//         )
//           .then((doc) => {
//             console.log(`${context} command updated to fail:`, doc);
//           })
//           .catch((err) => {
//             console.error(`Error updating ${context} status to fail:`, err);
//           });
//       }
//       // Also update the log entry status to "fail"
//       if (pendingCommands[context] && pendingCommands[context].logId) {
//         Log.findByIdAndUpdate(pendingCommands[context].logId, {
//           status: "fail",
//         })
//           .then((updatedLog) => {
//             console.log(`${context} log updated to fail:`, updatedLog);
//           })
//           .catch((err) => {
//             console.error(`Error updating ${context} log status to fail:`, err);
//           });
//       }
//       pendingCommands[context] = null;
//       return;
//     }

//     pendingCommands[context].timer = setTimeout(() => {
//       if (pendingCommands[context]) {
//         attemptPublish();
//       }
//     }, retryInterval);
//   };

//   attemptPublish();
// };

// // Convenience wrappers for each command type:
// const publishWithRetryFan = (topic, message) => {
//   publishWithRetry("fan", topic, message);
// };

// const publishWithRetryFoggy = (topic, message) => {
//   publishWithRetry("foggy", topic, message);
// };

// const publishWithRetryValve = (topic, message) => {
//   publishWithRetry("valve", topic, message);
// };

// module.exports = {
//   client,
//   publishMessage,
//   publishWithRetryFan,
//   publishWithRetryFoggy,
//   publishWithRetryValve,
// };

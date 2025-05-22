// websocket.js
const WebSocket = require("ws");

let wss = null;

// Initialize the WebSocket server
function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
  });
}

// Broadcast helper function
function broadcastEnvironmentUpdate(data) {
  if (!wss) return;
  const message = {
    path: "/environmentData",
    data,
  };
  console.log("message: ", message);
  // Send to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

function broadcastCountdown(secondsLeft) {
  if (!wss) return;
  const msg = JSON.stringify({ path: "/countdown", secondsLeft });
  for (const ws of wss.clients) ws.send(msg); // whatever your client list is called
}

module.exports = {
  initWebSocket,
  broadcastEnvironmentUpdate,
  broadcastCountdown,
};

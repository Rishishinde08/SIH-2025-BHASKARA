// import app from "./app.js";
// import { connectDB } from "./config/db.js";
// import dotenv from "dotenv";
// import http from "http";
// import { initSocket } from "./utils/socket.js";
// import alertRoutes from "./routes/alertRoutes.js";
// import History from "./models/History.js";

// dotenv.config();
// connectDB();

// const PORT = process.env.PORT || 5000;

// // API Routes
// app.use("/api/alerts", alertRoutes);

// const server = http.createServer(app);

// // Initialize Socket.io
// const io = initSocket(server);

// // Store latest live data globally
// global.liveData = null;

// // =========================
// // 🔥 REAL-TIME SENSOR HANDLER
// // =========================
// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);

//   // 🔥 When sensor sends data
//   socket.on("sensor_data", (data) => {
//     console.log("Received SENSOR DATA:", data);

//     // Store last live data for snapshot
//     global.liveData = data;

//     // Save directly to History for Trend Chart
//     const entry = new History({
//       voltage: data.voltage ?? null,
//       current: data.current ?? null,
//       frequency: data.frequency ?? null,
//       temperature: data.temperature ?? null,
//       timestamp: new Date()
//     });

//     entry.save().then(() => {
//       console.log("History Updated (Live)");
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

// // ===================================================
// // 🔥 1-MINUTE SNAPSHOT SYSTEM (Optional)
// // ===================================================

// let lastSnapshot = Date.now();

// function saveHistorySnapshot(liveData) {
//   const entry = new History({
//     voltage: liveData.voltage,
//     current: liveData.current,
//     frequency: liveData.frequency,
//     temperature: liveData.temperature,
//     timestamp: new Date()
//   });

//   entry.save().then(() => {
//     console.log("Saved 1-minute snapshot");
//   });
// }

// // Every 10 seconds → check if 1 minute passed
// setInterval(() => {
//   if (global.liveData && Date.now() - lastSnapshot >= 60000) {
//     saveHistorySnapshot(global.liveData);
//     lastSnapshot = Date.now();
//   }
// }, 10000);

// // =========================
// // Start Server
// // =========================
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



//----------------------


import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./utils/socket.js";
import alertRoutes from "./routes/alertRoutes.js";
import History from "./models/History.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api/alerts", alertRoutes);

const server = http.createServer(app);
const io = initSocket(server);

// store last live data
global.liveData = null;

// -------------------------------
// 🔥 REAL-TIME SENSOR HANDLER
// -------------------------------
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Sensor Data Receive
  socket.on("sensor_data", async (data) => {
    console.log("Received SENSOR DATA:", data);

    global.liveData = data;

    // Save to MongoDB (History)
    await History.create({
      voltage: data.voltage,
      current: data.current,
      frequency: data.frequency,
      temperature: data.temperature,
      timestamp: new Date()
    });

    console.log("History Updated");

    // 🔥 SEND LIVE DATA TO FRONTEND
    io.emit("sensor_data", { reading: data });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// -------------------------------
// 🔥 1-MIN SNAPSHOT SYSTEM
// -------------------------------
let lastSnapshot = Date.now();

setInterval(() => {
  if (global.liveData && Date.now() - lastSnapshot >= 60000) {
    History.create({
      voltage: global.liveData.voltage,
      current: global.liveData.current,
      frequency: global.liveData.frequency,
      temperature: global.liveData.temperature,
      timestamp: new Date(),
    });

    console.log("1-minute snapshot saved");
    lastSnapshot = Date.now();
  }
}, 10000);

// -------------------------------
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

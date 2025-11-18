// // // backend/src/utils/socket.js
// // import { Server } from "socket.io";

// // let io = null;

// // export function initSocket(server) {
// //   io = new Server(server, {
// //     cors: {
// //       origin: ["http://localhost:5173"], // frontend URL
// //       methods: ["GET", "POST"],
// //     },
// //   });

// //   io.on("connection", (socket) => {
// //     console.log("Socket client connected:", socket.id);

// //     socket.on("disconnect", () => {
// //       console.log("Socket disconnected:", socket.id);
// //     });
// //   });

// //   return io;
// // }

// // export function getIO() {
// //   if (!io) {
// //     throw new Error("Socket.io not initialized - call initSocket(server) first.");
// //   }
// //   return io;
// // }


// //_______________________

// // backend/src/utils/socket.js
// import { Server } from "socket.io";
// import History from "../models/History.js";

// let io = null;

// export function initSocket(server) {
//   io = new Server(server, {
//     cors: {
//       origin: ["http://localhost:5173"],
//       methods: ["GET", "POST"],
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket client connected:", socket.id);

//     // 🔥🔥 MAIN LISTENER — YOUR DATA RECEIVED HERE
//     socket.on("sensor_data", async (data) => {
//       console.log("Received SENSOR DATA:", data);

//       // Save latest live data
//       global.liveData = data;

//       // Insert into History for Trend Chart
//       await History.create({
//         voltage: data.voltage ?? null,
//         current: data.current ?? null,
//         frequency: data.frequency ?? null,
//         temperature: data.temperature ?? null,
//         timestamp: new Date()
//       });

//       console.log("History Updated (Live)");
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//     });
//   });

//   return io;
// }

// export function getIO() {
//   if (!io) throw new Error("Socket.io not initialized!");
//   return io;
// }







// backend/src/utils/socket.js
import { Server } from "socket.io";
import History from "../models/History.js";

let io = null;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket client connected:", socket.id);

    // MAIN SENSOR LISTENER
    socket.on("sensor_data", async (data) => {
      console.log("Received SENSOR DATA:", data);

      // store globally for 1-minute snapshot
      global.liveData = data;

      // Save in History collection
      await History.create({
        voltage: data.voltage,
        current: data.current,
        frequency: data.frequency,
        temperature: data.temperature,
        timestamp: new Date(),
      });

      console.log("History Updated (LIVE)");

      // 🚀 SEND LIVE DATA TO ALL FRONTEND CLIENTS
      io.emit("sensor_data", { reading: data });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

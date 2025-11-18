// import express from "express";
// import SensorReading from "../models/SensorReading.js";

// const router = express.Router();

// router.get("/latest", async (req, res) => {
//   try {
//     const latest = await SensorReading.find().sort({ timestamp: -1 }).limit(20);
//     res.json(latest);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;



// import express from "express";
// import SensorReading from "../models/SensorReading.js";

// const router = express.Router();

// // Fetch alerts from last 10 minutes
// router.get("/active", async (req, res) => {
//   try {
//     const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);

//     const readings = await SensorReading.find({
//       timestamp: { $gte: tenMinAgo }
//     }).sort({ timestamp: -1 });

//     const alerts = [];

//     readings.forEach((r) => {
//       if (r.type === "voltage" && r.value > 135) {
//         alerts.push({
//           msg: "Over Voltage Detected",
//           sensor: r.sensorId,
//           severity: "high",
//           time: r.timestamp,
//         });
//       }

//       if (r.type === "current" && r.value > 240) {
//         alerts.push({
//           msg: "Over Current Flow",
//           sensor: r.sensorId,
//           severity: "medium",
//           time: r.timestamp,
//         });
//       }

//       if (r.type === "temperature" && r.value > 65) {
//         alerts.push({
//           msg: "Transformer Overheating",
//           sensor: r.sensorId,
//           severity: "critical",
//           time: r.timestamp,
//         });
//       }

//       if (r.type === "breaker_status" && r.value === 0) {
//         alerts.push({
//           msg: "Breaker Open — Possible Fault",
//           sensor: r.sensorId,
//           severity: "high",
//           time: r.timestamp,
//         });
//       }
//     });

//     res.json(alerts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;






import express from "express";
import SensorReading from "../models/SensorReading.js";

const router = express.Router();

// Fetch alerts from last 10 minutes
router.get("/active", async (req, res) => {
  try {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);

    const readings = await SensorReading.find({
      timestamp: { $gte: tenMinAgo }
    }).sort({ timestamp: -1 });

    const alerts = [];

    readings.forEach((r) => {
      if (r.type === "voltage" && r.value > 135) {
        alerts.push({
          msg: "Over Voltage Detected",
          sensor: r.sensorId,
          severity: "high",
          time: r.timestamp,
        });
      }

      if (r.type === "current" && r.value > 240) {
        alerts.push({
          msg: "Over Current Flow",
          sensor: r.sensorId,
          severity: "medium",
          time: r.timestamp,
        });
      }

      if (r.type === "temperature" && r.value > 65) {
        alerts.push({
          msg: "Transformer Overheating",
          sensor: r.sensorId,
          severity: "critical",
          time: r.timestamp,
        });
      }

      if (r.type === "breaker_status" && r.value === 0) {
        alerts.push({
          msg: "Breaker Open — Possible Fault",
          sensor: r.sensorId,
          severity: "high",
          time: r.timestamp,
        });
      }
    });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

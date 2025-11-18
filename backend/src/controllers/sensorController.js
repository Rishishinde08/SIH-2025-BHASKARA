// import SensorReading from "../models/SensorReading.js";

// export const addReading = async (req, res) => {
//   try {
//     const reading = await SensorReading.create(req.body);
//     res.json({ success: true, reading });
//   } catch (err) {
//     res.status(500).json({ success: false, msg: err.message });
//   }
// };

// export const getReadings = async (req, res) => {
//   try {
//     const data = await SensorReading.find().sort({ timestamp: -1 });
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };



// import SensorReading from "../models/SensorReading.js";
// import { checkAlerts } from "../utils/alertEngine.js";

// export const addSensorData = async (req, res) => {
//   try {
//     const reading = await SensorReading.create(req.body);

//     // Check alerts
//     const alerts = checkAlerts(reading);

//     return res.status(201).json({
//       success: true,
//       reading,
//       alerts,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

//---------------------------------------------

// import SensorReading from "../models/SensorReading.js";
// import { checkAlerts } from "../utils/alertEngine.js";

// /**
//  * Add new sensor reading + check alerts
//  */
// export const addSensorData = async (req, res) => {
//   try {
//     const reading = await SensorReading.create({
//       ...req.body,
//       timestamp: req.body.timestamp || Date.now(), // ensure timestamp exists
//     });

//     const alerts = checkAlerts(reading);

//     return res.status(201).json({
//       success: true,
//       reading,
//       alerts,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };

// /**
//  * Fetch all readings (latest first)
//  */
// export const getReadings = async (req, res) => {
//   try {
//     const data = await SensorReading.find().sort({ timestamp: -1 });

//     return res.json({
//       success: true,
//       count: data.length,
//       data,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// };


//--------------------------------------

// // backend/src/controllers/sensorController.js
// import SensorReading from "../models/SensorReading.js";
// import { checkAlerts } from "../utils/alertEngine.js";
// import { getIO } from "../utils/socket.js";

// export const addSensorData = async (req, res) => {
//   try {
//     const reading = await SensorReading.create(req.body);

//     // Check alerts
//     const alerts = checkAlerts(reading);

//     // Emit sensor data to all connected socket clients
//     try {
//       const io = getIO();
//       io.emit("sensor_data", { reading });
//       if (alerts && alerts.length > 0) {
//         // emit each alert (or emit alerts array)
//         io.emit("alerts", alerts);
//       }
//     } catch (socketErr) {
//       console.warn("Socket emit failed:", socketErr.message);
//     }

//     return res.status(201).json({
//       success: true,
//       reading,
//       alerts,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


//__________________________________


// backend/src/controllers/sensorController.js
import SensorReading from "../models/SensorReading.js";
import { checkAlerts } from "../utils/alertEngine.js";
import { getIO } from "../utils/socket.js";

export const addSensorData = async (req, res) => {
  try {
    // const reading = await SensorReading.create(req.body);

    const reading = await SensorReading.create({
  ...req.body,
  timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date()
});


    // Check alerts
    const alerts = checkAlerts(reading);

    // Emit sensor data to all connected socket clients
    try {
      const io = getIO();
      io.emit("sensor_data", { reading });

      if (alerts && alerts.length > 0) {
        io.emit("alerts", alerts);
      }
    } catch (socketErr) {
      console.warn("Socket emit failed:", socketErr.message);
    }

    return res.status(201).json({
      success: true,
      reading,
      alerts,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ MISSING FUNCTION ADDED — REQUIRED BY ROUTES
export const getReadings = async (req, res) => {
  try {
    const data = await SensorReading.find().sort({ timestamp: -1 });

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

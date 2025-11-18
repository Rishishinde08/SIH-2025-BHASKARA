import axios from "axios";

// Backend endpoint
const API_URL = "http://localhost:5000/api/sensors/add";

// Random generator function
function generateSensorData() {
  const sensors = [
    {
      sensorId: "VLT-132KV-01",
      type: "voltage",
      value: (Math.random() * 10 + 128).toFixed(2), // 128kV–138kV
      unit: "kV",
    },
    {
      sensorId: "CUR-TX1-01",
      type: "current",
      value: (Math.random() * 50 + 200).toFixed(2), // 200A–250A
      unit: "A",
    },
    {
      sensorId: "TMP-TX1-01",
      type: "temperature",
      value: (Math.random() * 5 + 60).toFixed(2), // 60°C–65°C
      unit: "°C",
    },
    {
      sensorId: "BRK-01",
      type: "breaker_status",
      value: Math.random() > 0.9 ? 0 : 1, // 1 = closed, 0 = open
      unit: "",
    },
  ];

  return sensors[Math.floor(Math.random() * sensors.length)];
}

// Send data to backend every 5 seconds
setInterval(async () => {
  const data = generateSensorData();

  try {
    const res = await axios.post(API_URL, data);
    console.log("✔ Data Sent:", res.data.reading);
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
}, 5000);

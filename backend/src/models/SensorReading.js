import mongoose from "mongoose";

const SensorReadingSchema = new mongoose.Schema({
  sensorId: String,
  type: String,
  value: Number,
  unit: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("SensorReading", SensorReadingSchema);

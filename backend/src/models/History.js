import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  voltage: Number,
  current: Number,
  frequency: Number,
  temperature: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("History", historySchema);

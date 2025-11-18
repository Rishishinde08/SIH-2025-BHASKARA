import express from "express";
import History from "../models/History.js";

const router = express.Router();

router.get("/last10", async (req, res) => {
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);

  const data = await History.find({
    timestamp: { $gte: tenMinAgo },
  }).sort({ timestamp: 1 });

  res.json(data);
});

export default router;

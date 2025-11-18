import express from "express";
import { addSensorData, getReadings } from "../controllers/sensorController.js";

const router = express.Router();

router.post("/add", addSensorData);
router.get("/all", getReadings);

export default router;

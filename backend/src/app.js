import express from "express";
import cors from "cors";
import sensorRoutes from "./routes/sensorRoutes.js";

import historyRoutes from "./routes/history.js";



const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/sensors", sensorRoutes);
app.use("/api/history", historyRoutes);

export default app;

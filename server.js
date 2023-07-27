import express from "express";
import { config } from "dotenv";

import authRoutes from "./routes/auth";

config();

const app = express();

app.use(express.json());

app.use("/api", authRoutes);



const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}...`))
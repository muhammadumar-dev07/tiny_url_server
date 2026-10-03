import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns/promises";
import { connectDB } from "./Utils/DB.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

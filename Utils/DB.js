import mongoose from "mongoose";
import dotenv from "dotenv";
import { Users } from "../model/user.js";

dotenv.config();

async function connectDB() {
    return mongoose.connect(process.env.MONGO_URI)
        .then(async () => {
            await Users.init();
            console.log("MongoDB connected");
        })
        .catch((error) => {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        });
}

export { connectDB };
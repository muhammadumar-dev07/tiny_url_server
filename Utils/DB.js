import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((error) => {
            console.error("MongoDB connection failed:", error);
            process.exit(1);
        });
}

export { connectDB };
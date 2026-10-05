import mongoose from "mongoose";

const URLSchema = mongoose.Schema({
  ShortId: {
    type: String,
    required: true,
    unique: true,
  },
  LongUrl: {
    type: String,
    required: true,
  },
});

export const URLs = mongoose.model("urls", URLSchema);


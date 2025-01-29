import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    deviceId: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
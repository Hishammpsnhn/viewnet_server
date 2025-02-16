import mongoose, { Document } from "mongoose";

export interface IWatchTime extends Document {
    userId: string;
    date: string;
    watchTime: number;
}

const WatchTimeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: String, required: true },
    watchTime: { type: Number, default: 0 },
});

export default mongoose.model<IWatchTime>("WatchTime", WatchTimeSchema);

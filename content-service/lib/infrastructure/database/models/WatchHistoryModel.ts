import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the WatchHistory document
interface IWatchHistory extends Document {
  profileId: mongoose.Types.ObjectId;
  videoCatalogId: mongoose.Types.ObjectId;
  progress: number;
  completed: boolean;
  timestamp: Date;
}

// Define the schema for WatchHistory
const historySchema = new Schema<IWatchHistory>(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    videoCatalogId: { type: Schema.Types.ObjectId, ref:"VideoMetadata", required: true },
    progress: { type: Number, required: true },
    completed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

// Create and export the model
const HistoryModel = mongoose.model<IWatchHistory>("WatchHistory", historySchema);

export default HistoryModel;

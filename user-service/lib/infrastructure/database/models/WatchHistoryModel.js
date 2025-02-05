import mongoose, { Schema } from "mongoose";

const historySchema = new mongoose.Schema(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    videoCatalogId: { type: Schema.Types.ObjectId, required: true },
    progress: { type: Number, required: true },
    completed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const HistoryModel = mongoose.model("WatchHistory", historySchema);
export default HistoryModel;
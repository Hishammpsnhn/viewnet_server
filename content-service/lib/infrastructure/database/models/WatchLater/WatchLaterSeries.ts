import mongoose, { Schema, Document } from "mongoose";

interface IWatchLaterMovies extends Document {
  profileId: mongoose.Types.ObjectId;
  videoCatalogId: mongoose.Types.ObjectId;

}

const watchLaterSeries = new Schema<IWatchLaterMovies>(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    videoCatalogId: { type: Schema.Types.ObjectId, ref:"Series", required: true },
  },
  { timestamps: true }
);

const WatchLaterSeries = mongoose.model<IWatchLaterMovies>("WatchLaterSeries", watchLaterSeries);

export default WatchLaterSeries;

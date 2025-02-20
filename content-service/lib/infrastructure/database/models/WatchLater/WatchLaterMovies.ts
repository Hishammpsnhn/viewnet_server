import mongoose, { Schema, Document } from "mongoose";

interface IWatchLaterMovies extends Document {
  profileId: mongoose.Types.ObjectId;
  videoCatalogId: mongoose.Types.ObjectId;

}

const watchLater = new Schema<IWatchLaterMovies>(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    videoCatalogId: { type: Schema.Types.ObjectId, ref:"VideoMetadata", required: true },
  },
  { timestamps: true }
);

const WatchLaterMovies = mongoose.model<IWatchLaterMovies>("WatchLaterMovies", watchLater);

export default WatchLaterMovies;

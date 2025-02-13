import mongoose from "mongoose";

const LiveDetailSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    genre: {
      type: String,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    assetsId:{
        type:String,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      default:
        "https://imgs.search.brave.com/lFmIdbtyx0VLQm_SvDAGFuB4KkjposzTHWQcZH-A7tU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWRzLnNpdGVwb2lu/dC5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjMvMDgvMTY5/Mjc4MTM5N2ZhbGxi/YWNrLnN2Zw",
    },
    streamId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const LiveMetaDataModel = mongoose.model("LiveDetail", LiveDetailSchema);

export default LiveMetaDataModel;

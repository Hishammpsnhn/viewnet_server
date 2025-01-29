import mongoose from "mongoose";
const { Schema } = mongoose;

// Profile schema
const ProfilesSchema = new mongoose.Schema(
  {
    isAdult: { type: Boolean, required: true },
    username: { type: String, required: true },
    profilePic: { type: String, required: true },
    watchHistory: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profiles: [ProfilesSchema],  
    subscription: { type: Schema.Types.ObjectId },
    defaultProfile:{type:Schema.Types.ObjectId},
    isAdmin: { type: Boolean, default: false, required: true },
    isBlock: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

import mongoose from "mongoose";
const { Schema } = mongoose;

const userSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    plan: { type: String, required: true },
    sessionLimit: { type: Number, required: true, default: 1 },
    status: {
      type: String,
      enum: ["active", "queued", "expired"],
      default: "queued",
    },
    uhd: { type: Boolean, default: false },
    live: { type: Boolean, default: false },
    ads: { type: Boolean, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const UserSubscriptionModel = mongoose.model(
  "Subscription",
  userSubscriptionSchema
);

export default UserSubscriptionModel;

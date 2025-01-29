import mongoose from "mongoose";
const { Schema } = mongoose;

const subscriptionTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, //eg:basic
    description: { type: String },
    price: { type: Number, required: true },
    sessionLimit: { type: Number, required: true },
    duration: { type: Number, required: true }, //  eg:30 day
    isActive: { type: Boolean, default: true },
    uhd: { type: Boolean, default: false },
    live: { type: Boolean, default: false },
    ads: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SubscriptionTypeModel = mongoose.model(
  "SubscriptionPlans",
  subscriptionTypeSchema
);

export default SubscriptionTypeModel;

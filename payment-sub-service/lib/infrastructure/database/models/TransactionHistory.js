import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "IND",
    },
    planId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlans",
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);

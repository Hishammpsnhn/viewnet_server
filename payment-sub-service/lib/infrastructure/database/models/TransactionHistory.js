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
    // paymentMethod: {
    //   type: String,
    //   enum: ["Credit Card", "Debit Card", "PayPal", "Bank Transfer", "Cash"],
    //   required: true,
    // },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);

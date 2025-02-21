import mongoose from "mongoose";
import TransactionModel from "../../database/models/TransactionHistory.js";

export default class TransactionRepository {
  async create(transactionData) {
    if (transactionData.transactionId) {
      const existingTransaction = await TransactionModel.findById(
        new mongoose.Types.ObjectId(transactionData.transactionId) 
      );
      if (!existingTransaction) {
        throw new Error(
          `Transaction not found ${transactionData.transactionId}`
        );
      }

      return await TransactionModel.findOneAndUpdate(
        { _id: existingTransaction._id },
        { $set: { status: transactionData.status } },

      );
    } else {
      return await TransactionModel.create(transactionData);
    }
  }

  async getAllTransactions({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const transactions = await TransactionModel.find()
      .populate({ path: "planId", select: "name" })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTransactions = await TransactionModel.countDocuments();

    return {
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    };
  }
}

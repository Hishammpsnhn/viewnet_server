import TransactionModel from "../../database/models/TransactionHistory.js";

export default class TransactionRepository {
  async create(transactionData) {
    return await TransactionModel.create(transactionData);
  }

  async getAllTransactions({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const transactions = await TransactionModel
      .find()
      .populate({path:"planId",select:"name"})
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

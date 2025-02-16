import GetAllTransactionsUseCase from "../../use-cases/Transaction/getAllTransaction.js";
import TransactionRepository from "../../infrastructure/repository/Transaction/TransactionHistory.js";
import Transaction from "../../domain/entities/TransactionHistory.js"; 

const transactionRepository = new TransactionRepository(Transaction);
const getAllTransactionsUseCase = new GetAllTransactionsUseCase(transactionRepository);

const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await getAllTransactionsUseCase.execute({ page, limit });

    res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default { getAllTransactions };

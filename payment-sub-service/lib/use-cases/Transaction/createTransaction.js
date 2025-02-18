import Transaction from "../../domain/entities/TransactionHistory.js";

export default class CreateTransactionUseCase {
  constructor(transactionRepository) {
    this.transactionRepository = transactionRepository;
  }

  async execute(transactionData) {
    const transaction = new Transaction(transactionData);
    return await this.transactionRepository.create(transaction);
  }
}

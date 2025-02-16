export default class GetAllTransactionsUseCase {
    constructor(transactionRepository) {
      this.transactionRepository = transactionRepository;
    }
  
    async execute({ page, limit }) {
      return await this.transactionRepository.getAllTransactions({ page, limit });
    }
  }
  
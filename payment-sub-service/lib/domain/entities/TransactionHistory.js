class Transaction {
    constructor({ userId, amount, currency, planId, status,email}) {
      if (!userId || !amount || !planId || !email) {
        throw new Error("Missing required fields");
      }
      this.userId = userId;
      this.amount = amount;
      this.currency = currency || "IND";
      this.planId = planId;
      this.email = email;
      this.status = status || "Completed";
    }
  }
  
  export default Transaction;
  
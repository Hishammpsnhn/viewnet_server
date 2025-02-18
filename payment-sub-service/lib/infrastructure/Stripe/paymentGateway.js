import Stripe from "stripe";
import dotenv from "dotenv";
import CreateTransactionUseCase from "../../use-cases/Transaction/createTransaction.js";
import TransactionRepository from "../repository/Transaction/TransactionHistory.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const transactionRepository = new TransactionRepository();
const createTransactionUseCase = new CreateTransactionUseCase(
  transactionRepository
);

export default class paymentGateway {
  // async processPayment({ amount, currency, userId, planId }) {
  
  //   try {
  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount: amount * 100,
  //       currency,
  //       metadata: {
  //         user_id: userId,
  //         plan_id: planId,
  //       },
  //       automatic_payment_methods: { enabled: true },
  //     });

  //     return paymentIntent.client_secret;
  //   } catch (error) {
  //     console.error("Stripe payment error:", error);
  //     throw new Error(error);
  //   }
  // }

  // async createPaymentIntent({ amount, currency }) {
  //   try {
  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount,
  //       currency,
  //     });

  //     return paymentIntent.client_secret;
  //   } catch (error) {
  //     console.error("Stripe create payment intent error:", error);
  //     return {
  //       success: false,
  //       error: error.message,
  //     };
  //   }
  // }

  // async retrievePaymentIntent(paymentIntentId) {
  //   try {
  //     const paymentIntent = await stripe.paymentIntents.retrieve(
  //       paymentIntentId
  //     );

  //     return paymentIntent;
  //   } catch (error) {
  //     console.error("Stripe retrieve payment intent error:", error);
  //     return {
  //       success: false,
  //       error: error.message,
  //     };
  //   }
  // }

  async productGateway(userId, plan, email) {
  

    try {
      if (!plan || !plan.name || !plan.price || !email) {
        throw new Error("Invalid plan details provided");
      }
      const transaction = await createTransactionUseCase.execute({
        userId,
        status: "Pending",
        planId: plan.id.toString(),
        amount: plan.price,
        email,
      });

      // Create a product in Stripe
      const planPayment = await stripe.products.create({
        name: plan.name, // User-selected plan name
      });

      if (!planPayment) {
        throw new Error("Failed to create product in Stripe");
      }

      // Create a price for the product
      const price = await stripe.prices.create({
        product: planPayment.id,
        currency: "inr",

        unit_amount: plan.price * 100,
      });

      if (!price.id) {
        throw new Error("Failed to create price in Stripe");
      }

      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: "payment", // Use "payment" for one-time purchase
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&amount=${plan.price}`,
        cancel_url: `http://localhost:5173/cancel`,
        metadata: {
          userId: userId,
          transactionId: transaction._id.toString(),
          planId: plan.id.toString(),
          planName: plan.name,
          planPrice: plan.price,
          email,
        },
      });

      return session;
    } catch (error) {
      console.error("Stripe Payment Error:", error.message);
      throw new Error("Payment processing failed");
    }
  }
}

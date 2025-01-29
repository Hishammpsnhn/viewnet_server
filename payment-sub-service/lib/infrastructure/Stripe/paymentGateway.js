import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default class paymentGateway {
  async processPayment({ amount, currency, userId, planId }) {
    console.log(amount, currency);
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
        automatic_payment_methods: { enabled: true },
      });

      return paymentIntent.client_secret;
    } catch (error) {
      console.error("Stripe payment error:", error);
      throw new Error(error);
    }
  }

  /**
   * Create a payment intent for later confirmation
   * @param {Object} params - Payment parameters
   * @param {number} params.amount - Amount to be charged (in smallest currency unit)
   * @param {string} params.currency - Currency code (e.g., 'usd')
   * @returns {Object} - Payment intent details
   */
  async createPaymentIntent({ amount, currency }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      return paymentIntent.client_secret;
    } catch (error) {
      console.error("Stripe create payment intent error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Retrieve a payment intent
   * @param {string} paymentIntentId - ID of the payment intent
   * @returns {Object} - Payment intent details
   */
  async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      return paymentIntent
      
    } catch (error) {
      console.error("Stripe retrieve payment intent error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
